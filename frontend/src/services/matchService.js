import { api } from './api.js'

export const listMatches = async () => (await api.get('/matches')).data

export const createMatch = async (data) =>
    (await api.post('/matches', data)).data

export const updateMatch = async (id, data) =>
    (await api.put(`/matches/${id}`, data)).data

export const deleteMatch = async (id) => api.delete(`/matches/${id}`)

export const deleteAllMatches = async () => api.delete('/matches')
