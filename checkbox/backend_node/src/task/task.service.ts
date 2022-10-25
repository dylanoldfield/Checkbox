import { Task } from '@prisma/client';
import {db} from '../util/db.sever'

export const getTasks = async():Promise<Task[]> => {
    console.log("making it in here");
    const tasks = await db.task.findMany();
    console.log("making it past there");
    console.log(tasks);
    return db.task.findMany();
}

export const addTask = async(newTask:Omit<Task,"id" | "createdAt | status | dueDate">):Promise<Task> => {
    const {taskName, description} = newTask;
    const status = "Overdue"
    const dueDate = new Date()
    return db.task.create({
        data:{
            taskName,
            dueDate,
            description,
            status
        }
    })

}