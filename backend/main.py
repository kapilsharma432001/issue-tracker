from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Content-type"],
)

class Issue(BaseModel):
    id: int
    title: str
    status: Literal["open", "resolved"]


issues = [
    Issue(id=1, title="Login bug", status="open"),
    Issue(id=2, title="Dashboard Error", status="resolved"),
    Issue(id=3, title="API Timeout", status="open")
]


@app.get("/issues", response_model=list[Issue])
def get_issues():
    return issues
