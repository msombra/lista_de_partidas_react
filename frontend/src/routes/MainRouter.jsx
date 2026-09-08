import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { MainLayout } from '@/components/MainLayout.jsx'
import { Campeonatos } from '@/pages/Campeonatos.jsx'
import { Clubes } from '@/pages/Clubes.jsx'
import { Partidas } from '@/pages/Partidas.jsx'
import { Transmissoes } from '@/pages/Transmissoes.jsx'

export const MainRouter = ({ darkMode, themeMode, setThemeMode }) => (
    <BrowserRouter>
        <Routes>
            <Route
                element={(
                    <MainLayout
                        darkMode={darkMode}
                        themeMode={themeMode}
                        setThemeMode={setThemeMode}
                    />
                )}
            >
                <Route index element={<Navigate to="/partidas" replace />} />
                <Route path="partidas" element={<Partidas />} />
                <Route path="clubes" element={<Clubes />} />
                <Route path="campeonatos" element={<Campeonatos />} />
                <Route path="transmissoes" element={<Transmissoes />} />
                <Route path="*" element={<Navigate to="/partidas" replace />} />
            </Route>
        </Routes>
    </BrowserRouter>
)
