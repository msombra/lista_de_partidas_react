import { App as AntdApp, Card, Input, Select, Typography } from 'antd'
import { useEffect, useState } from 'react'

import { EntityDataTable } from '@/components/EntityDataTable.jsx'
import { EntityForm } from '@/components/EntityForm.jsx'
import { getApiErrorMessage } from '@/services/api.js'
import { listChampionships } from '@/services/championshipService.js'
import {
    createClub,
    deleteClub,
    listClubs,
    updateClub,
} from '@/services/clubService.js'

const { Title } = Typography
const columns = [
    { title: 'Nome do clube', dataIndex: 'name', key: 'name' },
    { title: 'Campeonato', dataIndex: 'championship', key: 'championship' },
]

export const Clubes = () => {
    const { notification } = AntdApp.useApp()
    const [clubs, setClubs] = useState([])
    const [championships, setChampionships] = useState([])
    const [name, setName] = useState('')
    const [championshipId, setChampionshipId] = useState()
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const normalizedName = name.trim()
    const isEditing = editingId !== null
    const formIsValid = Boolean(normalizedName && championshipId)
    const championshipOptions = championships.map((championship) => ({
        value: championship.id,
        label: championship.name,
    }))

    useEffect(() => {
        let active = true

        Promise.all([listClubs(), listChampionships()])
            .then(([clubData, championshipData]) => {
                if (!active) return
                setClubs(clubData)
                setChampionships(championshipData)
            })
            .catch((error) => notification.error({
                title: getApiErrorMessage(error),
            }))
            .finally(() => active && setLoading(false))

        return () => { active = false }
    }, [notification])

    const clearForm = () => {
        setName('')
        setChampionshipId(undefined)
        setEditingId(null)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!formIsValid) return

        setSubmitting(true)
        try {
            const clubData = { name: normalizedName, championshipId }
            if (isEditing) {
                const updated = await updateClub(editingId, clubData)
                setClubs((current) => current.map((club) =>
                    club.id === editingId ? updated : club
                ))
                notification.success({ title: 'Clube atualizado com sucesso.' })
            } else {
                const created = await createClub(clubData)
                setClubs((current) => [...current, created])
                notification.success({ title: 'Clube cadastrado com sucesso.' })
            }
            clearForm()
        } catch (error) {
            notification.error({ title: getApiErrorMessage(error) })
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (club) => {
        setName(club.name)
        setChampionshipId(club.championshipId)
        setEditingId(club.id)
    }

    const handleDelete = async (id) => {
        try {
            await deleteClub(id)
            setClubs((current) => current.filter((club) => club.id !== id))
            if (editingId === id) clearForm()
            notification.success({ title: 'Clube excluído com sucesso.' })
        } catch (error) {
            notification.error({ title: getApiErrorMessage(error) })
            throw error
        }
    }

    return (
        <Card>
            <Title level={4}>Clubes</Title>
            <EntityForm
                title="Cadastrar novo clube"
                isEditing={isEditing}
                submitDisabled={!formIsValid}
                submitLoading={submitting}
                onSubmit={handleSubmit}
                onCancel={clearForm}
            >
                <Input
                    value={name}
                    placeholder="Nome do clube"
                    aria-label="Nome do clube"
                    maxLength={100}
                    onChange={(event) => setName(event.target.value)}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <Select
                    value={championshipId}
                    options={championshipOptions}
                    placeholder="Selecione o campeonato"
                    aria-label="Campeonato do clube"
                    showSearch
                    optionFilterProp="label"
                    onChange={setChampionshipId}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </EntityForm>
            <EntityDataTable
                title="Lista de Clubes"
                data={clubs}
                columns={columns}
                loading={loading}
                entityName="clube"
                entityNamePlural="clubes"
                searchPlaceholder="Buscar clube ou campeonato"
                getSearchText={(club) => `${club.name} ${club.championship}`}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </Card>
    )
}
