from pymongo import IndexModel, ASCENDING, TEXT
from fastapi import FastAPI

# This document is used to define any indices for the app
# note that although this is run at startup MongoDB will not recreate already created indices
# see here https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/#behaviors


def create_indices(app: FastAPI):
    title_search = IndexModel([("task_name", TEXT)])
    due_date_search = IndexModel([("due_date", ASCENDING)])
    created_at_search = IndexModel([("created_at", ASCENDING)])
    app.database["tasks"].create_indexes(
        [title_search, due_date_search, created_at_search])
