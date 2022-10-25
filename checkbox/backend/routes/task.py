from math import ceil
from models.task import Task, TaskReturned, TaskUpdate, calculate_status, TasksWithCount, SortObjects, SortableFields, SortDirection
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from typing import Union
from pymongo import ReturnDocument, ASCENDING

router = APIRouter()


@router.get("/", response_description="Get Tasks", response_model=TasksWithCount)
def list_tasks(pageSize: int, pageNum: int, request: Request, sortField: Union[SortableFields, None] = None, sortDirection: Union[SortDirection, None] = 1):
    if pageSize < 1 or pageNum < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Page Size and Page Num must be at least 1")

    tasks = []

    if sortDirection is not None and sortField is not None:
        print("made it here")
        tasks = list(request.app.database["tasks"].find(
            skip=(pageNum-1)*pageSize, limit=pageSize).sort([(sortField, sortDirection)]))
    else:
        tasks = list(request.app.database["tasks"].find(
            skip=(pageNum-1)*pageSize, limit=pageSize))
    tasks = list(map(calculate_status, tasks))
    doc_count = ceil(
        request.app.database["tasks"].count_documents({})/pageSize)
    return {'doc_count': doc_count, 'tasks': tasks}


@router.get("/search", response_description="Search for tasks by title", response_model=TasksWithCount)
def list_tasks(pageSize: int, pageNum: int, request: Request, title: str):
    if pageSize < 1 or pageNum < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Page Size and Page Num must be at least 1")

    tasks = list(request.app.database["tasks"].find(
        {"$text": {"$search": title}}))
    tasks = list(map(calculate_status, tasks))
    doc_count = ceil(
        request.app.database["tasks"].count_documents({})/pageSize)
    return {'doc_count': doc_count, 'tasks': tasks}


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


@router.post("/", response_description="Create a new task", status_code=status.HTTP_201_CREATED,
             response_model=TaskReturned)
def create_task(request: Request, task: Task = Body(...)):
    task = jsonable_encoder(task)
    new_task = request.app.database["tasks"].insert_one(task)
    created_task = request.app.database["tasks"].find_one(
        {"_id": new_task.inserted_id}
    )

    created_task = calculate_status(created_task)

    return created_task


@router.put("/{id}", response_description="Update a new task",
            response_model=TaskReturned)
def update_task(id: str, request: Request, task: TaskUpdate = Body(...)):
    task = jsonable_encoder(task)
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

# @router.get("/", response_description="Get Tasks", response_model=List[TaskInDB])
# def list_tasks(pageSize: int, pageNum: int, request: Request):
#     tasks = list(request.app.database["tasks"].find(skip=pageNum*pageSize, limit=pageSize).sort([('due_date', ASCENDING)]))
#     return tasks


# @router.get("/", response_description="Get all tasks", response_model=TaskInDB)
# def find_task(id: str, request: Request):
#     if (task := request.app.database["tasks"].find()) is not None:
#         return task
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"task with ID {id} not found")


# @router.get("/{id}", response_description="Get a single ticket by id", response_model=TaskInDB)
# def find_ticket(id: str, request: Request):
#     if (ticket := request.app.database["tickets"].find_one({"_id": id})) is not None:
#         return ticket
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"ticket with ID {id} not found")


# @router.put("/{id}", response_description="Update a ticket", response_model=TaskInDB)
# def update_ticket(id: str, request: Request, ticket: TicketUpdate, user: User = Depends(get_current_user)):
#     ticket = {k: v for k, v in ticket.dict().items() if v is not None}

#     if (
#         existing_ticket := request.app.database["tickets"].find_one({"_id": id})
#     ) is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"ticket with ID {id} not found")

#     if existing_ticket["host_id"] != user["_id"]:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
#                             detail=f"Only the owner of this ticket can edit it")

#     if len(ticket) >= 1:
#         updated_result = request.app.database["tickets"].find_one_and_update(
#             {"_id": id}, {"$set": ticket}, return_document=ReturnDocument.AFTER
#         )
#         return updated_result
#     return existing_ticket


# @router.delete("/{id}", response_description="Delete a ticket")
# def delete_ticket(id: str, request: Request, response: Response, user: User = Depends(get_current_user)):
#     if(
#         found_ticket := request.app.database["tickets"].find_one({"_id": id})
#     ) is not None:
#         event_id = found_ticket["event_id"]
#         event = request.app.database["events"].find_one({"_id": event_id})
#         if found_ticket["host_id"] != user["_id"]:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
#                                 detail=f"Only the owner of this ticket can delete this")
#         try:
#             event["tickets"].remove(id)
#             request.app.database["events"].find_one_and_update(
#                 {"_id": event_id}, {"$set": event}, return_document=ReturnDocument.AFTER
#             )
#         except ValueError:
#             pass

#         delete_result = request.app.database["tickets"].delete_one({"_id": id})
#         if delete_result.deleted_count == 1:
#             response.status_code = status.HTTP_204_NO_CONTENT
#             return response

#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"Ticket with ID {id} not found")


# @router.post("/buy/{id}", response_description="Buy a ticket", response_model=TicketInDB)
# def delete_ticket(id: str, quantity: int, request: Request, response: Response):
#     if(
#         found_ticket := request.app.database["tickets"].find_one({"_id": id})
#     ) is not None:
#         # this is a dummy method that will just check quantity and decrement for now
#         if found_ticket["availability"] >= quantity:
#             found_ticket["avialability"] -= quantity
#             updated_ticket = request.app.database["tickets"].update_one(
#                 {"_id": id}, {"$set": found_ticket}
#             )
#             # will need to return list of ticket instances
#             return updated_ticket

#         raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
#                             detail=f"Ticket with ID {id} does not have enough availability")
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"Ticket with ID {id} not found")
