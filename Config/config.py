import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Configuration values
DOCKER_PROJECT_PATH = os.getenv("DOCKER_PROJECT_PATH")
LOCAL_WS_URL = os.getenv("LOCAL_WS_URL")
PRODUCTION_WS_URL = os.getenv("PRODUCTION_WS_URL")
MINT_URL = os.getenv("MINT_URL")
MINT_SECRET = os.getenv("MINT_SECRET")
NEEMO_PROJECT_PATH = os.getenv("NEEMO_PROJECT_PATH")
USER_ID=os.getenv("USER_ID")