import { Form, Input, Modal, Radio, Select } from 'antd'
import { useEffect, useMemo } from 'react'

import { weekDayOptions } from '@/data/matchOptions.js'

export const MatchFormModal = ({
    open,
    match,
    matches,
    clubs,
    championships,
    transmissions,
    onCancel,
    onSave,
}) => {
    const [form] = Form.useForm()
    const selectedChampionship = Form.useWatch('championshipId', form)
    const selectedHomeClubId = Form.useWatch('homeClubId', form)
    const visitorIsRegistered = Form.useWatch('visitorIsRegistered', form)
    const selectedBroadcast = Form.useWatch('broadcastOption', form)
    const broadcastOptions = useMemo(() =>
        transmissions.map((transmission) => ({
            value: transmission.name,
            label: transmission.name,
        })), [transmissions])

    const championshipOptions = championships
        .filter((championship) => {
            const isChampionsLeague = championship.name
                .toLocaleLowerCase('pt-BR') === 'champions league'
            const usedClubIds = new Set(
                matches
                    .filter((scheduledMatch) =>
                        scheduledMatch.id !== match?.id
                        && scheduledMatch.championshipId === championship.id
                    )
                    .flatMap((scheduledMatch) => [
                        scheduledMatch.homeClubId,
                        scheduledMatch.awayClubId,
                    ])
                    .filter(Boolean)
            )
            const eligibleClubs = isChampionsLeague
                ? clubs
                : clubs.filter(
                    (club) => club.championshipId === championship.id
                )

            return eligibleClubs.some((club) => !usedClubIds.has(club.id))
        })
        .map((championship) => ({
            value: championship.id,
            label: championship.name,
        }))

    const selectedChampionshipData = championships.find(
        (championship) => championship.id === selectedChampionship
    )
    const isChampionsLeague = selectedChampionshipData?.name
        .toLocaleLowerCase('pt-BR') === 'champions league'

    const usedClubIds = new Set(
        matches
            .filter((scheduledMatch) =>
                scheduledMatch.id !== match?.id
                && scheduledMatch.championshipId === selectedChampionship
            )
            .flatMap((scheduledMatch) => [
                scheduledMatch.homeClubId,
                scheduledMatch.awayClubId,
            ])
            .filter(Boolean)
    )
    const availableClubs = clubs.filter((club) =>
        !usedClubIds.has(club.id)
        && (isChampionsLeague || club.championshipId === selectedChampionship)
    )
    const clubOptions = availableClubs
        .map((club) => ({ value: club.id, label: club.name }))

    const availableWeekDayOptions = isChampionsLeague
        ? weekDayOptions.filter(({ value }) =>
            ['terça', 'quarta', 'quinta'].includes(value)
        )
        : weekDayOptions

    const canSelectRegisteredVisitor = clubOptions.length > 1
    const usesExternalVisitor = !canSelectRegisteredVisitor
        || visitorIsRegistered === 'no'

    useEffect(() => {
        if (!open) return

        const registeredVisitor = Boolean(match?.awayClubId)

        form.setFieldsValue(match ? {
            ...match,
            visitorIsRegistered: registeredVisitor ? 'yes' : 'no',
            awayClubId: registeredVisitor ? match.awayClubId : undefined,
            awayTeamName: registeredVisitor ? undefined : match.awayTeamName,
            broadcastOption: broadcastOptions.some(
                ({ value }) => value === match.broadcast && value !== 'Outro'
            ) ? match.broadcast : 'Outro',
            otherBroadcast: broadcastOptions.some(
                ({ value }) => value === match.broadcast
            ) ? undefined : match.broadcast,
        } : {
            championshipId: undefined,
            homeClubId: undefined,
            visitorIsRegistered: undefined,
            awayClubId: undefined,
            awayTeamName: undefined,
            weekDay: undefined,
            time: undefined,
            broadcastOption: undefined,
            otherBroadcast: undefined,
        })
    }, [broadcastOptions, form, match, open])

    const handleChampionshipChange = (championship) => {
        const championshipData = championships.find(
            (item) => item.id === championship
        )
        const championsLeagueSelected = championshipData?.name
            .toLocaleLowerCase('pt-BR') === 'champions league'
        const usedClubIdsForChampionship = new Set(
            matches
                .filter((scheduledMatch) =>
                    scheduledMatch.id !== match?.id
                    && scheduledMatch.championshipId === championship
                )
                .flatMap((scheduledMatch) => [
                    scheduledMatch.homeClubId,
                    scheduledMatch.awayClubId,
                ])
                .filter(Boolean)
        )
        const availableClubCount = clubs.filter((club) =>
            !usedClubIdsForChampionship.has(club.id)
            && (championsLeagueSelected || club.championshipId === championship)
        ).length

        form.setFieldsValue({
            homeClubId: undefined,
            visitorIsRegistered: availableClubCount > 1 ? undefined : 'no',
            awayClubId: undefined,
            awayTeamName: undefined,
            weekDay: undefined,
        })
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()
        const broadcast = values.broadcastOption === 'Outro'
            ? values.otherBroadcast.trim()
            : values.broadcastOption
        const awayTeam = canSelectRegisteredVisitor
            && values.visitorIsRegistered === 'yes'
            ? values.awayClubId
            : values.awayTeamName.trim()

        await onSave({
            championshipId: values.championshipId,
            homeClubId: values.homeClubId,
            awayClubId: canSelectRegisteredVisitor
                && values.visitorIsRegistered === 'yes'
                ? awayTeam
                : null,
            awayTeamName: canSelectRegisteredVisitor
                && values.visitorIsRegistered === 'yes'
                ? null
                : awayTeam,
            weekDay: values.weekDay,
            time: values.time,
            broadcast,
        })
    }

    return (
        <Modal
            open={open}
            title={match ? 'Editar partida' : 'Inserir partida'}
            okText={match ? 'Atualizar' : 'Salvar'}
            cancelText="Cancelar"
            onOk={handleSubmit}
            onCancel={onCancel}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item
                    name="championshipId"
                    label="Campeonato"
                    rules={[{ required: true, message: 'Selecione o campeonato' }]}
                >
                    <Select
                        options={championshipOptions}
                        placeholder="Selecione o campeonato"
                        showSearch
                        optionFilterProp="label"
                        onChange={handleChampionshipChange}
                    />
                </Form.Item>

                {selectedChampionship && (
                    <>
                        <Form.Item
                            name="homeClubId"
                            label="Time mandante"
                            rules={[{ required: true, message: 'Selecione o time mandante' }]}
                        >
                            <Select
                                options={clubOptions}
                                placeholder="Selecione o time mandante"
                                showSearch
                                optionFilterProp="label"
                                onChange={() => form.setFieldValue('awayClubId', undefined)}
                            />
                        </Form.Item>

                        {canSelectRegisteredVisitor && (
                            <Form.Item
                                name="visitorIsRegistered"
                                label="O time visitante está cadastrado?"
                                rules={[{
                                    required: true,
                                    message: 'Informe se o time está cadastrado',
                                }]}
                            >
                                <Radio.Group
                                    options={[
                                        { value: 'yes', label: 'Sim' },
                                        { value: 'no', label: 'Não' },
                                    ]}
                                    onChange={() => form.setFieldsValue({
                                        awayClubId: undefined,
                                        awayTeamName: undefined,
                                    })}
                                />
                            </Form.Item>
                        )}

                        {visitorIsRegistered === 'yes' && (
                            <Form.Item
                                name="awayClubId"
                                label="Time visitante"
                                rules={[{
                                    required: true,
                                    message: 'Selecione o time visitante',
                                }]}
                            >
                                <Select
                                    options={clubOptions.filter(
                                        (option) => option.value !== selectedHomeClubId
                                    )}
                                    placeholder="Selecione o time visitante"
                                    showSearch
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        )}

                        {usesExternalVisitor && (
                            <Form.Item
                                name="awayTeamName"
                                label="Time visitante"
                                rules={[{
                                    required: true,
                                    whitespace: true,
                                    message: 'Informe o time visitante',
                                }]}
                            >
                                <Input
                                    placeholder="Nome do time visitante"
                                    maxLength={100}
                                />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="weekDay"
                            label="Dia da semana"
                            rules={[{ required: true, message: 'Selecione o dia da semana' }]}
                        >
                            <Select
                                options={availableWeekDayOptions}
                                placeholder="Selecione o dia"
                            />
                        </Form.Item>

                        <Form.Item
                            name="time"
                            label="Horário"
                            rules={[{ required: true, message: 'Informe o horário' }]}
                        >
                            <Input type="time" />
                        </Form.Item>

                        <Form.Item
                            name="broadcastOption"
                            label="Transmissão"
                            rules={[{ required: true, message: 'Selecione a transmissão' }]}
                        >
                            <Select
                                options={broadcastOptions}
                                placeholder="Selecione a transmissão"
                            />
                        </Form.Item>

                        {selectedBroadcast === 'Outro' && (
                            <Form.Item
                                name="otherBroadcast"
                                label="Outra transmissão"
                                rules={[{
                                    required: true,
                                    whitespace: true,
                                    message: 'Informe a transmissão',
                                }]}
                            >
                                <Input
                                    placeholder="Nome da transmissão"
                                    maxLength={100}
                                />
                            </Form.Item>
                        )}
                    </>
                )}
            </Form>
        </Modal>
    )
}
