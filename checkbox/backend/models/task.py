from typing import List
import uuid
from enum import Enum, IntEnum
from pydantic import BaseModel, Field
from datetime import datetime, timedelta


class StatusEnum(str, Enum):
    not_urgent = 'Not Urgent'
    due_soon = 'Due Soon'
    overdue = 'Overdue'


class Task(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    task_name: str = Field(...)
    description: str = Field(...)
    due_date: datetime = Field(...)
    # preferences

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "task_name": "Checkbox",
                "description": "This is a demo task for checkbox",
                "due_date": str(datetime.now()),
            }
        }


class TaskInDB(Task):
    created_at: datetime = datetime.now()


class TaskReturned(TaskInDB):
    status: StatusEnum


class TasksWithCount(BaseModel):
    doc_count: int
    tasks: List[TaskReturned]


class TaskUpdate(BaseModel):
    task_name: str = Field(...)
    description: str = Field(...)
    due_date: datetime = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "task_name": "Checkbox",
                "description": "This is a demo task for checkbox",
                "due_date": str(datetime.now()),
            }
        }


class SortDirection(IntEnum, Enum):
    asc = 1
    dsc = -1


class SortableFields(str, Enum):
    due_date = 'due_date'
    created_at = 'created_at'


class SortObject(BaseModel):
    field: SortableFields
    direction: SortDirection


class SortObjects(BaseModel):
    fields: List[SortObject]


def calculate_status(task: TaskInDB):
    new_task = task
    due_date = datetime.strptime(task['due_date'], "%Y-%m-%dT%H:%M:%S.%f")
    if due_date < datetime.now():
        new_task['status'] = StatusEnum.overdue
    elif due_date > datetime.now() and due_date < datetime.now() + timedelta(days=7):
        new_task['status'] = StatusEnum.due_soon
    else:
        new_task['status'] = StatusEnum.not_urgent
    return new_task
