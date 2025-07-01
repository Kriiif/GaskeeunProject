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

const DashboardKelolaAjuan = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Kelola Pengajuan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyDetail, setApplyDetail] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [recentApply, setRecentApply] = useState([
    {
      id: '1',
      customer: 'Pham Hanni',
      venueName: 'Vlocity Arena',
      dateApply: '26 June 2025',
      status: 'On Hold',
      imageUrl: '/venue/badmin1.jpg'
    },
    {
      id: '2',
      customer: 'Heru Budi',
      venueName: 'ClinciG Arena',
      dateApply: '26 June 2025',
      status: 'On Hold',
      imageUrl: '/venue/futsal1.jpg'
    },
  ]);

  const handleDetailClick = (apply) => {
    setApplyDetail(apply);
    setIsDetailDialogOpen(true);
  };

  const handleAccept = () => {
    setRecentApply(prev =>
      prev.map(apply =>
        apply.id === applyDetail.id ? { ...apply, status: 'Accepted' } : apply
      )
    );
    setApplyDetail(prev => ({ ...prev, status: 'Accepted' }));
    setIsDetailDialogOpen(false);
  };

  const handleReject = () => {
    setRecentApply(prev =>
      prev.map(apply =>
        apply.id === applyDetail.id ? { ...apply, status: 'Rejected' } : apply
      )
    );
    setApplyDetail(prev => ({ ...prev, status: 'Rejected' }));
    setIsDetailDialogOpen(false);
  };

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
                    <th className="py-3 px-4 font-semibold text-gray-700">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApply.map((apply, index) => (
                    <tr
                      key={apply.id}
                      className={`border-b text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">{apply.id}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Nama</label>
              <Input
                value={applyDetail?.customer || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Lokasi</label>
              <Input
                value={applyDetail?.venueName || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Tanggal</label>
              <Input
                value={applyDetail?.dateApply || ''}
                readOnly
                className="col-span-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">Foto Venue</label>
              <div className="col-span-3">
                {applyDetail?.imageUrl ? (
                  <img
                    src={applyDetail.imageUrl}
                    alt="Foto venue"
                    className="rounded-lg border w-full max-w-xs h-auto object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-sm">Tidak ada foto tersedia</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
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
              <div className="flex justify-end">
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