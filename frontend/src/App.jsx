import '@/global.css'
import { ConfigProvider, theme } from 'antd'

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
            <MainRouter
                darkMode={darkMode}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
            />
        </ConfigProvider>
    )
}
