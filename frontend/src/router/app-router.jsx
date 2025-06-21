import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/home/home-page'
import Dashboard from '@/pages/dashboard/dashboard-page'
import SewaLapanganDashboard from '@/pages/dashboard/dashboard-guest'

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard-guest" element={<SewaLapanganDashboard />} />
            </Routes>
        </Router>
    )
}