import React from 'react';
import { useState } from 'react';

export enum TaskStatus{
    Not_Urgent ="Not Urgent",
    Due_Soon = "Due soon", 
    Overdue = "Overdue"
}

interface TaskFields {
    id:string
    name: string;
    description: string;
    due_date: Date;
    create_date: Date;
    status: TaskStatus;
  }


function TaskRow(props:TaskFields) {
    const [fields, setFields] = useState(props)
    const [editing, setEditing] = useState(false)


    return (
      <tr className={` bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${fields.id}`}>
        <td className=" py-4 px-6 name">
            {fields.name}
        </td>
        <td className=" py-4 px-6 description">
            {fields.description}
        </td>
        <td className="py-4 px-6 due_date">
            {fields.due_date.toDateString()}
        </td>
        <td className=" py-4 px-6 create_date">
            {fields.create_date.toDateString()}
        </td>
        <td className="py-4 px-6 status">
            {fields.status}
        </td>
        <td className=" py-4 px-6 button">
            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{editing ? 'Save' : 'Edit'}</a>
        </td>
      </tr>
    );
  }
  
  export default TaskRow;
  