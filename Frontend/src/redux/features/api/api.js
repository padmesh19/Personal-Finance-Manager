import axios from 'axios'
const apiKey = import.meta.env.VITE_BACKEND_URL

const baseURL = `${apiKey}`

const api = axios.create({
    baseURL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export default api
