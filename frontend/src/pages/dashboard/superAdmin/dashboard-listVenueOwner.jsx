import React, { useState } from 'react';
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

    // untuk perubahan status
    const [status, setStatus] = useState('Active');

    const toggleStatus = (id) => {
    const updatedUsers = venueOwner.map(user =>
      user.id === id
        ? { ...user, status: user.status === 'Active' ? 'Banned' : 'Active' }
        : user
    );
    setvenueOwner(updatedUsers);
  };

    const [venueOwner, setvenueOwner] = useState([
        {
          id: '1',
          customer: 'Pham Hanni',
          venueName: 'Vlocity Arena',
          status: 'Active',
          imageUrl: '/venue/badmin1.jpg'
        },
        {
          id: '2',
          customer: 'Heru Budi',
          venueName: 'ClinciG Arena',
          status: 'Banned',
          imageUrl: '/venue/futsal1.jpg'
        },
        {
          id: '3',
          customer: 'Jaenap',
          venueName: 'Vlocity Arena',
          status: 'Banned',
          imageUrl: '/venue/badmin1.jpg'
        },
        {
          id: '4',
          customer: 'Cincai',
          venueName: 'ClinciG Arena',
          status: 'Active',
          imageUrl: '/venue/futsal1.jpg'
        },
        {
          id: '5',
          customer: 'Jeki Cen',
          venueName: 'Vlocity Arena',
          status: 'Active',
          imageUrl: '/venue/badmin1.jpg'
        },
        {
          id: '6',
          customer: 'Bas G',
          venueName: 'ClinciG Arena',
          status: 'Banned',
          imageUrl: '/venue/futsal1.jpg'
        },
    ]);

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
                            {venueOwner.map((owner, index) => (
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