import { useState } from "react";

type IssueStatus = "open" | "resolved";

interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
}

const initialIssues: Issue[] = [
  { id: 1, title: "Login bug", status: "open" },
  { id: 2, title: "Dashboard error", status: "resolved" },
  { id: 3, title: "API timeout", status: "open" },
];

interface IssueCardProps {
  issue: Issue;
  onResolve: (id: number) => void;
}

function IssueCard({ issue, onResolve }: IssueCardProps) {
  return (
    <div>
      <h3>{issue.title} </h3>
      <p> Status: {issue.status} </p>

      {issue.status === "open" ? (
        <button onClick={() => onResolve(issue.id)}>Resolve</button>
      ): (
        <span>Resolved ✅</span>
      )}
    </div>
  );
}

function IncreaseCounter() {
  const [count, setCount] = useState<number>(0);

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Count: {count}
    </button>
  );
}

function App() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  function resolveIssue(id: number): void {
    setIssues((prev) =>
      prev.map((issue): Issue =>
        issue.id === id ? { ...issue, status: "resolved" } : issue,
      ),
    );
  }
  return (
    <main>
      <h1>Issue Tracker</h1>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} onResolve={resolveIssue} />
      ))}
      <IncreaseCounter />
    </main>
  );
}

export default App;
