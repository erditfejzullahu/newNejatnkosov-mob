import axios from "axios"

export const api = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080",
    baseURL: "http://192.168.1.12:8080",
    headers: {
        'Content-Type': 'application/json'
    }
})