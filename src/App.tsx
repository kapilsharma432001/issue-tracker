import { useState, useEffect, type FormEvent } from "react";

type IssueStatus = "open" | "resolved";
type IssueFilter = "all" | IssueStatus;

interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
}

// const initialIssues: Issue[] = [
//   { id: 1, title: "Login bug", status: "open" },
//   { id: 2, title: "Dashboard error", status: "resolved" },
//   { id: 3, title: "API timeout", status: "open" },
// ];

interface IssueCardProps {
  issue: Issue;
  onResolve: (id: number) => void;
  resolvingId: number | null;
}

function IssueCard({ issue, onResolve, resolvingId }: IssueCardProps) {
  return (
    <div>
      <h3>{issue.title} </h3>
      <p> Status: {issue.status} </p>

      {issue.status === "open" ? (
        <button onClick={() => onResolve(issue.id)} disabled={resolvingId === issue.id}>
          {resolvingId === issue.id ? "Resolving..." : "Resolve" }
          </button>
      ) : (
        <span>Resolved ✅</span>
      )}
    </div>
  );
}

// function IncreaseCounter() {
//   const [count, setCount] = useState<number>(0);

//   return (
//     <button onClick={() => setCount((count) => count + 1)}>
//       Count: {count}
//     </button>
//   );
// }

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<IssueFilter>("all");
  const [newTitle, setNewTitle] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState("");

  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [resolveError, setResolveError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadIssues() {
      try {
        const response = await fetch("http://localhost:8000/issues");

        if (!response.ok) {
          throw new Error("Failed to fetch issues");
        }
        const data: Issue[] = await response.json();
        if (!ignore) setIssues(data);
      } catch (error) {
        if (!ignore) {
          setError(error instanceof Error ? error.message : "Unknown error");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadIssues();

    // React's cleanup function, runs when component unmounts or effect needs to run again
    return () => {
      ignore = true;
    };
  }, []);

  const openCount = issues.filter((issue) => issue.status === "open").length;
  useEffect(() => {
    document.title = `Issue tracker (${openCount} open)`;
  }, [openCount]);

  // if issue = 'all' then include every issue
  // else include only the issuee whose status matches the selected filter
  const filteredIssues = issues.filter(
    (issue) => filter === "all" || issue.status === filter,
  );

  async function resolveIssue(id: number): Promise<void> {
    if (resolvingId !== null) return;

    setResolvingId(id);
    setResolveError("");

    try {
      const response = await fetch(`http://localhost:8000/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });

      if (!response.ok) {
        throw new Error("Failed to resolve issue");
      }

      const updatedIssue: Issue = await response.json();

      setIssues((prev) =>
        prev.map((issue) => (issue.id === id ? updatedIssue : issue)),
      );
    } catch {
      setResolveError("Could not resolve issue. Please try again !");
    } finally {
      setResolvingId(null);
    }
  }

  async function handleAddIssue(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const title = newTitle.trim();
    if (!title || saving) return;

    setSaving(true);
    setAddError("");

    try {
      const response = await fetch("http://localhost:8000/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to create issue");
      }

      const newIssue: Issue = await response.json();

      setIssues((prev) => [...prev, newIssue]);
      setNewTitle("");
      setFilter("all");
    } catch {
      setAddError("Cound not create issue, please try again !!");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main>
      <h1>Issue Tracker</h1>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("open")}>Open</button>
        <button onClick={() => setFilter("resolved")}>Resolved</button>
      </div>
      {/* {filteredIssues.length === 0 && (
        <p>No issues found.</p>
      )} */}
      {loading && <p>Loading issues...</p>}
      {error && <p>Error: {error} </p>}
      {!loading && !error && filteredIssues.length === 0 && (
        <p>No issues found.</p>
      )}

      {!loading &&
        !error &&
        filteredIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onResolve={resolveIssue} resolvingId={resolvingId} />
        ))}
      
      {resolveError && <p role="alert">{resolveError}</p>}

      {/* <IncreaseCounter /> */}
      <form onSubmit={handleAddIssue}>
        <label htmlFor="issue-title">Issue Title: </label>
        <input
          id="issue-title"
          type="text"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="Enter issue title"
          required
          disabled={saving}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add Issue"}
        </button>

        {addError && <p role="alert">{addError}</p>}
      </form>
    </main>
  );
}

export default App;
