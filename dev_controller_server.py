from flask import Flask, jsonify, request
from flask_cors import CORS
import asyncio
import os
import requests
import subprocess
import threading
import logging
import psutil
import time
from config import DOCKER_PROJECT_PATH,NEMO_PROJECT_PATH,USER_ID

from websocket_client import (
    submit_url,
    convert
)

# ------------------------------------------------------------------
# DISABLE FLASK REQUEST LOGS
# ------------------------------------------------------------------

#log = logging.getLogger('werkzeug')

#log.disabled = True

# ------------------------------------------------------------------
# APP
# ------------------------------------------------------------------

app = Flask(__name__)

CORS(app)

# Global environment
environment = "local"

# ------------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------------

PROJECT_PATH = DOCKER_PROJECT_PATH
CONTROL_SERVER = "https://neemo-controller-server.onrender.com"

# ------------------------------------------------------------------
# GLOBAL STATE
# ------------------------------------------------------------------

server_process = None

server_logs = []

server_running = False

# ------------------------------------------------------------------
# REQUEST TRACKING
# ------------------------------------------------------------------

total_requests = 0
request_count_lock = threading.Lock()
# ------------------------------------------------------------------
# NETWORK TRACKING
# ------------------------------------------------------------------

last_net = psutil.net_io_counters()

last_time = time.time()

@app.route("/set-environment", methods=["POST"])
def set_environment():
    global environment

    data = request.get_json()

    env = data.get("environment")

    if env not in ["local", "dev"]:
        return jsonify({
            "success": False,
            "message": "Invalid environment."
        }), 400

    environment = env

    print(f"Environment changed to: {environment}")

    return jsonify({
        "success": True,
        "environment": environment
    })

@app.route("/get-environment", methods=["GET"])
def get_environment():
    return jsonify({
        "environment": environment
    })
# ------------------------------------------------------------------
# LOG READER
# ------------------------------------------------------------------

def read_logs(process):

    global server_logs
    global server_running

    try:

        for line in iter(process.stdout.readline, ''):

            if line:

                clean_line = line.strip()

                print(clean_line)

                server_logs.append(clean_line)

                

    except Exception as e:

        server_logs.append(
            f"LOG ERROR: {str(e)}"
        )

    finally:

        server_running = False

# ------------------------------------------------------------------
# START SERVER
# ------------------------------------------------------------------

@app.route('/start')

def start_server():

    global server_process
    global server_running

    if server_running:

        return jsonify({
            "status": "already_running"
        })

    server_logs.clear()

    server_process = subprocess.Popen(

        ["docker", "compose", "up", "--build"],

        cwd=PROJECT_PATH,

        stdout=subprocess.PIPE,

        stderr=subprocess.STDOUT,

        text=True,

        bufsize=1,

        creationflags=subprocess.CREATE_NO_WINDOW
    )

    server_running = True

    # BACKGROUND LOG THREAD

    thread = threading.Thread(

        target=read_logs,

        args=(server_process,)
    )

    thread.daemon = True

    thread.start()

    return jsonify({
        "status": "started"
    })

# ------------------------------------------------------------------
# STOP SERVER
# ------------------------------------------------------------------

@app.route('/stop')

def stop_server():

    global server_running

    subprocess.run(

        ["docker", "compose", "down"],

        cwd=PROJECT_PATH,

        creationflags=subprocess.CREATE_NO_WINDOW
    )

    server_running = False
    server_logs.clear()

    server_logs.append(
        "SERVER STOPPED NEEMO"
    )

    return jsonify({
        "status": "stopped"
    })

# ------------------------------------------------------------------
# RESTART SERVER
# ------------------------------------------------------------------

@app.route('/restart')

def restart_server():

    stop_server()

    start_server()
    return jsonify({
        "status": "Restarted"
    })

# ------------------------------------------------------------------
# GET LOGS
# ------------------------------------------------------------------

@app.route('/logs')

def get_logs():

    return jsonify({

        "logs": server_logs,

        "running": server_running
    })

# ------------------------------------------------------------------
# STATUS
# ------------------------------------------------------------------

@app.route('/status')

def status():

    return jsonify({
        "running": server_running
    })
# ------------------------------------------------------------------
# LIVE PERFORMANCE METRICS
# ------------------------------------------------------------------

@app.route('/metrics')

def metrics():

    global last_net
    global last_time

    try:

        # ----------------------------------------------------------
        # CPU
        # ----------------------------------------------------------

        cpu_usage = psutil.cpu_percent(interval=0.8)

        # ----------------------------------------------------------
        # RAM
        # ----------------------------------------------------------

        ram_usage = psutil.virtual_memory().percent

        # ----------------------------------------------------------
        # NETWORK SPEED
        # ----------------------------------------------------------

        current_net = psutil.net_io_counters()

        current_time = time.time()

        time_diff = current_time - last_time

        bytes_sent = (
            current_net.bytes_sent -
            last_net.bytes_sent
        )

        bytes_recv = (
            current_net.bytes_recv -
            last_net.bytes_recv
        )

        upload_speed = (
            bytes_sent / time_diff
        ) / 1024

        download_speed = (
            bytes_recv / time_diff
        ) / 1024

        # ----------------------------------------------------------
        # UPDATE PREVIOUS VALUES
        # ----------------------------------------------------------

        last_net = current_net

        last_time = current_time

        # ----------------------------------------------------------
        # RETURN
        # ----------------------------------------------------------

        return jsonify({

            "cpu": round(cpu_usage),

            "ram": round(ram_usage),

            "network": round(download_speed, 1),

            "server_running": server_running
        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500

# ------------------------------------------------------------------
# SHUTDOWN NEMO
# ------------------------------------------------------------------

@app.route('/shutdown')

def shutdown():
    stop_server()

    subprocess.Popen(

        [
            "taskkill",
            "/F",
            "/IM",
            "pythonw.exe"
        ],

        creationflags=
            subprocess.CREATE_NO_WINDOW
    )

    return jsonify({
        "status": "shutdown"
    })
    
# ------------------------------------------------------------
# Load Frames
# ------------------------------------------------------------

@app.post("/load_frames")
def load_frames():

    try:

        data = request.get_json(force=True)

        figma_url = data.get("figma_url")

        if not figma_url:
            return jsonify({
                "status": "error",
                "message": "figma_url is required"
            }), 400

        result = asyncio.run(
            submit_url(figma_url,environment)
        )
        
        global total_requests

        with request_count_lock:
            total_requests += 1

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ------------------------------------------------------------
# Generate JSON
# ------------------------------------------------------------

@app.post("/generate_json")
def generate_json():

    try:

        data = request.get_json(force=True)

        file_key = data.get("file_key")
        frame_name = data.get("frame_name")

        if not file_key or not frame_name:

            return jsonify({

                "status": "error",

                "message":
                    "file_key and frame_name are required"

            }), 400

        result = asyncio.run(

            convert(
                file_key,
                frame_name,
                environment
            )

        )
        global total_requests

        with request_count_lock:
            total_requests += 1

        return jsonify(result)

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)

        }), 500

@app.route("/update-client", methods=["POST"])
def update_client():

    if not os.path.exists(NEMO_PROJECT_PATH):

        return jsonify({

            "status": "error",

            "message": "Nemo project path not found."

        }), 404

    try:

        # -------------------------
        # Fetch Latest Changes
        # -------------------------

        fetch_result = subprocess.run(

            [
                "git",
                "-c",
                f"safe.directory={NEMO_PROJECT_PATH}",
                "fetch",
                "origin"
            ],

            cwd=NEMO_PROJECT_PATH,

            capture_output=True,

            text=True,

            check=True

        )

        # -------------------------
        # Pull Latest Changes
        # -------------------------

        pull_result = subprocess.run(

            [
                "git",
                "-c",
                f"safe.directory={NEMO_PROJECT_PATH}",
                "pull",
                "origin",
                "main"
            ],

            cwd=NEMO_PROJECT_PATH,

            capture_output=True,

            text=True,

            check=True

        )

        return jsonify({

            "status": "success",

            "message": "Nemo updated successfully.",

            "fetch_stdout": fetch_result.stdout,

            "fetch_stderr": fetch_result.stderr,

            "pull_stdout": pull_result.stdout,

            "pull_stderr": pull_result.stderr

        })

    except subprocess.CalledProcessError as e:

        return jsonify({

            "status": "error",

            "message": "Git update failed.",

            "stdout": e.stdout,

            "stderr": e.stderr

        }), 500
# ------------------------------------------------------------
# REQUEST COUNT
# ------------------------------------------------------------

@app.get("/request-count")
def get_request_count():

    global total_requests

    with request_count_lock:
        count = total_requests
        total_requests = 0

    return jsonify({
        "count": count
    })
@app.post("/sync-request-count")
def sync_request_count():

    try:

        data = request.get_json()

        count = data.get("count", 0)

        if not isinstance(count, int) or count <= 0:
            return jsonify({
                "status": "error",
                "message": "Invalid request count."
            }), 400

        # --------------------------------------------------------
        # SEND COUNT TO CONTROL SERVER
        # --------------------------------------------------------

        response = requests.post(
            f"{CONTROL_SERVER}/sync-request-count",
            json={
                "user_id": USER_ID,
                "count": count
            },
            timeout=10
        )

        # --------------------------------------------------------
        # CONTROL SERVER ERROR
        # --------------------------------------------------------

        if not response.ok:

            return jsonify({
                "status": "error",
                "message": "Control server rejected request count.",
                "details": response.text
            }), response.status_code

        # --------------------------------------------------------
        # SUCCESS
        # --------------------------------------------------------

        return jsonify({
            "status": "success",
            "count": count
        })

    except requests.RequestException as e:

        return jsonify({
            "status": "error",
            "message": "Unable to connect to control server.",
            "details": str(e)
        }), 502

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

        
@app.route("/get-neemo-user-info", methods=["GET"])
def get_neemo_user_info():

    try:

        # --------------------------------------------------
        # VALIDATE USER ID
        # --------------------------------------------------

        if not USER_ID:
            raise Exception(
                "NEMO_USER_ID is not configured in environment variables."
            )

        # --------------------------------------------------
        # CALL GLOBAL NEMO CONTROLLER
        # --------------------------------------------------

        response = requests.get(
            f"{CONTROL_SERVER}/get_neemo_user_name/{USER_ID}",
            timeout=10
        )

        # Raise exception for 4xx / 5xx responses
        response.raise_for_status()

        global_data = response.json()

        # --------------------------------------------------
        # CHECK GLOBAL SERVER RESPONSE
        # --------------------------------------------------

        if global_data.get("status") != "success":
            return jsonify({
                "status": "error",
                "message": global_data.get(
                    "message",
                    "Failed to retrieve Neemo user information."
                )
            }), 400

        user_data = global_data.get("data", {})

        # --------------------------------------------------
        # RETURN DATA TO FRONTEND
        # --------------------------------------------------

        return jsonify({
            "status": "success",
            "data": {
                "user_id": USER_ID,
                "user_name": user_data.get("user_name"),
                "actual_name": user_data.get("actual_name")
            }
        })

    except requests.RequestException as e:

        return jsonify({
            "status": "error",
            "message": f"Unable to connect to Neemo Controller Server: {str(e)}"
        }), 502

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/get-neemo-daily-request-count", methods=["GET"])
def get_neemo_daily_request_count():

    try:

        # --------------------------------------------------
        # VALIDATE USER ID
        # --------------------------------------------------

        if not USER_ID:
            raise Exception(
                "NEMO_USER_ID is not configured in environment variables."
            )

        # --------------------------------------------------
        # CALL GLOBAL NEMO CONTROLLER
        # --------------------------------------------------

        response = requests.get(
            f"{CONTROL_SERVER}/get-daily-request-count/{USER_ID}",
            timeout=10
        )

        response.raise_for_status()

        global_data = response.json()

        # --------------------------------------------------
        # CHECK GLOBAL SERVER RESPONSE
        # --------------------------------------------------

        if global_data.get("status") != "success":

            return jsonify({
                "status": "error",
                "message": global_data.get(
                    "message",
                    "Failed to retrieve daily request count."
                )
            }), 400

        # --------------------------------------------------
        # GET REQUEST COUNT
        # --------------------------------------------------

        request_count = (
            global_data
            .get("data", {})
            .get("requests", 0)
        )

        # --------------------------------------------------
        # RETURN TO FRONTEND
        # --------------------------------------------------

        return jsonify({
            "status": "success",
            "data": {
                "requests": request_count
            }
        })

    except requests.RequestException as e:

        return jsonify({
            "status": "error",
            "message": (
                "Unable to connect to Neemo Controller Server: "
                f"{str(e)}"
            )
        }), 502

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route("/raise-neemo-bug", methods=["POST"])
def raise_neemo_bug():

    try:

        # --------------------------------------------------
        # VALIDATE USER ID
        # --------------------------------------------------

        if not USER_ID:
            raise Exception(
                "NEMO_USER_ID is not configured in environment variables."
            )

        # --------------------------------------------------
        # GET BUG DATA FROM FRONTEND
        # --------------------------------------------------

        data = request.get_json(silent=True) or {}

        title = data.get("title", "").strip()
        description = data.get("description", "").strip()

        # --------------------------------------------------
        # VALIDATE BUG DATA
        # --------------------------------------------------

        if not title:
            return jsonify({
                "status": "error",
                "message": "Bug title is required."
            }), 400

        if not description:
            return jsonify({
                "status": "error",
                "message": "Bug description is required."
            }), 400

        # --------------------------------------------------
        # CALL GLOBAL NEMO CONTROLLER
        # --------------------------------------------------

        response = requests.post(
            f"{CONTROL_SERVER}/raise-neemo-bug",
            json={
                "user_id": USER_ID,
                "title": title,
                "description": description
            },
            timeout=10
        )

        response.raise_for_status()

        controller_data = response.json()

        # --------------------------------------------------
        # CHECK CONTROLLER RESPONSE
        # --------------------------------------------------

        if controller_data.get("status") != "success":

            return jsonify({
                "status": "error",
                "message": controller_data.get(
                    "message",
                    "Failed to submit bug."
                )
            }), 400

        # --------------------------------------------------
        # SUCCESS
        # --------------------------------------------------

        return jsonify({
            "status": "success",
            "message": "Bug reported successfully."
        })

    except requests.RequestException as e:

        return jsonify({
            "status": "error",
            "message": (
                "Unable to connect to Neemo Controller Server: "
                f"{str(e)}"
            )
        }), 502

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
# ------------------------------------------------------------------
# MAIN
# ------------------------------------------------------------------

if __name__ == '__main__':

    app.run(

        host='0.0.0.0',

        port=3001,

        debug=False
    )