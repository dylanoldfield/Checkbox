import express from "express";
import type { Request, Response } from "express";
import {body, validationResult} from "express-validator";

import * as TaskService from "./task.service";
export const taskRouter = express.Router();


taskRouter.get("/", async(request:Request, response:Response) => {
    try{
        const tasks = await TaskService.getTasks()
        return response.status(200).json(tasks)
        
    }catch (error:any){
        return response.status(500).json(error.message)
    }

})


taskRouter.post("/", async(request:Request, response:Response) => {
    try{
        const tasks = await TaskService.addTask(request.body)
        return response.status(200).json(tasks)
        
    }catch (error:any){
        return response.status(500).json(error.message)
    }

})
