import { useState } from "react";

type IssueStatus = "open" | "resolved";
type IssueFilter = "all" | IssueStatus;

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
  const [filter, setFilter] = useState<IssueFilter>("all");

  // if issue = 'all' then include every issue
  // else include only the issuee whose status matches the selected filter
  const filteredIssues = issues.filter(issue => 
    filter === "all" || issue.status === filter
  )

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
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("open")}>Open</button>
        <button onClick={() => setFilter("resolved")}>Resolved</button>
      </div>
      {filteredIssues.map((issue) => (
        <IssueCard 
        key={issue.id} 
        issue={issue}
         onResolve={resolveIssue} />
      ))}
      <IncreaseCounter />
    </main>
  );
}

export default App;
