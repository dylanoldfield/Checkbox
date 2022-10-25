import React, { useEffect } from 'react';
import { TaskFields, TaskStatus} from '../components/Task/TaskRow';
import { SortDirection} from '../components/Task/TaskHeader'
import TaskRow from '../components/Task/TaskRow'
import TaskHeader from '../components/Task/TaskHeader';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ax} from "../util/axios-setup"


const headers = [
    {
        title:"Name",
        sortHeader:false,
    },
    {
        title:"Description",
        sortHeader:false,
    },
    {
        title:"Due Date",
        sortHeader:true,
    },
    {
        title:"Date Created",
        sortHeader:true,
    },
    {
        title:"Status",
        sortHeader:false,
    }
]


function TaskList() {
    const [tasks, setTasks] = useState([])
    const [open, setOpen] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [colSorted, setColSorted] = useState({
        column: "",
        dir:SortDirection.None
    });

    const [pageNum, setPageNum] = useState(1)

   async function getTasks(pageSize: number, pageNum:number, sortField?:string, sortDirection?: SortDirection){
        return await ax.get('/task/', {
            params:{
                pageSize:pageSize,
                pageNum:pageNum,
                sortField:sortField,
                sortDirection:sortDirection
            }
        })
   }


   useEffect(() => {
        if(tasks.length === 0){
            getTasks(15,pageNum)
            .then(res => {
                console.log(res)
                setTasks(res.data['tasks'])
            })
            .catch(err => console.log(err));
        }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])

    const savedRow = (data:TaskFields) => {
        console.log('row saved')
    }
    const taskAdderOpen = () => setOpen(true);
    const taskAdderClose = () => setOpen(false);

    

    return (
        
    <div>
        <Modal
            open={open}
            onClose={taskAdderClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <div className="grid content-center h-full w-full justify-items-center">
                <div className="flex flex-col bg-gray-50 px-4 py-3 sm:px-6 w-1/3">
                    <div className=''>
                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">New Task</h3>
                    </div>
                    <form action="#" method="POST">
                        <div className="overflow-hidden shadow sm:rounded-md">
                        <div className="bg-white px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-6">
                            <div className="col-span-6 bg">
                                <label htmlFor="task-name" className="block text-sm font-medium text-gray-700">Task Name</label>
                                <input type="text" name="task-name" id="task-name" className="px-1 border-solid border-2 rounded text-sm h-7 border-slate-700" required/>
                            </div>
                            <div className="mt-3 col-span-6 bg">
                                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="task-description" name="task-description" rows={3} className="w-full px-1 text-sm border-solid border-2 rounded border-slate-700" placeholder="Add a short description here"></textarea>
                            </div>
                            <div className="mt-3 col-span-6 bg">
                                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">Due Date</label>
                                <DatePicker className="px-1 border-solid border-2 rounded border-slate-700 text-sm h-7" selected={startDate} onChange={(date:Date) => setStartDate(date)} />
                            </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add</button>
                            <button type="button" onClick={taskAdderClose} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>

        <div className='flex flex-col'>
            <div className="listHeader flex w-full">
            <form className="w-1/2">   
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
                <div className="relative w-full my-2 ml-2">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="search" id="default-search" className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by name" required/>
                    <button type="submit" className="text-white content-center bg-blue-600 absolute right-2.5 bottom-2.5 h-9 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>
            <div className='grid items-center w-1/2 p-2 justify-items-end pr-10'>
                <button onClick={taskAdderOpen} className="h-9 text-white content-center bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Add Task</button>    
            </div>
            </div>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg mx-2">
                <table className="table table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 Tasks">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr> 
                            {headers.map((header, idx) => (
                                <TaskHeader {...{...header, columnSorted: colSorted, sortedCol:colSorted}} handleClick={setColSorted}/>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((e,idx) => (
                           <TaskRow {...{field:e, saveRow: savedRow}}/>
                        ))}
                    </tbody>
                </table>       
            </div>
        </div>
    </div>

    );
  }
  
  export default TaskList;
  