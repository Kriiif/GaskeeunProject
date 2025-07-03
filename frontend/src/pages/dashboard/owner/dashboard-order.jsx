import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Home, List, ShoppingCart, User, Menu, Bell, Search, Filter, X, Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
import CustomSidebar from '@/components/sidebar'; // Import DropdownMenuItem
import axios from 'axios'; // Import axios
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DashboardOrder = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('Order');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderDetail, setOrderDetail] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

    const handleDetailClick = (order) => {
        setOrderDetail(order);
        setIsDetailDialogOpen(true);
    };

    const navigate = useNavigate(); // Initialize useNavigate hook

    // Sample orders data
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/bookings');
                const formattedOrders = response.data.map(order => ({
                    id: order.order_id,
                    customer: order.user_id.name,
                    fieldName: order.field_id.name, // Add fieldName
                    date: new Date(order.booking_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
                    session: order.booking_time,
                    totalPrice: `Rp ${order.field_id.price.toLocaleString('id-ID')}`,
                    status: order.status
                }));
                setOrders(formattedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // Filter orders based on search and filters
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (order.fieldName && order.fieldName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex min-h-screen font-sans relative">
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

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                                <thead className="text-center bg-gray-50 border-b border-gray-200 justify-center">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Order ID</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Lapangan</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Session</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Total</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-900">Transaction <br /> Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="text-center hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    {order.fieldName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    {order.session}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.totalPrice}</td>
                                            <td className="px-6 py-4"><button 
                                                onClick={() => handleDetailClick(order)} className='py-2 px-5 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-700'>Detail</button>
                                            </td>
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

            {/* Dialog Detail transaksi */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Detail Transaksi</DialogTitle>
                        <DialogDescription>
                            Berikut ini adalah detail transaksi penyewaan venue
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Nama */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="customer" className="text-right font-medium">
                                Nama
                            </label>
                            <Input
                                id="customer"
                                name="customer"
                                value={orderDetail?.customer || ''}
                                readOnly
                                className="col-span-3 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Lokasi */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="venueId" className="text-right font-medium">
                                Lapangan
                            </label>
                            <Input
                                id="venueId"
                                name="venueId"
                                value={orderDetail?.fieldName || ''}
                                readOnly
                                className="col-span-3 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Tanggal */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="date" className="text-right font-medium">
                                Tanggal
                            </label>
                            <Input
                                id="date"
                                name="date"
                                value={orderDetail?.date || ''}
                                readOnly
                                className="col-span-3 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Sesi */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="session" className="text-right font-medium">
                                Sesi
                            </label>
                            <Input
                                id="session"
                                name="session"
                                value={orderDetail?.session || ''}
                                readOnly
                                className="col-span-3 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Total Harga */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="totalPrice" className="text-right font-medium">
                                Total
                            </label>
                            <Input
                                id="totalPrice"
                                name="totalPrice"
                                value={orderDetail?.totalPrice || ''}
                                readOnly
                                className="col-span-3 bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default DashboardOrder;