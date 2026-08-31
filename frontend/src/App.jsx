import '@/global.css'
import { App as AntdApp, ConfigProvider, theme } from 'antd'

import { useThemeMode } from '@/hooks/useThemeMode.js'
import { MainRouter } from '@/routes/MainRouter.jsx'

export const App = () => {
    const { darkMode, themeMode, setThemeMode } = useThemeMode()

    return (
        <ConfigProvider
            theme={{
                algorithm: darkMode
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
            }}
        >
            <AntdApp
                notification={{ placement: 'bottomRight', duration: 3 }}
            >
                <MainRouter
                    darkMode={darkMode}
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                />
            </AntdApp>
        </ConfigProvider>
    )
}
