from typing import Literal

from fastapi import FastAPI, HTTPException
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

class IssueCreate(BaseModel):
    title: str

class IssueUpdate(BaseModel):
    status: Literal["open", "resolved"]

issues = [
    Issue(id=1, title="Login bug", status="open"),
    Issue(id=2, title="Dashboard Error", status="resolved"),
    Issue(id=3, title="API Timeout", status="open")
]


@app.get("/issues", response_model=list[Issue])
def get_issues():
    return issues

@app.post("/issues", response_model=Issue, status_code=201)
def create_issue(payload: IssueCreate):
    title = payload.title.strip()

    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    next_id = max((issue.id for issue in issues), default=0) + 1

    new_issue = Issue(
        id = next_id,
        title=title,
        status="open"
    )

    issues.append(new_issue)
    return new_issue


@app.patch("/issues/{issue_id}", response_model=Issue)
def update_issue(issue_id: int, payload: IssueUpdate):
    print("Recieved payload: ", payload)
    print("Received issue id: ", issue_id)
    print("===========")
    for issue in issues:
        if issue.id == issue_id:
            issue.status = payload.status
            return issue

    raise HTTPException(status_code=404, detail="Issue not found")

