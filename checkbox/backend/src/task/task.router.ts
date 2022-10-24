import express from "express";
import type { Request, Response } from "express";
import {body, validationResult} from "express-validator";

import * as TaskService from "./task.service";
export const taskRouter = express.Router();


taskRouter.get("/", async(request:Request, response:Response) => {
    try{
        const tasks = await TaskService.getTasks();
        return response.status(200).json(tasks)
    }catch (error:any){
        return response.status(500).json(error.message)
    }

})

// app.get("/task", async (req, res) => {
//     const tasks = await prisma.task.findMany({
//       orderBy: { createdAt: "desc" },
//     });
  
//     res.json(tasks);
//   });
  
//   app.post("/task", async (req:Request<{}, {}, PersoneModel>, res) => {
//     const task = await prisma.task.create({
//       data: {
//         ...req.params
//       },
//     });
  
//     return res.json(task);
//   });
  
//   app.get("/task/:id", async (req, res) => {
//     const id = req.params.id;
//     const task = await prisma.task.findUnique({
//       where: { id },
//     });
  
//     return res.json(task);
//   });
  
//   app.put("/task/:id", async (req, res) => {
//     const id = req.params.id;
//     const task = await prisma.task.update({
//       where: { id },
//       data: req.body,
//     });
  
//     return res.json(task);
//   });
  
//   app.delete("/task/:id", async (req, res) => {
//     const id = req.params.id;
//     await prisma.task.delete({
//       where: { id },
//     });
  
//     return res.send({ status: "ok" });
//   });
  
//   app.get("/", async (req, res) => {
//     res.send(
//       `
//     <h1>task REST API</h1>
//     <h2>Available Routes</h2>
//     <pre>
//       GET, POST /tasks
//       GET, PUT, DELETE /tasks/:id
//     </pre>
//     `.trim(),
//     );
//   });