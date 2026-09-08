import {
    DesktopOutlined,
    MoonOutlined,
    MoreOutlined,
    ScheduleOutlined,
    SunOutlined,
    TeamOutlined,
    TrophyOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Grid, Layout, Menu, theme } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

const { Header } = Layout
const { useBreakpoint } = Grid

const navigationItems = [
    { key: '/partidas', icon: <ScheduleOutlined />, label: 'Partidas' },
    { key: '/clubes', icon: <TeamOutlined />, label: 'Clubes' },
    { key: '/campeonatos', icon: <TrophyOutlined />, label: 'Campeonatos' },
    {
        key: '/transmissoes',
        icon: <VideoCameraOutlined />,
        label: 'Transmissões',
    },
]

const themeItems = [
    { key: 'light', icon: <SunOutlined />, label: 'Clara' },
    { key: 'dark', icon: <MoonOutlined />, label: 'Escura' },
    {
        key: 'system',
        icon: <DesktopOutlined />,
        label: 'Padrão do Sistema',
    },
]

export const AppHeader = ({ darkMode, themeMode, setThemeMode }) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const screens = useBreakpoint()
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken()

    const navigationMenu = {
        items: navigationItems,
        selectable: true,
        selectedKeys: [pathname],
        onClick: ({ key }) => navigate(key),
    }

    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                background: colorBgContainer,
                borderBottom: darkMode
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid #f0f0f0',
            }}
        >
            {screens.md ? (
                <Menu
                    {...navigationMenu}
                    mode="horizontal"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        borderBottom: 'none',
                        background: 'transparent',
                    }}
                />
            ) : (
                <Dropdown trigger={['click']} menu={navigationMenu}>
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        aria-label="Abrir menu"
                        style={{ marginRight: 'auto', fontSize: 20 }}
                    />
                </Dropdown>
            )}

            <Dropdown
                trigger={['click']}
                placement="bottomRight"
                menu={{
                    items: themeItems,
                    selectable: true,
                    selectedKeys: [themeMode],
                    onClick: ({ key }) => setThemeMode(key),
                }}
            >
                <Button
                    type="text"
                    icon={darkMode ? <MoonOutlined /> : <SunOutlined />}
                    aria-label="Alterar tema"
                    title="Alterar tema"
                    style={{
                        marginLeft: 24,
                        fontSize: 20,
                        color: colorText,
                    }}
                />
            </Dropdown>
        </Header>
    )
}
