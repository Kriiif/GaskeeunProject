import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Home, List, ShoppingCart, User, Menu, Bell, Star, CalendarIcon, Edit, X, Search, TrendingUp } from 'lucide-react';
import CustomSidebarSuperAdmin from '../../../components/sidebarSuperAdmin';

const DashboardSuperAdmin = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalApply: 0,
        totalVenueOwner: 0,
        revenueGrowth: 0,
        visitsGrowth: 0,
        reservationsGrowth: 0
    });
    const [recentApply, setRecentApply] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatsAndApply = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            try {
                // Fetch stats
                const statsRes = await fetch('http://localhost:3000/api/v1/dashboard/superadmin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                if (statsRes.ok && statsData.stats) setStats(statsData.stats);

                // Fetch recent apply
                const applyRes = await fetch('http://localhost:3000/api/v1/partnership', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const applyData = await applyRes.json();
                if (applyRes.ok && applyData.success && Array.isArray(applyData.data)) {
                    setRecentApply(applyData.data.slice(0, 10).map(request => ({
                        id: request._id,
                        customer: request.namaPemilik,
                        venueName: request.namaVenue,
                        dateApply: new Date(request.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        }),
                        status: request.status === 'on hold' ? 'On Hold' : request.status === 'approved' ? 'Accepted' : 'Rejected',
                    })));
                }
            } catch (err) {
                setError('Gagal mengambil data dari server');
            } finally {
                setLoading(false);
            }
        };
        fetchStatsAndApply();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Ganti recentApply.map dengan filteredRecentApply.map jika ingin search
    const filteredRecentApply = recentApply.filter(apply =>
        (apply.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (apply.venueName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (apply.status || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100 font-sans relative">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-lg text-gray-600">Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-100 font-sans relative">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg text-red-600">{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4 bg-green-500 hover:bg-green-700">Try Again</Button>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="flex min-h-screen font-sans relative">
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Render the Sidebar component and pass props */}
            <CustomSidebarSuperAdmin
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={setActiveMenuItem}
            />

            {/* Main Content Area */}
            <div className={`
                flex-1 transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
            `}>
                <div className="p-6">
                    {/* Header */}
                    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
                        <Button
                            variant="ghost"
                            className="p-2 h-auto hover:bg-gray-100"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>

                        {/* Search Bar */}
                        <div className="relative flex items-center w-full max-w-md mx-4">
                            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search venues..."
                                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100">
                            <Bell className="h-6 w-6" />
                        </Button>
                    </header>

                    {/* Welcome Banner */}
                    <div className="relative bg-green-700 rounded-lg shadow-md overflow-hidden mb-6 p-8 text-white text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-600 opacity-90"></div>
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute top-1/2 left-1/3 w-8 h-8 border-2 border-white rounded-full opacity-30"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Selamat Datang</h2>
                            <h3 className="text-2xl font-semibold mb-2">SUPER ADMIN</h3>
                            <p className="text-green-100">Kelola Gaskeeun dengan mudah dan efisien</p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Revenue */}
                        <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Pendapatan</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatCurrency(stats.totalRevenue)}
                            </p>
                        </Card>

                        {/* Total Visits */}
                        <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Pengajuan</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalApply}</p>
                        </Card>

                        {/* Total Reservations */}
                        <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Pemilik Venue</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalVenueOwner}</p>
                        </Card>
                    </div>

                    {/* Recent applyment Table */}
                    <Card className="p-6 bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Applyment</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 text-center">
                                        <th className="py-3 px-4 font-semibold text-gray-700">Apply ID</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Customer</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Venue Name</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Date Apply</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecentApply.map((apply, index) => (
                                        <tr key={apply.id} className={`border-b border-gray-100 text-center hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="py-4 px-4 font-medium text-gray-900">{apply.id}</td>
                                            <td className="py-4 px-4 text-gray-700">{apply.customer}</td>
                                            <td className="py-4 px-4 text-gray-700">{apply.venueName}</td>
                                            <td className="py-4 px-4 text-gray-700">{apply.dateApply}</td>
                                            <td className={`py-4 px-4 text-gray-700 font-semibold ${apply?.status === 'Accepted' ? 'bg-green-500 text-white' : apply?.status === 'Rejected'? 'bg-red-500 text-white': 'bg-yellow-300 text-black'}`}>{apply.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DashboardSuperAdmin