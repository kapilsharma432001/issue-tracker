export type IssueStatus = "open" | "resolved";

export type IssueFilter = "all" | IssueStatus;

export interface Issue{
    id: number;
    title: string;
    status: IssueStatus;
}
