@echo off
setlocal

cd /d "%~dp0"

for /f "usebackq tokens=1,* delims==" %%A in ("..\.env") do (
    set "%%A=%%B"
)

echo PYTHON_PATH=%PYTHON_PATH%


"%PYTHON_PATH%" Neemo_engine.py

pause