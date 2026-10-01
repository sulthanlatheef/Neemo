import json
import os
import shutil
import socket
import subprocess
import sys
import threading
import time
import webbrowser

import webview


# ============================================================
# CONFIGURATION
# ============================================================

CONTROLLER_HOST = "127.0.0.1"
CONTROLLER_PORT = 5003

NEEMO_HOST = "127.0.0.1"
NEEMO_PORT = 8081

NEEMO_URL = f"http://{NEEMO_HOST}:{NEEMO_PORT}"

WINDOW_WIDTH = 680
WINDOW_HEIGHT = 700


# ============================================================
# PATH HANDLING
# ============================================================


def get_launcher_directory():
    """Return the directory containing the launcher script/EXE."""
    if getattr(sys, "frozen", False):
        return os.path.dirname(os.path.abspath(sys.executable))

    return os.path.dirname(os.path.abspath(__file__))


def get_neemo_root():
    """
    Locate the Neemo project root by searching upward
    for docker-compose.yml and controller.py.
    """
    current_dir = get_launcher_directory()

    while True:
        docker_compose = os.path.join(
            current_dir,
            "docker-compose.yml"
        )

        controller_file = os.path.join(
            current_dir,
            "controller.py"
        )

        if (
            os.path.exists(docker_compose)
            and os.path.exists(controller_file)
        ):
            return current_dir

        parent_dir = os.path.dirname(current_dir)

        if parent_dir == current_dir:
            break

        current_dir = parent_dir

    return None


def get_asset_path(filename):
    """Resolve launcher assets for normal Python and PyInstaller builds."""
    if getattr(sys, "frozen", False):
        base_dir = getattr(
            sys,
            "_MEIPASS",
            get_launcher_directory(),
        )
    else:
        base_dir = get_launcher_directory()

    return os.path.join(base_dir, filename)


# ============================================================
# SYSTEM FUNCTIONS
# ============================================================


def is_port_open(host, port):
    try:
        with socket.create_connection((host, port), timeout=1):
            return True
    except (ConnectionRefusedError, TimeoutError, OSError):
        return False


def wait_for_port(host, port, timeout=30, cancel_event=None):
    start_time = time.time()

    while time.time() - start_time < timeout:
        if cancel_event and cancel_event.is_set():
            return False

        if is_port_open(host, port):
            return True

        time.sleep(1)

    return False


# ============================================================
# DOCKER
# ============================================================


def check_docker():
    try:
        result = subprocess.run(
            ["docker", "info"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=10,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )

        return result.returncode == 0

    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        return False


def start_docker_services(neemo_root):
    try:
        result = subprocess.run(
            [
                "docker",
                "compose",
                "up",
                "-d",
            ],
            cwd=neemo_root,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
            timeout=120,
            creationflags=subprocess.CREATE_NO_WINDOW,
        )

        return result.returncode == 0

    except (subprocess.TimeoutExpired, OSError):
        return False


# ============================================================
# CONTROLLER
# ============================================================


def get_controller_python():
    """
    Return a Python executable capable of running controller.py.

    When running the .py launcher, use the same Python environment.
    When running a frozen EXE, sys.executable points to the launcher EXE,
    so we locate a normal Python interpreter on PATH.

    python.exe is preferred so the controller process behaves the same
    as it did during development. CREATE_NO_WINDOW is still used when
    starting the process, so no console window will appear.
    """
    if not getattr(sys, "frozen", False):
        return sys.executable

    return (
        shutil.which("python.exe")
        or shutil.which("pythonw.exe")
        or shutil.which("py.exe")
    )


def start_controller(neemo_root):
    controller_file = os.path.join(neemo_root, "controller.py")

    if not os.path.exists(controller_file):
        return False

    # Reuse an already-running controller.
    if is_port_open(CONTROLLER_HOST, CONTROLLER_PORT):
        return True

    python_executable = get_controller_python()

    if not python_executable:
        return False

    if os.path.basename(python_executable).lower() == "py.exe":
        command = [
            python_executable,
            "-3",
            controller_file,
        ]
    else:
        command = [
            python_executable,
            controller_file,
        ]

    try:
        subprocess.Popen(
            command,
            cwd=neemo_root,
            creationflags=subprocess.CREATE_NO_WINDOW,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    except OSError:
        return False

    return wait_for_port(
        CONTROLLER_HOST,
        CONTROLLER_PORT,
        timeout=30,
    )


# ============================================================
# PYTHON <-> JAVASCRIPT BRIDGE
# ============================================================


class LauncherAPI:
    def __init__(self, launcher):
        self._launcher = launcher

    def ready(self):
        self._launcher.start()
        return True

    def close(self):
        self._launcher.close_window()
        return True


# ============================================================
# HTML/CSS LAUNCHER
# ============================================================


class NeemoLauncher:
    def __init__(self):
        self.window = None
        self.api = LauncherAPI(self)
        self.start_thread = None
        self.started = False
        self.closed = False
        self.lock = threading.Lock()

    # ========================================================
    # JAVASCRIPT HELPERS
    # ========================================================

    def _run_js(self, script):
        if not self.window or self.closed:
            return

        try:
            self.window.evaluate_js(script)
        except Exception:
            # The UI can disappear naturally during shutdown.
            pass

    def _call_js(self, function_name, *args):
        encoded_args = ", ".join(json.dumps(arg) for arg in args)
        self._run_js(f"{function_name}({encoded_args})")

    def set_status(self, text, state="working"):
        self._call_js("setStatus", text, state)

    def set_progress(self, percentage):
        percentage = max(0.0, min(100.0, float(percentage)))
        self._call_js("setProgress", percentage)

    def set_service(self, service, state):
        self._call_js("setService", service, state)

    def fail(self, message):
        self.set_status("Startup failed", "error")
        self._call_js("showError", message)

    # ========================================================
    # WINDOW
    # ========================================================

    def close_window(self):
        with self.lock:
            self.closed = True

        if self.window:
            try:
                self.window.destroy()
            except Exception:
                pass

    # ========================================================
    # STARTUP
    # ========================================================

    def start(self):
        with self.lock:
            if self.started:
                return
            self.started = True

        self.start_thread = threading.Thread(
            target=self.startup_sequence,
            daemon=True,
        )
        self.start_thread.start()

    def startup_sequence(self):
        neemo_root = get_neemo_root()
        if not neemo_root:
            self.fail("Neemo installation not found.")
            return

        # ----------------------------------------------------
        # Validate project
        # ----------------------------------------------------

        docker_compose = os.path.join(
            neemo_root,
            "docker-compose.yml",
        )

        if not os.path.exists(docker_compose):
            self.fail("Neemo installation not found.")
            return

        # ----------------------------------------------------
        # Docker
        # ----------------------------------------------------

        self.set_status("Checking Docker...")
        self.set_service("docker", "working")
        time.sleep(5)
      
        if not check_docker():
            self.set_service("docker", "error")
            self.fail("Docker Desktop is not running.")
            return

        self.set_service("docker", "success")
        self.set_progress(30)
        
        # ----------------------------------------------------
        # Docker Compose
        # ----------------------------------------------------

        self.set_status("Starting Neemo services...")

        if not start_docker_services(neemo_root):
            self.set_service("web", "error")
            self.fail("Failed to start Docker services.")
            return

        self.set_progress(55)

        # ----------------------------------------------------
        # Controller
        # ----------------------------------------------------

        self.set_status("Starting Neemo Controller...")
        self.set_service("controller", "working")
        time.sleep(5)

        if not start_controller(neemo_root):
            self.set_service("controller", "error")
            self.fail("Neemo Controller could not be started.")
            return

        self.set_service("controller", "success")
        self.set_progress(75)

        # ----------------------------------------------------
        # Web
        # ----------------------------------------------------

        self.set_status("Waiting for Neemo...")
        self.set_service("web", "working")
        time.sleep(5)

        if not wait_for_port(
            NEEMO_HOST,
            NEEMO_PORT,
            timeout=60,
        ):
            self.set_service("web", "error")
            self.fail("Neemo web server did not start.")
            return

        self.set_service("web", "success")
        self.set_progress(100)

        # ----------------------------------------------------
        # Ready
        # ----------------------------------------------------

        self.set_status("Neemo is ready!", "success")

        time.sleep(1.5)

        # ----------------------------------------------------
        # Chrome
        # ----------------------------------------------------

        self.open_chrome()

        time.sleep(0.5)

        self.close_window()

    # ========================================================
    # CHROME
    # ========================================================

    def open_chrome(self):
        chrome_paths = [
            os.path.expandvars(
                r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"
            ),
            os.path.expandvars(
                r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
            ),
            os.path.expandvars(
                r"%LocalAppData%\Google\Chrome\Application\chrome.exe"
            ),
        ]

        chrome_path = next(
            (
                path
                for path in chrome_paths
                if os.path.exists(path)
            ),
            None,
        )

        if chrome_path:
            try:
                subprocess.Popen(
                    [chrome_path, NEEMO_URL],
                    creationflags=subprocess.CREATE_NO_WINDOW,
                )
                return
            except OSError:
                pass

        webbrowser.open(NEEMO_URL)

    # ========================================================
    # RUN
    # ========================================================

    def run(self):
        html_path = get_asset_path("launcher.html")

        if not os.path.exists(html_path):
            raise FileNotFoundError(
                f"Launcher UI file not found: {html_path}"
            )

        self.window = webview.create_window(
            "Neemo",
            url=html_path,
            js_api=self.api,
            width=WINDOW_WIDTH,
            height=WINDOW_HEIGHT,
            resizable=False,
            frameless=True,
            easy_drag=False,
            on_top=True,
            background_color="#070B16",
            text_select=False,
        )

        # pywebview's GUI loop belongs on the main thread.
        webview.start()


# ============================================================
# ENTRY POINT
# ============================================================


if __name__ == "__main__":
    app = NeemoLauncher()
    app.run()
