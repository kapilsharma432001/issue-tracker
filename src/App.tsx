import { useState } from "react";

type IssueStatus = "open" | "resolved";

interface Issue{
  id: number;
  title: string;
  status: IssueStatus;
}

const issues: Issue[] = [
  { id: 1, title: "Login bug", status: "open"},
  { id: 2, title: "Dashboard error", status: "resolved" },
  { id: 3, title: "API timeout", status: "open" }
]

interface IssueCardProps {
  issue: Issue
}

function IssueCard({ issue }: IssueCardProps){
  return (
    <div>
      <h3>{issue.title} </h3>
      <p> Status: {issue.status} </p>
    </div>
  );
}

function IncreaseCounter(){
  const [count, setCount] = useState<number>(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}

function App(){
  return (
    <main>
      <h1>Issue Tracker</h1>
      {issues.map(issue => (
        <IssueCard key = {issue.id} issue={issue}/>
      ))}
      <IncreaseCounter/>
    </main>
  )
}

export default App;