// allows to quickly toggle which fields have sortability
export const TaskHeaders = [
    {
        title:"Name",
        fieldName: "task_name",
        sortHeader:false,
    },
    {
        title:"Description",
        fieldName:"description",
        sortHeader:false,
    },
    {
        title:"Due Date",
        fieldName:"due_date",
        sortHeader:true,
    },
    {
        title:"Date Created",
        fieldName:"created_at",
        sortHeader:true,
    },
    {
        title:"Status",
        fieldName:"status",
        sortHeader:false,
    }
]