import type { IssueFilter as FilterType } from "../types/issue";

interface IssueFilterProps{
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

function IssueFilter({filter, onFilterChange}: IssueFilterProps ){
    return (
        <div>
            <button aria-pressed={filter === "all"} onClick={() => onFilterChange("all")}>All</button>
            <button aria-pressed={filter === "open"} onClick={() => onFilterChange("open")}>Open</button>
            <button aria-pressed={filter === "resolved"} onClick={() => onFilterChange("resolved")}>Resolved</button>
        </div>
    );
}
export default IssueFilter;