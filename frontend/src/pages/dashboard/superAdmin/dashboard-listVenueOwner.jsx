import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Menu, Bell, Search
} from 'lucide-react';
import CustomSidebarSuperAdmin from '../../../components/sidebarSuperAdmin';

const DashboardListOwnerVenue = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('Daftar Pemilik Venue');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [applyDetail, setApplyDetail] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [venueOwner, setvenueOwner] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwners = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:3000/api/v1/partnership', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.success && Array.isArray(data.data)) {
                    // Only show approved owners that have a venue
                    const owners = [];
                    for (const req of data.data) {
                        if (req.status !== 'approved') continue;
                        let venueId = null;
                        let venueStatus = null;
                        let hasVenue = false;
                        try {
                            const venueRes = await fetch(`http://localhost:3000/api/v1/partnership/${req._id}/venue`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const venueData = await venueRes.json();
                            if (venueRes.ok && venueData.success && venueData.data) {
                                venueId = venueData.data._id;
                                venueStatus = venueData.data.status === 'banned' ? 'Banned' : 'Active';
                                hasVenue = true;
                            }
                        } catch {}
                        if (hasVenue) {
                            owners.push({
                                id: req._id,
                                customer: req.namaPemilik,
                                venueName: req.namaVenue,
                                status: venueStatus,
                                imageUrl: req.fotoVenue ? `/uploads/${req.fotoVenue}` : '/venue/default.jpg',
                                partnerReqId: req._id,
                                venueId
                            });
                        }
                    }
                    setvenueOwner(owners);
                }
            } catch (err) {
                setError('Gagal mengambil data dari server');
            } finally {
                setLoading(false);
            }
        };
        fetchOwners();
    }, []);

    const toggleStatus = async (id) => {
        const owner = venueOwner.find(user => user.id === id);
        if (!owner) return;
        // Fetch venueId for this owner
        // You may need to fetch the venueId from backend if not available in owner object
        let venueId = owner.venueId;
        if (!venueId) {
            // Try to fetch venue by partner_req_id
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3000/api/v1/partnership/${id}/venue`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.success && data.data && data.data._id) {
                    venueId = data.data._id;
                } else {
                    alert('Venue tidak ditemukan');
                    return;
                }
            } catch (err) {
                alert('Gagal mengambil venue');
                return;
            }
        }
        // Toggle between 'active' and 'banned' for venue
        const newStatus = owner.status === 'Active' ? 'banned' : 'active';
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/v1/partnership/venue/${venueId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setvenueOwner(prev => prev.map(user =>
                    user.id === id ? { ...user, status: newStatus === 'active' ? 'Active' : 'Banned', venueId } : user
                ));
            } else {
                alert(data.message || 'Gagal update status venue');
            }
        } catch (err) {
            alert('Gagal update status venue');
        }
    };

    const filteredVenueOwner = venueOwner.filter(owner =>
        (owner.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.venueName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.status || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100 font-sans relative">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-lg text-gray-600">Loading venue owners...</p>
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
        <div className="flex min-h-screen bg-gray-100 font-sans relative">
            {isSidebarOpen && (
                <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <CustomSidebarSuperAdmin
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={setActiveMenuItem}
            />

            <div className={`
                flex-1 transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
            `}>
                <div className="p-6">
                    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
                    <Button
                        variant="ghost"
                        className="p-2 h-auto hover:bg-gray-100"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
        
                    <div className="relative flex items-center w-full max-w-md mx-4">
                        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                        <Input
                        type="text"
                        placeholder="Search venues..."
                        className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
        
                    <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100">
                        <Bell className="h-6 w-6" />
                    </Button>
                    </header>
        
                    <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Venue Owner List</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 text-center">
                            <th className="py-3 px-4 font-semibold text-gray-700">ID</th>
                            <th className="py-3 px-4 font-semibold text-gray-700">Owner Name</th>
                            <th className="py-3 px-4 font-semibold text-gray-700">Venue Name</th>
                            <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVenueOwner.map((owner, index) => (
                            <tr
                                key={owner.id}
                                className={`border-b text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                                <td className="py-4 px-4 font-medium text-gray-900">{owner.id}</td>
                                <td className="py-4 px-4 text-gray-700">{owner.customer}</td>
                                <td className="py-4 px-4 text-gray-700">{owner.venueName}</td>
                                <td className={`py-4 px-4 font-semibold text-white`}>
                                <Button onClick={() => toggleStatus(owner.id)} className={`${owner.status === 'Active' ? 'bg-green-400 hover:bg-green-500':'bg-red-500 hover:bg-red-700'}`}>{owner.status}</Button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </Card>
                </div>
            </div> 
      </div>
    );
};

export default DashboardListOwnerVenue