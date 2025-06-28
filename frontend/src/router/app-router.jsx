import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/home/home-page'
import SewaLapanganDashboard from '@/pages/dashboard/dashboard-guest'
import SewaLapanganDashboard1 from '@/pages/dashboard/dashboard-user'
import DetailProductPage from '@/pages/product/detailproduct-guest'
import KelolaLapanganDashboard from '@/pages/dashboard/owner/dashboard-kelolavenue'
import LoginPage from '@/pages/auth/login'
import DashboardPemilikVenue from '../pages/dashboard/owner/dashboard-main'

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard-guest" element={<SewaLapanganDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard-user" element={<SewaLapanganDashboard1 />} />
                <Route path="/detailproduct-guest" element={<DetailProductPage />} />
                <Route path="/dashboard-kelolavenue" element={<KelolaLapanganDashboard />} />
                <Route path="/dashboard-main" element={<DashboardPemilikVenue />} />
            </Routes>
        </Router>
    )
}