import { Task } from '@prisma/client';
import {db} from '../util/db.sever'

export const getTasks = async():Promise<Task[]> => {
    return db.task.findMany({
        orderBy: { createdAt: "desc" },
      });
}

// export const addTask = async(newTask:Task):Promise<Task> => {
//     return db.task.create({
//         data:{..newTask}
//     })

// }