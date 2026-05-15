import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from routes.analyze import router

logging.basicConfig(level=logging.INFO)
load_dotenv()

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://brandkai.amachulsky.com", "http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
app.include_router(router, prefix="/api")
app.mount("/image", StaticFiles(directory="uploads"), name="images")
