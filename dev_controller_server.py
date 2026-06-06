from flask import Flask, jsonify, request
from flask_cors import CORS

import subprocess
import threading
import logging
import psutil
import time

# ------------------------------------------------------------------
# DISABLE FLASK REQUEST LOGS
# ------------------------------------------------------------------

log = logging.getLogger('werkzeug')

log.disabled = True

# ------------------------------------------------------------------
# APP
# ------------------------------------------------------------------

app = Flask(__name__)

CORS(app)

# ------------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------------

PROJECT_PATH = r"C:\Users\sulthan.latheef\figma_import_2\figma-import"

# ------------------------------------------------------------------
# GLOBAL STATE
# ------------------------------------------------------------------

server_process = None

server_logs = []

server_running = False
# ------------------------------------------------------------------
# NETWORK TRACKING
# ------------------------------------------------------------------

last_net = psutil.net_io_counters()

last_time = time.time()

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

        ["docker", "compose", "up"],

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

# ------------------------------------------------------------------
# MAIN
# ------------------------------------------------------------------

if __name__ == '__main__':

    app.run(

        host='0.0.0.0',

        port=3001,

        debug=False
    )