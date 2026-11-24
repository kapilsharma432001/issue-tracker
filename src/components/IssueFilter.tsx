import type { IssueFilter as FilterType } from "../types/issue";

interface IssueFilterProps{
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

function IssueFilter({onFilterChange}: IssueFilterProps ){
    return (
        <div>
            <button onClick={() => onFilterChange("all")}>All</button>
            <button onClick={() => onFilterChange("open")}>Open</button>
            <button onClick={() => onFilterChange("resolved")}>Resolved</button>
        </div>
    );
}
export default IssueFilter;