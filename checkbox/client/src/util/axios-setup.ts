import axios from "axios"


export const ax = axios.create({
    baseURL: process.env.REACT_APP_ENV === 'local' ? "http://localhost:8000/" : "https://checkbox.up.railway.app/"
})

