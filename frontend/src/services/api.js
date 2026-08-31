import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
    timeout: 10000,
})

export const getApiErrorMessage = (error) =>
    error.response?.data?.message
    ?? 'Não foi possível conectar ao servidor.'
