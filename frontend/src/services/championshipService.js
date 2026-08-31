import { api } from './api.js'

export const listChampionships = async () =>
    (await api.get('/championships')).data

export const createChampionship = async (data) =>
    (await api.post('/championships', data)).data

export const updateChampionship = async (id, data) =>
    (await api.put(`/championships/${id}`, data)).data

export const deleteChampionship = async (id) =>
    api.delete(`/championships/${id}`)
