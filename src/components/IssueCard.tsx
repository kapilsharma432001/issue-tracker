import type { Issue } from "../types/issue";

interface IssueCardProps{
    issue: Issue;
    onResolve: (id: number) => void;
    resolvingId: number | null;
}

function IssueCard({issue, onResolve, resolvingId}: IssueCardProps) {
    return (
        <div>
            <h3>{issue.title}</h3>
            <p>Status: {issue.status}</p>

            {issue.status === "open" ? 
            (
                <button onClick={() => onResolve(issue.id)} disabled = {resolvingId !== null}>
                    {resolvingId === issue.id ? "Resolving..." : "Resolve"}
                </button>
                ): 
                (<span>Resolved ✅</span>)}
        </div>
    )
}

export default IssueCard;