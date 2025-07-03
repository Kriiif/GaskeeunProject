import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/home/home-page'
import DetailProductPage from '@/pages/product/detailproduct-guest'
import KelolaLapanganDashboard from '@/pages/dashboard/owner/dashboard-kelolavenue'
import LoginPage from '@/pages/auth/login'
import SignupPage from '../pages/auth/signup'
import DashboardPemilikVenue from '../pages/dashboard/owner/dashboard-main'
import PartnershipPageUser from '../pages/product/partnership'
import DashboardOrder from '../pages/dashboard/owner/dashboard-order'
import Verification from '../pages/auth/verif'
import PartnershipPage from '../pages/product/partnership-guest'
import CheckoutPage from '../pages/checkout/checkout'
import DashboardSuperAdmin from '../pages/dashboard/superAdmin/dashboard-superAdmin'
import DashboardKelolaAjuan from '../pages/dashboard/superAdmin/dashboard-kelolaPengajuan'
import HistoryUserList from '../pages/dashboard/history-user'
import ProfileUser from '../pages/dashboard/profile-pages'
import DashboardListOwnerVenue from '../pages/dashboard/superAdmin/dashboard-listVenueOwner'
import Dashboard from '../pages/dashboard/dashboard'
import FormPartner from '../pages/dashboard/form-partner'
import VenueDetailPage from '../pages/product/venue-detail'

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* dashboard-guest di set sebagai root */}
                {/* <Route path="/" element={<SewaLapanganDashboard />} /> */}                <Route path="/" element={<Dashboard />} />
                <Route path="/venue/:venueId" element={<VenueDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/detailproduct-guest" element={<DetailProductPage />} />
                <Route path="/partnership-guest" element={<PartnershipPage />} />

                {/* route halaman untuk user */}
                <Route path="/partnership" element={<PartnershipPageUser />} />
                <Route path="/profile-pages" element={<ProfileUser />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/history-user" element={<HistoryUserList />} />
                <Route path="/form-partner" element={<FormPartner />} />

                {/* route halaman untuk pemilik venue */}
                <Route path="/dashboard-kelolavenue" element={<KelolaLapanganDashboard />} />
                <Route path="/dashboard-main" element={<DashboardPemilikVenue />} />
                <Route path="/dashboard-order" element={<DashboardOrder />} />
                
                {/* Route halaman untuk super admin */}
                <Route path="/dashboard-superAdmin" element={<DashboardSuperAdmin />} />
                <Route path="/dashboard-kelolaAjuan" element={<DashboardKelolaAjuan />} />
                <Route path="/dashboard-listOwner" element={<DashboardListOwnerVenue />} />
            </Routes>
        </Router>
    )
}