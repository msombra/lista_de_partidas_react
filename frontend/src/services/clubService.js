import { api } from './api.js'

export const listClubs = async () => (await api.get('/clubs')).data

export const createClub = async (data) =>
    (await api.post('/clubs', data)).data

export const updateClub = async (id, data) =>
    (await api.put(`/clubs/${id}`, data)).data

export const deleteClub = async (id) => api.delete(`/clubs/${id}`)
