import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Home, List, ShoppingCart, User, Menu, Bell, Star, CalendarIcon, Edit, X, Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  CustomSidebar  from '@/components/sidebar';

const DashboardPemilikVenue = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalVisits: 0,
        totalReservations: 0,
        revenueGrowth: 0,
        visitsGrowth: 0,
        reservationsGrowth: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        // Fetch dashboard stats
        fetch('http://localhost:3000/api/v1/dashboard/owner/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.stats) setStats(data.stats);
            });
        // Fetch recent orders (with price info)
        fetch('http://localhost:3000/api/v1/dashboard/owner/recent-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.orders)) setRecentOrders(data.orders);
            });
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        navigate('/login');
    };

    const handleChangePassword = () => {
        console.log("Changing password...");
        navigate('/verification');
    };

    const filteredOrders = recentOrders.filter(order =>
        (order.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.venue || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.id || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen font-sans relative">
            <CustomSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={setActiveMenuItem}
            />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                <div className="p-6">
                    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
                        <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="relative flex items-center w-full max-w-md mx-4">
                            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari berdasarkan customer, venue, atau ID..."
                                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100">
                            <Bell className="h-6 w-6" />
                        </Button>
                    </header>

                    {/* Welcome Banner and Stats Cards (tidak berubah) */}
                    <div className="relative bg-green-700 rounded-lg shadow-md overflow-hidden mb-6 p-8 text-white text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-600 opacity-90"></div>
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute top-1/2 left-1/3 w-8 h-8 border-2 border-white rounded-full opacity-30"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Selamat Datang</h2>
                            <h3 className="text-2xl font-semibold mb-2">di Dashboard Pemilik Venue</h3>
                            <p className="text-green-100">Kelola Venue anda dengan mudah dan efisien</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                        <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Reservasi</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalReservations}</p>
                        </Card>
                    </div>

                    <Card className="p-6 bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h3>
                        <div className="overflow-x-auto">
        {filteredOrders.length > 0 ? (
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Venue</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Field</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Session</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="py-4 px-4 font-medium text-gray-900">{order.id}</td>
                            <td className="py-4 px-4 text-gray-700">{order.customer}</td>
                            <td className="py-4 px-4 text-gray-700">{order.venue}</td>
                            <td className="py-4 px-4 text-gray-700">{order.field}</td>
                            <td className="py-4 px-4 text-gray-700">{order.date}</td>
                            <td className="py-4 px-4 text-gray-700">{order.session}</td>
                            <td className="py-4 px-4 text-gray-700">{order.status}</td>
                            <td className="py-4 px-4 text-gray-700">{order.price ? formatCurrency(order.price) : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada order ditemukan</h3>
                <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
        )}
    </div>
</Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPemilikVenue;