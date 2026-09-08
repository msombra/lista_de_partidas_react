import { App as AntdApp, Card, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'

import { EntityDataTable } from '@/components/EntityDataTable.jsx'
import { EntityForm } from '@/components/EntityForm.jsx'
import { getApiErrorMessage } from '@/services/api.js'
import {
    createTransmission,
    deleteTransmission,
    listTransmissions,
    updateTransmission,
} from '@/services/transmissionService.js'

const { Title } = Typography
const columns = [{ title: 'Nome da transmissão', dataIndex: 'name', key: 'name' }]

export const Transmissoes = () => {
    const { notification } = AntdApp.useApp()
    const [transmissions, setTransmissions] = useState([])
    const [name, setName] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const normalizedName = name.trim()
    const isEditing = editingId !== null

    useEffect(() => {
        let active = true

        listTransmissions()
            .then((data) => active && setTransmissions(data))
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
                const updated = await updateTransmission(editingId, {
                    name: normalizedName,
                })
                setTransmissions((current) => current.map((transmission) =>
                    transmission.id === editingId ? updated : transmission
                ))
                notification.success({
                    title: 'Transmissão atualizada com sucesso.',
                })
            } else {
                const created = await createTransmission({ name: normalizedName })
                setTransmissions((current) => [...current, created])
                notification.success({
                    title: 'Transmissão cadastrada com sucesso.',
                })
            }
            clearForm()
        } catch (error) {
            notification.error({ title: getApiErrorMessage(error) })
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (transmission) => {
        setName(transmission.name)
        setEditingId(transmission.id)
    }

    const handleDelete = async (id) => {
        try {
            await deleteTransmission(id)
            setTransmissions((current) =>
                current.filter((transmission) => transmission.id !== id)
            )
            if (editingId === id) clearForm()
            notification.success({
                title: 'Transmissão excluída com sucesso.',
            })
        } catch (error) {
            notification.error({ title: getApiErrorMessage(error) })
            throw error
        }
    }

    return (
        <Card>
            <Title level={4}>Transmissões</Title>
            <EntityForm
                title="Cadastrar nova transmissão"
                isEditing={isEditing}
                submitDisabled={!normalizedName}
                submitLoading={submitting}
                onSubmit={handleSubmit}
                onCancel={clearForm}
            >
                <Input
                    value={name}
                    placeholder="Nome da transmissão"
                    aria-label="Nome da transmissão"
                    maxLength={100}
                    onChange={(event) => setName(event.target.value)}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </EntityForm>
            <EntityDataTable
                title="Lista de Transmissões"
                data={transmissions}
                columns={columns}
                loading={loading}
                entityName="transmissão"
                entityNamePlural="transmissões"
                searchPlaceholder="Buscar transmissão"
                getSearchText={(transmission) => transmission.name}
                isRecordProtected={(transmission) =>
                    transmission.name.toLocaleLowerCase('pt-BR') === 'outro'
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </Card>
    )
}
