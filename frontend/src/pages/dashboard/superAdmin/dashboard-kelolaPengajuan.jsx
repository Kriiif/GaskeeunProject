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

const DashboardKelolaAjuan = () => {  const [activeMenuItem, setActiveMenuItem] = useState('Kelola Pengajuan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyDetail, setApplyDetail] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [recentApply, setRecentApply] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch partnership requests from backend
  useEffect(() => {
    fetchPartnershipRequests();
  }, []);

  const fetchPartnershipRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/v1/partnership', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const formattedData = response.data.data.map(request => ({
          id: request._id,
          customer: request.namaPemilik,
          venueName: request.namaVenue,
          dateApply: new Date(request.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          status: request.status === 'on hold' ? 'On Hold' : 
                 request.status === 'approved' ? 'Accepted' : 'Rejected',
          imageUrl: request.fotoVenue ? `/uploads/${request.fotoVenue}` : '/venue/default.jpg',
          email: request.email,
          nomorTelepon: request.nomorTelepon,
          lokasiVenue: request.lokasiVenue,
          npwp: request.npwp,
          nomorIndukBerusaha: request.nomorIndukBerusaha,
          fotoKTP: request.fotoKTP ? `/uploads/${request.fotoKTP}` : null,
          fotoSuratTanah: request.fotoSuratTanah ? `/uploads/${request.fotoSuratTanah}` : null,
          rawStatus: request.status
        }));
        setRecentApply(formattedData);
      }
    } catch (err) {
      console.error('Error fetching partnership requests:', err);
      setError('Failed to fetch partnership requests');
    } finally {
      setLoading(false);
    }
  };
  const updatePartnershipStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const statusMap = {
        'Accepted': 'approved',
        'Rejected': 'rejected',
        'On Hold': 'on hold'
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/partnership/${id}/status`,
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
        setRecentApply(prev =>
          prev.map(apply =>
            apply.id === id ? { ...apply, status: newStatus, rawStatus: statusMap[newStatus] } : apply
          )
        );
        
        if (applyDetail && applyDetail.id === id) {
          setApplyDetail(prev => ({ ...prev, status: newStatus, rawStatus: statusMap[newStatus] }));
        }

        // Show success message with venue creation info
        if (newStatus === 'Accepted') {
          alert('Partnership request disetujui dan venue berhasil dibuat!');
        } else {
          alert('Status partnership request berhasil diupdate');
        }
        
        return true;
      }
    } catch (err) {
      console.error('Error updating partnership status:', err);
      setError('Failed to update partnership status');
      return false;
    }
  };

  const handleDetailClick = (apply) => {
    setApplyDetail(apply);
    setIsDetailDialogOpen(true);
  };
  const handleAccept = async () => {
    const success = await updatePartnershipStatus(applyDetail.id, 'Accepted');
    if (success) {
      setIsDetailDialogOpen(false);
    }
  };

  const handleReject = async () => {
    const success = await updatePartnershipStatus(applyDetail.id, 'Rejected');
    if (success) {
      setIsDetailDialogOpen(false);
    }
  };

  // Filter applications based on search query
  const filteredApplications = recentApply.filter(apply =>
    apply.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apply.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apply.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 font-sans relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading partnership requests...</p>
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
              onClick={fetchPartnershipRequests}
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
            </Button>            <div className="relative flex items-center w-full max-w-md mx-4">
              <Search className="absolute left-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search partnership requests..."
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </Button>
          </header>          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Partnership Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-center">
                    <th className="py-3 px-4 font-semibold text-gray-700">Request ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Owner Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Venue Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Date Applied</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">
                        {searchQuery ? 'No partnership requests match your search' : 'No partnership requests found'}
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((apply, index) => (
                      <tr
                        key={apply.id}
                        className={`border-b text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">{apply.id.slice(-6)}</td>
                        <td className="py-4 px-4 text-gray-700">{apply.customer}</td>
                        <td className="py-4 px-4 text-gray-700">{apply.venueName}</td>
                        <td className="py-4 px-4 text-gray-700">{apply.dateApply}</td>
                        <td className={`py-4 px-4 font-semibold text-white 
                          ${apply.status === 'Accepted' ? 'bg-green-500' :
                            apply.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-400'}
                        `}>
                          {apply.status}
                        </td>
                        <td className="py-4 px-4">
                          <Button className="bg-orange-500" onClick={() => handleDetailClick(apply)}>
                            Detail
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
      </div>      {/* Dialog Detail Partnership Request */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Partnership Request</DialogTitle>
            <DialogDescription>
              Berikut ini adalah detail pengajuan partnership venue
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Owner Name</label>
              <Input
                value={applyDetail?.customer || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Venue Name</label>
              <Input
                value={applyDetail?.venueName || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Email</label>
              <Input
                value={applyDetail?.email || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Phone</label>
              <Input
                value={applyDetail?.nomorTelepon || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Location</label>
              <textarea
                value={applyDetail?.lokasiVenue || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed p-2 border rounded-md resize-none"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">NPWP</label>
              <Input
                value={applyDetail?.npwp || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">NIB</label>
              <Input
                value={applyDetail?.nomorIndukBerusaha || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Date Applied</label>
              <Input
                value={applyDetail?.dateApply || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Document Images */}
            <div className="grid gap-4 mt-4">
              <h4 className="font-semibold text-lg">Documents</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <label className="block font-medium mb-2">Venue Photo</label>
                  {applyDetail?.imageUrl ? (
                    <img
                      src={`http://localhost:3000${applyDetail.imageUrl}`}
                      alt="Venue photo"
                      className="rounded-lg border w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm h-32 flex items-center justify-center border rounded-lg">
                      No photo available
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <label className="block font-medium mb-2">KTP</label>
                  {applyDetail?.fotoKTP ? (
                    <img
                      src={`http://localhost:3000${applyDetail.fotoKTP}`}
                      alt="KTP"
                      className="rounded-lg border w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm h-32 flex items-center justify-center border rounded-lg">
                      No KTP available
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <label className="block font-medium mb-2">Land Certificate</label>
                  {applyDetail?.fotoSuratTanah ? (
                    <img
                      src={`http://localhost:3000${applyDetail.fotoSuratTanah}`}
                      alt="Land certificate"
                      className="rounded-lg border w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm h-32 flex items-center justify-center border rounded-lg">
                      No certificate available
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-4">
              <label className="text-right font-medium">Status</label>
              <Input
                value={applyDetail?.status || ''}
                readOnly
                className={`col-span-3 font-semibold cursor-not-allowed ${
                  applyDetail?.status === 'Accepted'
                    ? 'bg-green-500 text-white'
                    : applyDetail?.status === 'Rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-300 text-black'
                }`}
              />
            </div>

            {applyDetail?.status === 'On Hold' && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleReject} className="mr-2 bg-red-500 hover:bg-red-700">
                  Reject
                </Button>
                <Button onClick={handleAccept} className="bg-green-500 hover:bg-green-700">
                  Accept
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardKelolaAjuan;