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
import axios from 'axios';

const DashboardKelolaVenue = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Kelola Venue');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [venueDetail, setVenueDetail] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch venues from backend
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/v1/venues/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const formattedData = response.data.data.map(venue => ({
          id: venue._id,
          venueName: venue.partner_req_id?.namaVenue || 'Unknown',
          ownerName: venue.partner_req_id?.namaPemilik || 'Unknown',
          location: venue.partner_req_id?.lokasiVenue || 'Unknown',
          status: venue.status === 'active' ? 'Active' : 'Banned',
          description: venue.description,
          createdAt: new Date(venue.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          email: venue.partner_req_id?.email || '',
          phone: venue.partner_req_id?.nomorTelepon || '',
          imageUrl: venue.partner_req_id?.fotoVenue ? `/uploads/${venue.partner_req_id.fotoVenue}` : '/venue/default.jpg',
          rawStatus: venue.status,
          partnerReqId: venue.partner_req_id?._id
        }));
        setVenues(formattedData);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const updateVenueStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const statusMap = {
        'Active': 'active',
        'Banned': 'banned'
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/venues/${id}/status`,
        { status: statusMap[newStatus] },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setVenues(prev =>
          prev.map(venue =>
            venue.id === id ? { ...venue, status: newStatus, rawStatus: statusMap[newStatus] } : venue
          )
        );
        
        if (venueDetail && venueDetail.id === id) {
          setVenueDetail(prev => ({ ...prev, status: newStatus, rawStatus: statusMap[newStatus] }));
        }

        alert(`Venue status berhasil diupdate menjadi ${newStatus}!`);
        return true;
      }
    } catch (err) {
      console.error('Error updating venue status:', err);
      setError('Failed to update venue status');
      return false;
    }
  };

  const handleDetailClick = (venue) => {
    setVenueDetail(venue);
    setIsDetailDialogOpen(true);
  };

  const handleActivate = async () => {
    const success = await updateVenueStatus(venueDetail.id, 'Active');
    if (success) {
      setIsDetailDialogOpen(false);
    }
  };

  const handleBan = async () => {
    const success = await updateVenueStatus(venueDetail.id, 'Banned');
    if (success) {
      setIsDetailDialogOpen(false);
    }
  };

  // Filter venues based on search query
  const filteredVenues = venues.filter(venue =>
    venue.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 font-sans relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading venues...</p>
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
            <Button 
              onClick={fetchVenues}
              className="mt-4 bg-green-500 hover:bg-green-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Venue Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-center">
                    <th className="py-3 px-4 font-semibold text-gray-700">Venue ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Venue Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Owner</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVenues.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        {searchQuery ? 'No venues match your search' : 'No venues found'}
                      </td>
                    </tr>
                  ) : (
                    filteredVenues.map((venue, index) => (
                      <tr
                        key={venue.id}
                        className={`border-b text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">{venue.id.slice(-6)}</td>
                        <td className="py-4 px-4 text-gray-700">{venue.venueName}</td>
                        <td className="py-4 px-4 text-gray-700">{venue.ownerName}</td>
                        <td className="py-4 px-4 text-gray-700 max-w-32 truncate">{venue.location}</td>
                        <td className="py-4 px-4 text-gray-700">{venue.createdAt}</td>
                        <td className={`py-4 px-4 font-semibold text-white 
                          ${venue.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}
                        `}>
                          {venue.status}
                        </td>
                        <td className="py-4 px-4">
                          <Button className="bg-blue-500 hover:bg-blue-700" onClick={() => handleDetailClick(venue)}>
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Dialog Detail Venue */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Venue Management</DialogTitle>
            <DialogDescription>
              Manage venue status and view details
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Venue Name</label>
              <Input
                value={venueDetail?.venueName || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Owner</label>
              <Input
                value={venueDetail?.ownerName || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Email</label>
              <Input
                value={venueDetail?.email || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Phone</label>
              <Input
                value={venueDetail?.phone || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Location</label>
              <textarea
                value={venueDetail?.location || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed p-2 border rounded-md resize-none"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Description</label>
              <textarea
                value={venueDetail?.description || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed p-2 border rounded-md resize-none"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Created Date</label>
              <Input
                value={venueDetail?.createdAt || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Venue Image */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Venue Photo</label>
              <div className="col-span-3">
                {venueDetail?.imageUrl ? (
                  <img
                    src={`http://localhost:3000${venueDetail.imageUrl}`}
                    alt="Venue photo"
                    className="rounded-lg border w-full max-w-xs h-auto object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-sm">No photo available</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <label className="text-right font-medium">Status</label>
              <Input
                value={venueDetail?.status || ''}
                readOnly
                className={`col-span-3 font-semibold cursor-not-allowed ${
                  venueDetail?.status === 'Active'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              />
            </div>

            <div className="flex justify-end mt-6">
              {venueDetail?.status === 'Active' ? (
                <Button onClick={handleBan} className="bg-red-500 hover:bg-red-700">
                  Ban Venue
                </Button>
              ) : (
                <Button onClick={handleActivate} className="bg-green-500 hover:bg-green-700">
                  Activate Venue
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardKelolaVenue;
