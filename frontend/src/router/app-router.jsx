import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/home/home-page'
import SewaLapanganDashboard from '@/pages/dashboard/dashboard-guest'
import SewaLapanganDashboard1 from '@/pages/dashboard/dashboard-user'
import DetailProductPage from '@/pages/product/detailproduct-guest'

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard-guest" element={<SewaLapanganDashboard />} />
                <Route path="/dashboard-user" element={<SewaLapanganDashboard1 />} />
                <Route path="/detailproduct-guest" element={<DetailProductPage />} />
            </Routes>
        </Router>
    )
}