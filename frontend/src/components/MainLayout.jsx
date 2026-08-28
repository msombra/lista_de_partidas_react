import { Grid, Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'

import { AppHeader } from '@/components/AppHeader.jsx'

const { Content } = Layout
const { useBreakpoint } = Grid

export const MainLayout = ({ darkMode, themeMode, setThemeMode }) => {
    const screens = useBreakpoint()
    const {
        token: { colorBgLayout },
    } = theme.useToken()

    const contentWidth = screens.lg
        ? '50%'
        : screens.md
            ? '90%'
            : '100%'

    return (
        <Layout style={{ minHeight: '100vh', background: colorBgLayout }}>
            <AppHeader
                darkMode={darkMode}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
            />

            <Content
                style={{
                    width: contentWidth,
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    padding: screens.sm ? 24 : 12,
                    background: colorBgLayout,
                }}
            >
                <Outlet />
            </Content>
        </Layout>
    )
}
