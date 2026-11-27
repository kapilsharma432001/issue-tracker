import { useRef, type FormEvent } from "react";


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
    const inputRef = useRef<HTMLInputElement>(null);
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
                ref = {inputRef}
                />
            <button type="submit" disabled={saving}>{saving ? "Adding..." : "Add Issue"}</button>
            <button type="button" onClick={() => inputRef.current?.focus()}>Focus Title</button>
            {error && <p role = "alert">{error}</p>}
        </form>
    )
}

export default IssueForm;