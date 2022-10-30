import React, { useEffect, useRef } from 'react';
import { TaskFields, TaskData, NewTask, SortDirection} from '../interfaces/Tasks';
import TaskRow from '../components/TaskRow'
import TaskHeader from '../components/TaskHeader';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ax} from "../util/axios-setup"
import { Alert, AlertColor } from '@mui/material';
import { TaskHeaders } from '../util/component_config/task_list';


// default page size
const pSize = 10;

function TaskList() {
    const [tasks, setTasks] = useState<TaskData>({
        doc_count:1,
        tasks:[]
    })

    const [colSorted, setColSorted] = useState({
        column: "",
        dir:SortDirection.None
    });
    
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");

    const [pageNum, setPageNum] = useState(1)

    const [modalOpen, setModalOpen] = useState(false)
    const [modalDueDate, setModalDueDate] = useState(new Date().toISOString());
    const modalTaskName = useRef<HTMLInputElement>(null);
    const modalTaskDescription = useRef<HTMLTextAreaElement>(null);
   
    const titleSearchRef = useRef<HTMLInputElement>(null);
    const [titleSearch, setTitleSearch] = useState("");

    useEffect(() => {
        search(pSize, pageNum,colSorted.column === "" || colSorted.dir === SortDirection.None ? undefined : colSorted.column,colSorted.column === "" || colSorted.dir === SortDirection.None ? undefined : colSorted.dir, titleSearch === "" ? undefined : titleSearch)
       // eslint-disable-next-line react-hooks/exhaustive-deps
       },[pageNum, colSorted.column, colSorted.dir, titleSearch])
    
   
   // Axios Promises
    async function getTasks(pageSize: number, pageNum:number, sortField?:string, sortDirection?: SortDirection, title?:string){
        return await ax.get('/task/', {
            params:{
                pageSize:pageSize,
                pageNum:pageNum,
                sortField:sortField,
                sortDirection:sortDirection,
                title:title
            }
        })
   }

   async function saveRowUpdate(data:TaskFields){
    return await ax.put(`/task/${data["_id"]}`, 
    data,
    )
   }

    async function addTask(data:NewTask){
        return await ax.post(`/task/`, 
        data,
        )
    }

   // Requests
    const addNewTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setModalOpen(false)
        addTask(
            { 
                task_name: modalTaskName.current?.value,
                description: modalTaskDescription.current?.value,
                due_date: modalDueDate
            }).then(res => {
                createAlert("Task Added.", "success")
                search(pSize,1)
                setPageNum(1)
                resetSort() 
                console.log(colSorted)
            }).catch(err => {
                createAlert("Oops. Something went wrong. Try again.",  "error")
                console.log(err) 
            });
            e.currentTarget.reset()
    }


   const search = (pageSize: number, pageNum:number, sortField?:string, sortDirection?: SortDirection, title?:string) => {
        getTasks(pageSize,pageNum,sortField,sortDirection,title)
        .then(res => {
            console.log(res.data)
            setTasks({...res.data})
        })
        .catch(err => console.log(err));
   }


   const resetSort = () => {
    setColSorted({
        column:"",
        dir:SortDirection.None
    })
   }

   const createAlert = (message:string, severity: AlertColor) => {
        setAlertOpen(true);
        setAlertMessage(message);
        setAlertSeverity(severity);
   }

   const savedRow = (data:TaskFields) => {
    console.log('row saved')
    console.log(JSON.stringify(data))
    saveRowUpdate(data).then(res => {
        console.log(res)
        const index = tasks.tasks.findIndex(task => task._id === data._id);
        let updated = [...tasks.tasks]
        updated[index] = {...res.data}
        setTasks({doc_count: tasks.doc_count, tasks:updated})

        console.log(tasks)
    })
    .catch(err =>{
        createAlert("Oops. Something went wrong. Try again.",  "error")
        console.log(err)
    } );
}

    return (
        
    <div className = "h-screen">
        {alertOpen ? <Alert onClose={() => {setAlertOpen(false)}} severity={alertSeverity}>{alertMessage}</Alert> : <></>}
        <Modal
            open={modalOpen}
            onClose={() => (setModalOpen(false))}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <div className="grid content-center h-full w-full justify-items-center">
                <div className="flex flex-col bg-gray-50 px-4 py-3 sm:px-6 w-1/3">
                    <div className=''>
                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">New Task</h3>
                    </div>
                    <form onSubmit={e => addNewTask(e)} method="POST">
                        <div className="overflow-hidden shadow sm:rounded-md">
                        <div className="bg-white px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-6">
                            <div className="col-span-6 bg">
                                <label htmlFor="task_name" className="block text-sm font-medium text-gray-700">Task Name</label>
                                <input ref={modalTaskName} type="text" name="task_name" id="task_name" className="px-1 border-solid border-2 rounded text-sm h-7 border-slate-700" required/>
                            </div>
                            <div className="mt-3 col-span-6 bg">
                                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea ref={modalTaskDescription} id="task-description" name="task-description" rows={3} className="w-full px-1 text-sm border-solid border-2 rounded border-slate-700" placeholder="Add a short description here"></textarea>
                            </div>
                            <div className="mt-3 col-span-6 bg">
                                <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">Due Date</label>
                                <DatePicker className="px-1 border-solid border-2 rounded border-slate-700 text-sm h-7" selected={new Date(modalDueDate)} onChange={(date:Date) => setModalDueDate(date.toISOString())} />
                            </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add</button>
                            <button type="button" onClick={() => (setModalOpen(false))} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>

        <div className='h-full flex flex-col'>
            <div className="listHeader flex w-full">
                <form className="w-1/2">   
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
                    <div className="relative w-full my-2 ml-2">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input ref={titleSearchRef} onClick={() => setTitleSearch("")} onChange={e => setTitleSearch(e.target.value)} value={titleSearch} type="search" id="default-search" className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by name" required/>
                    </div>
                </form>
                <div className='grid items-center w-1/2 p-2 justify-items-end pr-10'>
                    <button onClick={() => (setModalOpen(true))} className="h-9 text-white content-center bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Add Task</button>    
                </div>
            </div>
            <div className="h-full overflow-x-auto relative shadow-md sm:rounded-lg mx-2">
                <table className=" table table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 Tasks">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr> 
                            {TaskHeaders.map((header, idx) => (
                                <TaskHeader {...{...header, columnSorted: colSorted, sortedCol:colSorted}} handleClick={setColSorted}/>
                            ))}
                        </tr>
                    </thead>
                    <tbody key ={`${pageNum}`} id ={`body-page-${pageNum}`}>
                        {tasks.tasks.map((e,idx) => (
                           <TaskRow key={e._id } {...{field:e, saveRow: savedRow}}/>
                        ))}
                    </tbody>
                </table> 
                <div className='w-full text-center grid grid-cols-3 gap-1 '>
                        <div className='px-2 text-right'>
                            {pageNum > 1 ? 
                                <button className="font-sm text-blue-600 dark:text-blue-500 hover:underline" onClick={() => setPageNum(pageNum - 1)}>{'<'} Prev</button> : <></>
                            }
                        </div>
                        <div>
                            <>Page {pageNum} out of {tasks.doc_count}</>
                        </div>
                        <div className='text-left'>
                        {pageNum < tasks.doc_count ? 
                                <button className="font-sm text-blue-600 dark:text-blue-500 hover:underline" onClick={() => setPageNum(pageNum + 1)}>Next {'>'} </button> : <></>
                            }
                        </div>
                    </div>   
            </div>
        </div>
    </div>

    );
  }
  
  export default TaskList;
  