import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from '@ant-design/icons'
import {
    App as AntdApp,
    Button,
    Flex,
    Grid,
    Input,
    Space,
    Table,
    Tooltip,
    Typography,
} from 'antd'
import { useState } from 'react'

const { Search } = Input
const { Title } = Typography
const { useBreakpoint } = Grid

export const EntityDataTable = ({
    title,
    data,
    columns,
    entityName,
    entityNamePlural,
    searchPlaceholder,
    getSearchText,
    getRecordLabel = (record) => record.name,
    onEdit,
    onDelete,
    loading = false,
}) => {
    const { modal } = AntdApp.useApp()
    const screens = useBreakpoint()
    const [searchTerm, setSearchTerm] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR')
    const filteredData = data.filter((record) =>
        getSearchText(record)
            .toLocaleLowerCase('pt-BR')
            .includes(normalizedSearch)
    )
    const pageSize = screens.xxl ? 10 : 5
    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
    const visiblePage = Math.min(currentPage, totalPages)

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    const responsiveColumns = [
        ...columns.map((column) => ({
            ...column,
            onCell: () => ({ style: { overflowWrap: 'anywhere' } }),
        })),
        {
            title: 'Ações',
            key: 'actions',
            width: screens.sm ? 110 : 88,
            align: 'center',
            render: (_, record) => {
                const recordLabel = getRecordLabel(record)

                return (
                    <Space>
                        <Tooltip title="Editar">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                aria-label={`Editar ${recordLabel}`}
                                onClick={() => onEdit(record)}
                            />
                        </Tooltip>

                        <Tooltip title="Excluir">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                aria-label={`Excluir ${recordLabel}`}
                                onClick={() => modal.confirm({
                                    title: `Excluir ${entityName}`,
                                    content: `Deseja excluir ${recordLabel}?`,
                                    okText: 'Excluir',
                                    cancelText: 'Cancelar',
                                    okButtonProps: { danger: true },
                                    onOk: () => onDelete(record.id),
                                })}
                            />
                        </Tooltip>
                    </Space>
                )
            },
        },
    ]

    const searchInput = (mobile = false) => (
        <Search
            autoFocus={mobile}
            value={searchTerm}
            placeholder={searchPlaceholder}
            allowClear
            aria-label={searchPlaceholder}
            onChange={handleSearchChange}
            onBlur={() => {
                if (mobile && !searchTerm) setSearchOpen(false)
            }}
            onKeyDown={(event) => {
                if (mobile && event.key === 'Escape') setSearchOpen(false)
            }}
            style={mobile
                ? { width: '100%', flexBasis: '100%' }
                : { width: 280, maxWidth: '100%' }}
        />
    )

    return (
        <section>
            <Flex
                justify="space-between"
                align="center"
                gap="small"
                wrap
                style={{ marginTop: 24 }}
            >
                <Title level={5} style={{ margin: 0 }}>
                    {title}
                </Title>

                {screens.sm ? searchInput() : searchOpen ? (
                    searchInput(true)
                ) : (
                    <Button
                        type="text"
                        icon={<SearchOutlined />}
                        aria-label="Abrir busca"
                        onClick={() => setSearchOpen(true)}
                    />
                )}
            </Flex>

            <Table
                columns={responsiveColumns}
                dataSource={filteredData}
                loading={loading}
                rowKey="id"
                tableLayout="fixed"
                pagination={{
                    current: visiblePage,
                    pageSize,
                    showSizeChanger: false,
                    showTotal: (total) =>
                        `${total} ${total === 1 ? entityName : entityNamePlural}`,
                }}
                onChange={(pagination) => setCurrentPage(pagination.current)}
                locale={{ emptyText: `Nenhum ${entityName} encontrado` }}
                style={{ marginTop: 12 }}
            />
        </section>
    )
}
