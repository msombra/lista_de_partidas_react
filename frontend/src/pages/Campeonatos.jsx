import { App as AntdApp, Card, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'

import { EntityDataTable } from '@/components/EntityDataTable.jsx'
import { EntityForm } from '@/components/EntityForm.jsx'
import {
    createChampionship,
    deleteChampionship,
    listChampionships,
    updateChampionship,
} from '@/services/championshipService.js'
import { getApiErrorMessage } from '@/services/api.js'

const { Title } = Typography
const columns = [{ title: 'Nome do campeonato', dataIndex: 'name', key: 'name' }]

export const Campeonatos = () => {
    const { notification } = AntdApp.useApp()
    const [championships, setChampionships] = useState([])
    const [name, setName] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const normalizedName = name.trim()
    const isEditing = editingId !== null

    useEffect(() => {
        let active = true

        listChampionships()
            .then((data) => active && setChampionships(data))
            .catch((error) => notification.error({
                title: getApiErrorMessage(error),
            }))
            .finally(() => active && setLoading(false))

        return () => { active = false }
    }, [notification])

    const clearForm = () => {
        setName('')
        setEditingId(null)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!normalizedName) return

        setSubmitting(true)
        try {
            if (isEditing) {
                const updated = await updateChampionship(editingId, {
                    name: normalizedName,
                })
                setChampionships((current) => current.map((championship) =>
                    championship.id === editingId ? updated : championship
                ))
                notification.success({ title: 'Campeonato atualizado com sucesso.' })
            } else {
                const created = await createChampionship({ name: normalizedName })
                setChampionships((current) => [...current, created])
                notification.success({ title: 'Campeonato cadastrado com sucesso.' })
            }
            clearForm()
        } catch (error) {
            notification.error({ title: getApiErrorMessage(error) })
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (championship) => {
        setName(championship.name)
        setEditingId(championship.id)
    }

    const handleDelete = async (id) => {
        try {
            await deleteChampionship(id)
            setChampionships((current) =>
                current.filter((championship) => championship.id !== id)
            )
            if (editingId === id) clearForm()
            notification.success({ title: 'Campeonato excluído com sucesso.' })
        } catch (error) {
            notification.error({ title: getApiErrorMessage(error) })
            throw error
        }
    }

    return (
        <Card>
            <Title level={4}>Campeonatos</Title>
            <EntityForm
                title="Cadastrar novo campeonato"
                isEditing={isEditing}
                submitDisabled={!normalizedName}
                submitLoading={submitting}
                onSubmit={handleSubmit}
                onCancel={clearForm}
            >
                <Input
                    value={name}
                    placeholder="Nome do campeonato"
                    aria-label="Nome do campeonato"
                    maxLength={100}
                    onChange={(event) => setName(event.target.value)}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </EntityForm>
            <EntityDataTable
                title="Lista de Campeonatos"
                data={championships}
                columns={columns}
                loading={loading}
                entityName="campeonato"
                entityNamePlural="campeonatos"
                searchPlaceholder="Buscar campeonato"
                getSearchText={(championship) => championship.name}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </Card>
    )
}
