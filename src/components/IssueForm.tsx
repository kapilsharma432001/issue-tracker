import type { FormEvent } from "react";


interface IssueFormProps {
    title: string;
    onTitleChange: (title: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    saving: boolean;
    error: string;
}


function IssueForm({
    title,
    onTitleChange,
    onSubmit,
    saving,
    error
}: IssueFormProps) {
    return (
        <form onSubmit = {onSubmit} >
            <label htmlFor="issue-title">Issue Title: </label>
            <input 
                id = "issue-title"
                type = "text"
                value={title}
                onChange={event => onTitleChange(event.target.value)}
                placeholder="Enter issue title"
                required
                disabled={saving}
                />
            <button type="submit" disabled={saving}>{saving ? "Adding..." : "Add Issue"}</button>
            {error && <p role = "alert">{error}</p>}
        </form>
    )
}

export default IssueForm;