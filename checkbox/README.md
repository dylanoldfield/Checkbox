---
title: Checkbox Demo App
description: A simple task tracker.
tags:
  - React
  - Typescript
  - MongoDB
  - PyMongo
  - FastAPI
  - Tailwind
  - MaterialUI
---

# Checkbox Demo

A simple task tracker. Client uses [React](https://reactjs.org/) written in [Typescript](https://www.typescriptlang.org/) utilising [Tailwind](https://tailwindcss.com/) and [MaterialUI](https://mui.com/) to make it look jazzy. Backend is hosted on [Railway](https://railway.app) using a [FastAPI](https://fastapi.tiangolo.com/) app server supported by [PyMongo](https://pymongo.readthedocs.io/en/stable/) on a [MongoDB](https://www.mongodb.com/) DB.

## ✨ Features

- React
- Typescript
- MongoDB
- PyMongo
- FastAPI
- Tailwind
- MaterialUI

---

## Design Choices

    - Tailwind: This sometimes divides the crowd but for smaller projects I like inline styling as it provides more control. In a large project some of this could be abstracted to .css files.
    - No Node? I did begin to write a node backend with prisma on a postgres db (I have included it in 'backend_node') but was running into integration issues with Railway and Prisma so I decided to use Python

### Key Risk: 10000s Potential Tasks:

    With up to a 10000s of tasks there are a few things to consider:
    1) Is how much data we are sending: I used pagination to limit the number of results return at a time, this will prevent uncessarily sending MBs of data across.
    2) How many times we query the DB: As I speak to below another thing that would be useful if I had more time is to use caching on query results. You would cache most of your get query results and run a refresh when any tasks were added to DB. This would also really help intermediate results when searching based on title as I call on each character change.
    3) DB structure: Depending on how many users we had it could be appropriate to have different collections for each user's tasks.
    4) Indexes: I used indexes on due date, created_at and title to speed up searching
    5) Atomic Write Requests: Not batch write requests or updates. This would minimise resource locks.

## Potential Improvements

    - Caching: Would use Redis to cache some query responses if I had more time
    - Auth: exposed DB via api
    - Hydration: Would pre-hydrate next-page/previous-page queries to have transition load times
    - Unit Testing: Would definitely need some Jest up in here
    - Accessibility: Did not provide any accessibility aids
    - CSS: In hindsight would probably use Grid more

## 💁‍♀️ How to use

### Backend Set Up

### Using Existing Railway Deployment

- You don't need to touch anything, there is a deployment that you can work with at "https://checkbox.up.railway.app/"
- API docs available at "https://checkbox.up.railway.app/docs"

### Backend Locally/Railway Access

- Change into backend directory `cd /backend`
- (Optional) create a Python3 virtual environment in your desired backend location `virtualenv path/to/directory'
- Install Python requirements `pip install -r requirements.txt`
- Sign up to [Railway](https://railway.app) using your github
- Install the [Railway CLI](https://docs.railway.app/develop/cli) on your OS
- Join my project using the following link "https://railway.app/invite/RnAtn-HgahS"
- Link the Project - you can find this link on the project page in Railway under 'Set up your project locally'
  - Use `railway link <project-link>` in your command line to link it

### Run FastAPI Server Locally

- Make sure you are in the backend folder not the project folder
- To run the server locally but still access the railway DB you need to use the command: `railway run python -m uvicorn main:app --reload`
- Go to (http://localhost:8000/docs)

### Cleaning the DB

- Go to project folder in Railway
- Click MongoDB
  - Under `Data`
  - Find tasks in collections and click it
  - delete the collection

### Client Set Up

- Change into client directory `cd /client`
- Install front end dependencies `npm install`

### Client Running

- By default the client will run against the existing Railway public deployment at "https://checkbox.up.railway.app/" if you want to run it vs your local server set `REACT_APP_ENV=local`

  - Depending on your OS this is how you do it: "https://create-react-app.dev/docs/adding-custom-environment-variables/"

- Run on `localhost:3000` using `npm start` or `REACT_APP_NOT_SECRET_CODE=local npm start`
- Build project first `npm build`
  - Then run on using `serve -s build` on `localhost:3000`
- If you really insist on running the client on a different port, make sure update CORS in `/backend/main.py` to include the domain and then run Railway locally using `REACT_APP_NOT_SECRET_CODE=local npm start` (or windows equiv)
