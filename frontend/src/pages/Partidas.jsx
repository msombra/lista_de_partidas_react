import {
    CompressOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    ExpandAltOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import {
    App as AntdApp,
    Button,
    Card,
    Collapse,
    Flex,
    Grid,
    Space,
    Tag,
    Tooltip,
    Typography,
} from 'antd'
import { useEffect, useState } from 'react'

import { MatchFormModal } from '@/components/MatchFormModal.jsx'
import { weekDayOptions } from '@/data/matchOptions.js'
import { getApiErrorMessage } from '@/services/api.js'
import { listChampionships } from '@/services/championshipService.js'
import { listClubs } from '@/services/clubService.js'
import {
    createMatch,
    deleteAllMatches,
    deleteMatch,
    listMatches,
    updateMatch,
} from '@/services/matchService.js'
import { listTransmissions } from '@/services/transmissionService.js'

const { Text, Title } = Typography
const { useBreakpoint } = Grid
const alwaysVisibleDays = new Set(['sábado', 'domingo'])
const getVisibleWeekDays = (matches) => weekDayOptions
    .filter(({ value }) =>
        alwaysVisibleDays.has(value)
        || matches.some((match) => match.weekDay === value)
    )
    .map(({ value }) => value)

export const Partidas = () => {
    const screens = useBreakpoint()
    const { modal, notification } = AntdApp.useApp()
    const [matches, setMatches] = useState([])
    const [clubs, setClubs] = useState([])
    const [championships, setChampionships] = useState([])
    const [transmissions, setTransmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingMatch, setEditingMatch] = useState(null)
    const [showActions, setShowActions] = useState(false)
    const [activeDays, setActiveDays] = useState(['sábado', 'domingo'])

    useEffect(() => {
        let active = true

        Promise.all([
            listMatches(),
            listClubs(),
            listChampionships(),
            listTransmissions(),
        ])
            .then(([
                matchData,
                clubData,
                championshipData,
                transmissionData,
            ]) => {
                if (!active) return
                setMatches(matchData)
                setClubs(clubData)
                setChampionships(championshipData)
                setTransmissions(transmissionData)
                setActiveDays(getVisibleWeekDays(matchData))
            })
            .catch((error) => notification.error({
                title: getApiErrorMessage(error),
            }))
            .finally(() => active && setLoading(false))

        return () => { active = false }
    }, [notification])

    const openNewMatchModal = () => {
        setEditingMatch(null)
        setModalOpen(true)
    }

    const openEditMatchModal = (match) => {
        setEditingMatch(match)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditingMatch(null)
    }

    const handleSave = async (matchData) => {
        try {
            if (editingMatch) {
                const updated = await updateMatch(editingMatch.id, matchData)
                setMatches((current) => current.map((match) =>
                    match.id === editingMatch.id ? updated : match
                ))
                notification.success({ title: 'Partida atualizada com sucesso.' })
            } else {
                const created = await createMatch(matchData)
                setMatches((current) => [...current, created])
                notification.success({ title: 'Partida cadastrada com sucesso.' })
            }

            setActiveDays((current) => current.includes(matchData.weekDay)
                ? current
                : [...current, matchData.weekDay])
            closeModal()
        } catch (error) {
            notification.error({ title: getApiErrorMessage(error) })
        }
    }

    const handleDelete = async (id) => {
        await deleteMatch(id)
        setMatches((current) => current.filter((match) => match.id !== id))
        notification.success({ title: 'Partida excluída com sucesso.' })
    }

    const confirmDelete = (match) => {
        modal.confirm({
            title: 'Excluir partida',
            content: `Deseja excluir ${match.homeTeam} x ${match.awayTeam}?`,
            okText: 'Excluir',
            cancelText: 'Cancelar',
            okButtonProps: { danger: true },
            onOk: () => handleDelete(match.id).catch((error) => {
                notification.error({ title: getApiErrorMessage(error) })
                throw error
            }),
        })
    }

    const handleClearMatches = () => {
        modal.confirm({
            title: 'Limpar todas as partidas',
            content: 'Deseja excluir todas as partidas cadastradas?',
            okText: 'Limpar',
            cancelText: 'Cancelar',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await deleteAllMatches()
                    setMatches([])
                    setShowActions(false)
                    setActiveDays(['sábado', 'domingo'])
                    notification.success({
                        title: 'Partidas excluídas com sucesso.',
                    })
                } catch (error) {
                    notification.error({ title: getApiErrorMessage(error) })
                    throw error
                }
            },
        })
    }

    const visibleWeekDays = getVisibleWeekDays(matches)
    const allDaysAreOpen = visibleWeekDays.every((day) =>
        activeDays.includes(day)
    )

    const collapseItems = weekDayOptions
        .filter(({ value }) => visibleWeekDays.includes(value))
        .map(({ value, label }) => {
        const dayMatches = matches
            .filter((match) => match.weekDay === value)
            .sort((firstMatch, secondMatch) =>
                firstMatch.time.localeCompare(secondMatch.time)
            )

        return {
            key: value,
            label: (
                <Flex justify="space-between" align="center" gap="small">
                    <Text strong>{label}</Text>
                    <Tag>{dayMatches.length}</Tag>
                </Flex>
            ),
            children: dayMatches.length ? (
                <Flex vertical gap="small">
                    {dayMatches.map((match) => (
                        <Flex
                            key={match.id}
                            justify="space-between"
                            align="center"
                            gap="small"
                            wrap
                            style={{
                                paddingBottom: 10,
                                borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
                            }}
                        >
                            <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                                <Text strong>
                                    {match.homeTeam} x {match.awayTeam}
                                </Text>
                                <br />
                                <Text type="secondary">
                                    {match.time.replace(':', 'h')} · Transmissão: {match.broadcast}
                                </Text>
                            </div>

                            {showActions && (
                                <Space>
                                    <Tooltip title="Editar">
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            aria-label={`Editar ${match.homeTeam} x ${match.awayTeam}`}
                                            onClick={() => openEditMatchModal(match)}
                                        />
                                    </Tooltip>

                                    <Tooltip title="Excluir">
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            aria-label={`Excluir ${match.homeTeam} x ${match.awayTeam}`}
                                            onClick={() => confirmDelete(match)}
                                        />
                                    </Tooltip>
                                </Space>
                            )}
                        </Flex>
                    ))}
                </Flex>
            ) : (
                <Text type="secondary">Nenhuma partida cadastrada.</Text>
            ),
        }
        })

    return (
        <Card loading={loading}>
            <Title level={4}>Partidas</Title>

            <Flex
                justify="flex-end"
                gap="small"
                wrap
                style={{ marginBottom: 16 }}
            >
                <Tooltip title={!screens.md ? 'Inserir Partida' : null}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        aria-label="Inserir Partida"
                        onClick={openNewMatchModal}
                    >
                        {screens.md && 'Inserir Partida'}
                    </Button>
                </Tooltip>

                {matches.length > 0 && (
                    <>
                        <Tooltip
                            title={!screens.md
                                ? (showActions ? 'Ocultar Ações' : 'Exibir Ações')
                                : null}
                        >
                            <Button
                                icon={showActions
                                    ? <EyeInvisibleOutlined />
                                    : <EyeOutlined />}
                                aria-label={showActions
                                    ? 'Ocultar Ações'
                                    : 'Exibir Ações'}
                                onClick={() => setShowActions((current) => !current)}
                            >
                                {screens.md && (
                                    showActions ? 'Ocultar Ações' : 'Exibir Ações'
                                )}
                            </Button>
                        </Tooltip>

                        <Tooltip
                            title={!screens.md
                                ? (allDaysAreOpen
                                    ? 'Recolher Dias'
                                    : 'Expandir Dias')
                                : null}
                        >
                            <Button
                                icon={allDaysAreOpen
                                    ? <CompressOutlined />
                                    : <ExpandAltOutlined />}
                                aria-label={allDaysAreOpen
                                    ? 'Recolher Dias'
                                    : 'Expandir Dias'}
                                onClick={() => setActiveDays(
                                    allDaysAreOpen ? [] : visibleWeekDays
                                )}
                            >
                                {screens.md && (
                                    allDaysAreOpen
                                        ? 'Recolher Dias'
                                        : 'Expandir Dias'
                                )}
                            </Button>
                        </Tooltip>

                        <Tooltip title={!screens.md ? 'Limpar Partidas' : null}>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                aria-label="Limpar Partidas"
                                onClick={handleClearMatches}
                            >
                                {screens.md && 'Limpar Partidas'}
                            </Button>
                        </Tooltip>
                    </>
                )}
            </Flex>

            <Collapse
                items={collapseItems}
                activeKey={activeDays}
                onChange={setActiveDays}
            />

            <MatchFormModal
                open={modalOpen}
                match={editingMatch}
                matches={matches}
                clubs={clubs}
                championships={championships}
                transmissions={transmissions}
                onCancel={closeModal}
                onSave={handleSave}
            />
        </Card>
    )
}
