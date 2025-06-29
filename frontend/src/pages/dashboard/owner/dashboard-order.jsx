import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Home, List, ShoppingCart, User, Menu, Bell, Search, Filter, X, Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
import  CustomSidebar  from '@/components/sidebar'; // Import DropdownMenuItem

const DashboardOrder = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('Order');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [venueFilter, setVenueFilter] = useState('all');
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Sample orders data
    const [orders] = useState([
        {
            id: '#1',
            customer: 'Pham Hanni',
            venueId: 'Lapangan 1',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'confirmed',
            phone: '081234567890',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#2',
            customer: 'Heru Budi',
            venueId: 'Lapangan 2',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'pending',
            phone: '081234567891',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#3',
            customer: 'Pham Minji',
            venueId: 'Lapangan 1',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'confirmed',
            phone: '081234567892',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#4',
            customer: 'Pham Uri',
            venueId: 'Lapangan 1',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'cancelled',
            phone: '081234567893',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#5',
            customer: 'Pham Haerin',
            venueId: 'Lapangan 2',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'confirmed',
            phone: '081234567894',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#6',
            customer: 'Pham Haerin',
            venueId: 'Lapangan 2',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'pending',
            phone: '081234567895',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#7',
            customer: 'Pham Haerin',
            venueId: 'Lapangan 2',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'confirmed',
            phone: '081234567896',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#8',
            customer: 'Pham Haerin',
            venueId: 'Lapangan 2',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'confirmed',
            phone: '081234567897',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#9',
            customer: 'Pham Haerin',
            venueId: 'Lapangan 2',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'cancelled',
            phone: '081234567898',
            totalPrice: 'Rp 150.000'
        },
        {
            id: '#10',
            customer: 'Pham Haerin',
            venueId: 'Lapangan 2',
            date: '26 June 2025',
            session: '10.00-11.00',
            status: 'pending',
            phone: '081234567899',
            totalPrice: 'Rp 150.000'
        }
    ]);

    // Filter orders based on search and filters
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             order.venueId.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesVenue = venueFilter === 'all' || order.venueId === venueFilter;
        
        return matchesSearch && matchesStatus && matchesVenue;
    });

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans relative">
            {/* Overlay untuk mobile ketika sidebar terbuka */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Render the Sidebar component and pass props */}
            <CustomSidebar
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
                    {/* Header Konten Utama */}
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
                                placeholder="Search orders..."
                                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100">
                            <Bell className="h-6 w-6" />
                        </Button>
                    </header>

                    {/* Banner Selamat Datang */}
                    <div className="relative bg-green-700 rounded-lg shadow-md overflow-hidden mb-6 p-8 text-white text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-600 opacity-90"></div>
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute top-1/2 left-1/3 w-8 h-8 border-2 border-white rounded-full opacity-30"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Selamat Datang</h2>
                            <h3 className="text-2xl font-semibold mb-2">di Dashboard Order</h3>
                            <p className="text-green-100">Kelola semua transaksi Order dengan mudah dan efisien</p>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <Card className="p-4 mb-6">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Filter:</span>
                            </div>

                            <Select value={venueFilter} onValueChange={setVenueFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Venue" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Venue</SelectItem>
                                    <SelectItem value="Lapangan 1">Lapangan 1</SelectItem>
                                    <SelectItem value="Lapangan 2">Lapangan 2</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="text-sm text-gray-600 ml-auto">
                                Menampilkan {filteredOrders.length} dari {orders.length} order
                            </div>
                        </div>
                    </Card>

                    {/* Orders Table */}
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200 justify-center">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Venue</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Session</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                                    <div className="text-sm text-gray-500">{order.phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    {order.venueId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    {order.session}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.totalPrice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada order ditemukan</h3>
                                <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardOrder;