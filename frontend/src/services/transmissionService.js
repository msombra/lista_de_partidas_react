import { api } from './api.js'

export const listTransmissions = async () =>
    (await api.get('/transmissions')).data

export const createTransmission = async (data) =>
    (await api.post('/transmissions', data)).data

export const updateTransmission = async (id, data) =>
    (await api.put(`/transmissions/${id}`, data)).data

export const deleteTransmission = async (id) =>
    api.delete(`/transmissions/${id}`)
