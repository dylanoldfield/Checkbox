from datetime import datetime
from math import ceil
from models.task import Task, TaskInDB, TaskReturned, TaskUpdate, calculate_status, TasksWithCount, SortObjects, SortableFields, SortDirection
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from typing import Union
from pymongo import ReturnDocument, ASCENDING

router = APIRouter()

# Creates a new route


@router.post("/", response_description="Create a new task", status_code=status.HTTP_201_CREATED,
             response_model=TaskReturned)
def create_task(request: Request, task: TaskInDB = Body(...)):
    task = jsonable_encoder(task)

    # make sure that the due-date is in the correct format
    try:
        test = datetime.strptime(task['due_date'], "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"due date needs to be in the following format %Y-%m-%dT%H:%M:%S.%fZ")

    # add to DB
    new_task = request.app.database["tasks"].insert_one(task)
    created_task = request.app.database["tasks"].find_one(
        {"_id": new_task.inserted_id}
    )

    # update status calculation
    created_task = calculate_status(created_task)

    return created_task


# Generic get Tasks route
@router.get("/", response_description="Get Tasks", response_model=TasksWithCount)
def list_tasks(pageSize: int, pageNum: int, request: Request, sortField: Union[SortableFields, None] = None, sortDirection: Union[SortDirection, None] = 1, title: Union[str, None] = None):
    # page validation
    if pageSize < 1 or pageNum < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Page Size and Page Num must be at least 1")

    tasks = []

    # sort or unsorted search
    if sortDirection is not None and sortField is not None:
        tasks = list(request.app.database["tasks"].find(
            {"$text": {"$search": title}} if title is not None else {},
            skip=(pageNum-1)*pageSize, limit=pageSize).sort([(sortField, sortDirection)]))
    else:
        tasks = list(request.app.database["tasks"].find(
            {"$text": {"$search": title}} if title is not None else {},
            skip=(pageNum-1)*pageSize, limit=pageSize))

    # calculate status
    tasks = list(map(calculate_status, tasks))

    # get total doc number
    doc_count = ceil(
        request.app.database["tasks"].count_documents({"$text": {"$search": title}} if title is not None else {})/pageSize)
    return {'doc_count': doc_count, 'tasks': tasks}


@router.put("/{id}", response_description="Update a new task",
            response_model=TaskReturned)
def update_task(id: str, request: Request, task: TaskUpdate = Body(...)):
    task = jsonable_encoder(task)

    if task['due_date'] is not None:
        try:
            test = datetime.strptime(task['due_date'], "%Y-%m-%dT%H:%M:%S.%fZ")
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"due date needs to be in the following format %Y-%m-%dT%H:%M:%S.%fZ")
    if len(task) >= 1:
        updated_task = request.app.database["tasks"].find_one_and_update(
            {"_id": id}, {"$set": task}, return_document=ReturnDocument.AFTER
        )

        if updated_task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"task with id {id} not found")
        updated_task = calculate_status(updated_task)
        return updated_task

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"No updates provided")


# unused sort command but allows you to quickly add multifield sort functionality
@router.post("/complexsort", response_description="Get Tasks", response_model=TasksWithCount)
def list_tasks(pageSize: int, pageNum: int, request: Request, sortFields: SortObjects = Body(...)):
    if pageSize < 1 or pageNum < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Page Size and Page Num must be at least 1")

    sortFields = jsonable_encoder(sortFields)
    formatted_sort = list(
        map(lambda field: (field["field"], field["direction"]), sortFields["fields"]))
    print(formatted_sort)
    tasks = list(request.app.database["tasks"].find(
        skip=(pageNum-1)*pageSize, limit=pageSize).sort(formatted_sort))

    # print(tasks)
    tasks = list(map(calculate_status, tasks))
    doc_count = ceil(
        request.app.database["tasks"].count_documents({})/pageSize)
    return {'doc_count': doc_count, 'tasks': tasks}
