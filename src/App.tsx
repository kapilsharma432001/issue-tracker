import { useState, useEffect, type FormEvent } from "react";
import type { Issue, IssueFilter as FilterType} from "./types/issue";
import IssueCard from "./components/IssueCard";
import IssueFilter from "./components/IssueFilter";
import IssueForm from "./components/IssueForm";
import { getIssues, createIssue, resolveIssueById } from "./api/issues";


function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
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
        const data = await getIssues();
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
      const updatedIssue = await resolveIssueById(id);

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
      const newIssue = await createIssue(title);

      setIssues(prev => [...prev, newIssue]);
      setNewTitle("");
      setFilter("all");
    } catch {
      setAddError("Could not create issue, please try again !!");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main>
      <h1>Issue Tracker</h1>
      <div>
        <IssueFilter filter = {filter} onFilterChange={setFilter}/>
      </div>
      
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

      <IssueForm
        title={newTitle}
        onTitleChange={setNewTitle}
        onSubmit={handleAddIssue}
        saving={saving}
        error={addError}
      />
    </main>
  );
}

export default App;
