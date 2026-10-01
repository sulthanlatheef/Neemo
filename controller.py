from flask import Flask, jsonify
from dotenv import load_dotenv
import os
import subprocess

app = Flask(__name__)

load_dotenv()

NEMO_BAT_FILE = os.getenv("NEMO_BAT_FILE")


# ------------------------------------------------------------------
# START NEMO
# ------------------------------------------------------------------

@app.route("/start", methods=["GET"])
def start_nemo():

    try:
        
        if not NEMO_BAT_FILE:
            return jsonify({
                "status": "error",
                "message": "NEMO_BAT_FILE is not configured"
            }), 500

        if not os.path.exists(NEMO_BAT_FILE):
            return jsonify({
                "status": "error",
                "message": f"Batch file not found: {NEMO_BAT_FILE}"
            }), 500

        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startupinfo.wShowWindow = subprocess.SW_HIDE

        subprocess.Popen(
            [
             "cmd",
             "/c",
            NEMO_BAT_FILE
            ],
           startupinfo=startupinfo,
           creationflags=subprocess.CREATE_NO_WINDOW
              )
        return jsonify({
            "status": "started"
        })

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ------------------------------------------------------------------
# STOP NEMO
# ------------------------------------------------------------------

@app.route("/stop", methods=["GET"])
def stop_nemo():

    try: 

        subprocess.Popen(
            [
                "taskkill",
                "/F",
                "/IM",
                "pythonw.exe"
            ],
            creationflags=subprocess.CREATE_NO_WINDOW
        )

        return jsonify({
            "status": "shutdown"
        })

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ------------------------------------------------------------------
# RUN CONTROLLER
# ------------------------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5003,
        debug=False
    )