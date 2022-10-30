export enum SortDirection{
    None = 0,
    Asc =1,
    Dsc = -1
}

export interface TaskData {
    doc_count: number;
    tasks: TaskFields[];
}

export interface NewTask{
    task_name: string | undefined;
    description: string | undefined;
    due_date: string;
}


export enum TaskStatus{
    Not_Urgent ="Not Urgent",
    Due_Soon = "Due soon", 
    Overdue = "Overdue"
}

export interface TaskFields {
    [index: string]: number | string;
    _id:string
    task_name: string;
    description: string;
    due_date: string;
    created_at: string;
    status: TaskStatus;
  }