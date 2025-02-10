import axios from 'axios'
const apiKey = import.meta.env.VITE_BACKEND_URL

console.log(apiKey)
const baseURL = `${apiKey}`

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export default instance
