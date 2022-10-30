import React, { useEffect, useLayoutEffect } from 'react';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TaskFields, TaskStatus } from '../interfaces/Tasks';


  type Props = {
    field: TaskFields;
    saveRow: (data:TaskFields) => void;
  };




function TaskRow({field, saveRow}:Props){
    const [fields, setFields] = useState<TaskFields>({
        _id:"0",
        task_name: "loading..",
        description: "",
        due_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        status: TaskStatus.Overdue
    });

    const [savedFields,setSavedFields] = useState<TaskFields>();
    const [editing, setEditing] = useState(false);
    const [active, setActive] = useState(false);  // This is used to prevent useEffect trying to update with dummy data

    useLayoutEffect(() => {
        setFields(field)
        setActive(true);
      },[field]);

    useEffect(() => {
        if(active && !editing && JSON.stringify(savedFields) !== JSON.stringify(fields)){
            setSavedFields(fields)
            saveRow(fields)
        }
      },[editing]);

    const updateDate = (date:Date) => {
        setFields((savedFields) => ({...savedFields, due_date:date.toISOString()}))
    }

    return (
      <tr key={`${fields._id}`} id={`${fields._id}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className=" py-4 px-6 name">
        {
           editing ? (
                <input className={`py-1 pl-1 ${editing ? 'border-solid border-2 rounded border-slate-700' : ''}`} value={fields.task_name}
                        onChange={(event) => setFields((previous) => ({...previous, task_name: event.target.value}))}
                />
            ) : (
                fields.task_name
            )
        }
        </td>
        <td className={`py-4 px-6 description `}>
        {
           editing ? (
                <input className={`py-1 pl-1 ${editing ? 'border-solid border-2 rounded border-slate-700' : ''}`} value={fields.description}
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
                    <DatePicker className="px-1 border-solid border-2 rounded border-slate-700 text-sm h-7" selected={new Date(fields.due_date)} onChange={(date:Date) => updateDate(date)} />
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
