import express from "express";
import cors from "cors";

import {taskRouter} from "./task/task.router"

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.use("/api/tasks", taskRouter);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
