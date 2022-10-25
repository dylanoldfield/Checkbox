import React, { useEffect } from 'react';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export enum TaskStatus{
    Not_Urgent ="Not Urgent",
    Due_Soon = "Due soon", 
    Overdue = "Overdue"
}

export interface TaskFields {
    [index: string]: number | string;
    id:string
    task_name: string;
    description: string;
    due_date: string;
    created_at: string;
    status: TaskStatus;
  }

  type Props = {
    field: TaskFields;
    saveRow: (data:TaskFields) => void;
  };




function TaskRow({field, saveRow}:Props){
    const [fields, setFields] = useState(field);
    const [savedFields,setSavedFields] = useState(field);
    const [editing, setEditing] = useState(false);

    
    useEffect(() => {
        if(!editing && JSON.stringify(savedFields) !== JSON.stringify(fields)){
            setSavedFields(fields)
            saveRow(fields)
        }
      },[editing]);

    const updateField = (fieldName:string, e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        ;
    }

    return (
      <tr id={`${fields.id}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className=" py-4 px-6 name">
        {
           editing ? (
                <input value={fields.task_name}
                        onChange={(event) => setFields((previous) => ({...previous, task_name: event.target.value}))}
                />
            ) : (
                fields.task_name
            )
        }
        </td>
        <td className=" py-4 px-6 description">
        {
           editing ? (
                <input value={fields.description}
                        onChange={(event) => setFields((previous) => ({...previous, description: event.target.value}))}
                />
            ) : (
                fields.description
            )
        }
        </td>
        <td className="py-4 px-6 due_date">
        {
           editing ? (
                    <DatePicker className="px-1 border-solid border-2 rounded border-slate-700 text-sm h-7" selected={new Date(fields.due_date)} onChange={(date:Date) => setFields((previous) => ({...previous, due_date: date.toDateString()}))} />
            ) : (
                new Date(fields.due_date).toDateString()
            )
        }
        </td>
        <td className=" py-4 px-6 create_date">
            {new Date(fields.created_at).toDateString()}
        </td>
        <td className="py-4 px-6 status">
            {fields.status}
        </td>
        <td className=" py-4 px-6 button">
            <button onClick={()=>{setEditing(!editing)}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{editing ? 'Save' : 'Edit'}</button>
        </td>
      </tr>
    );
  }
  
  export default TaskRow;

function useRef(field: TaskFields) {
    throw new Error('Function not implemented.');
}
  