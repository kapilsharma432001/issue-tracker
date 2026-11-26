import type { Issue } from "../types/issue";

const API_URL = "http://localhost:8000";

// GET - fetch all issues
export async function getIssues(): Promise<Issue[]> {
    const response = await fetch(`${API_URL}/issues`)

    if(!response.ok){
        throw new Error("Failed to fetch issues");
    }

    return response.json();
}

// POST - Create an issue
export async function createIssue(title: string): Promise<Issue> {
    const response = await fetch(`${API_URL}/issues`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title})
    });

    if(!response.ok){
        throw new Error("Failed to create issue");
    }

    return response.json()

}

// PATCH - resolve an issue
export async function resolveIssueById(id: number): Promise<Issue> {
    const response = await fetch(`${API_URL}/issues/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status: "resolved"})
    })

    if(!response.ok){
        throw new Error("Failed to resolve issue");
    }

    return response.json()
}