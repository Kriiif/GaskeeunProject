import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/home/home-page'
import SewaLapanganDashboard from '@/pages/dashboard/dashboard-guest'
import SewaLapanganDashboard1 from '@/pages/dashboard/dashboard-user'
import DetailProductPage from '@/pages/product/detailproduct-guest'
import KelolaLapanganDashboard from '@/pages/dashboard/owner/dashboard-kelolavenue'
import LoginPage from '@/pages/auth/login'
import DashboardPemilikVenue from '../pages/dashboard/owner/dashboard-main'
import PartnershipPage from '../pages/product/partnership'
import DashboardOrder from '../pages/dashboard/owner/dashboard-order'
import Verification from '../pages/auth/verif'

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* dashboard-guest di set sebagai root */}
                <Route path="/" element={<SewaLapanganDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/detailproduct-guest" element={<DetailProductPage />} />
                <Route path="/partnership" element={<PartnershipPage />} />

                {/* route halaman untuk user */}
                <Route path="/dashboard-user" element={<SewaLapanganDashboard1 />} />

                {/* route halaman untuk pemilik venue */}
                <Route path="/dashboard-kelolavenue" element={<KelolaLapanganDashboard />} />
                <Route path="/dashboard-main" element={<DashboardPemilikVenue />} />
                <Route path="/dashboard-order" element={<DashboardOrder />} />
            </Routes>
        </Router>
    )
}