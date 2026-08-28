import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'themeMode'
const validThemeModes = ['light', 'dark', 'system']

export const useThemeMode = () => {
    const [themeMode, setThemeMode] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

        return validThemeModes.includes(savedTheme) ? savedTheme : 'system'
    })

    const [systemDarkMode, setSystemDarkMode] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, themeMode)
    }, [themeMode])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = ({ matches }) => {
            setSystemDarkMode(matches)
        }

        mediaQuery.addEventListener('change', handleSystemThemeChange)

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange)
        }
    }, [])

    const darkMode = themeMode === 'dark'
        || (themeMode === 'system' && systemDarkMode)

    return { darkMode, themeMode, setThemeMode }
}
