import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, List, ShoppingCart, User, Menu, Bell, Star, CalendarIcon, Edit, X, Search, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from 'react-router-dom';
import CustomSidebar from '@/components/sidebar';
import useAuth from '@/hooks/useAuth';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const KelolaLapanganDashboard = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('Kelola Lapangan');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { token } = useAuth();

    // State untuk venue milik user
    const [myVenue, setMyVenue] = useState(null);

    // State for Dialogs
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        name: '',
        category: '',
        price: '',
        desc: '',
        location: '',
        open_hour: '',
        close_hour: '',
        image: null,
    });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        location: '',
        category: '',
        desc: '',
        status: '',
        image: '',
        openHour: '',
        closeHour: '',
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // State for Data being manipulated
    const [editingLapangan, setEditingLapangan] = useState(null);
    const [lapanganToDelete, setLapanganToDelete] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeSchedules, setActiveSchedules] = useState({});

    // Main data state
    const [lapangans, setLapangans] = useState(() => {
        const initialLapangans = [
            {
                id: 'lapangan1',
                name: 'Lapangan 1',
                image: '/venue/badmin1.jpg',
                category: 'Badminton',
                desc: 'Lapangan badminton indoor dengan standar nasional.',
                rating: 4.5,
                location: 'Jl. Kemuning',
                openHour: '08:00',
                closeHour: '22:00',
                status: 'Online',
                timeSlots: [
                    { time: '06.00 - 08.30', status: 'available' },
                    { time: '09.00 - 11.30', status: 'available' },
                    { time: '12.00 - 14.30', status: 'booked' },
                    { time: '15.00 - 17.30', status: 'available' },
                    { time: '18.00 - 20.30', status: 'available' },
                ],
            },
            {
                id: 'lapangan2',
                name: 'Lapangan 2',
                image: '/venue/badmin1.jpg',
                category: 'Badminton',
                desc: 'Lapangan badminton outdoor dengan pemandangan taman.',
                rating: 4.2,
                location: 'Jl. Cempaka',
                openHour: '09:00',
                closeHour: '21:00',
                status: 'Offline',
                timeSlots: [
                    { time: '08.00 - 10.00', status: 'available' },
                    { time: '10.00 - 11.00', status: 'booked' },
                    { time: '13.00 - 15.00', status: 'available' },
                    { time: '15.00 - 17.00', status: 'booked' },
                ],
            },
        ];

        const initialActiveSchedules = {};
        initialLapangans.forEach(lapangan => {
            initialActiveSchedules[lapangan.id] = {};
            lapangan.timeSlots.forEach(slot => {
                if (slot.status === 'available') {
                    initialActiveSchedules[lapangan.id][slot.time] = true;
                }
            });
        });
        setActiveSchedules(initialActiveSchedules);
        return initialLapangans;
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const formatDateFull = (date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Ambil venue milik user saat komponen mount
    useEffect(() => {
        const fetchMyVenue = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                // Coba fetch venue dari endpoint partnership request user
                const resPartner = await fetch('http://localhost:3000/api/v1/partnership', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const partnerData = await resPartner.json();
                if (resPartner.ok && partnerData.data && partnerData.data.length > 0) {
                    // Ambil partner_req_id dari request yang sudah di-approve
                    const approvedReq = partnerData.data.find(req => req.status === 'approved');
                    if (approvedReq) {
                        // Fetch venue by partner_req_id
                        const resVenue = await fetch(`http://localhost:3000/api/v1/partnership/${approvedReq._id}/venue`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const venueData = await resVenue.json();
                        if (resVenue.ok && venueData.data) {
                            setMyVenue(venueData.data);
                            return;
                        }
                    }
                }
                // Fallback: fetch /venues/my jika ada endpoint tersebut
                const res = await fetch('http://localhost:3000/api/v1/venues/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.venue) setMyVenue(data.venue);
            } catch (err) {
                // console.error('Gagal fetch venue:', err);
            }
        };
        fetchMyVenue();
    }, []);

    // --- Add Handlers ---
    const handleAddClick = () => {
        setAddFormData({
            name: '',
            category: '',
            price: '',
            desc: '',
            open_hour: '',
            close_hour: '',
            image: null,
        });
        setIsAddDialogOpen(true);
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData({ ...addFormData, [name]: value });
    };

    const handleAddImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAddFormData({ ...addFormData, image: file });
        }
    };

    const handleAddLapanganSubmit = async () => {
        // Validasi sederhana
        if (
            !addFormData.name ||
            !addFormData.category ||
            !addFormData.price ||
            !addFormData.desc ||
            !addFormData.open_hour ||
            !addFormData.close_hour ||
            !addFormData.image
        ) {
            alert('Semua field wajib diisi dan gambar wajib dipilih!');
            return;
        }

        if (!myVenue || !myVenue._id) {
            alert('Venue anda tidak ditemukan atau belum terdaftar. Silakan hubungi admin.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Anda harus login terlebih dahulu!');
            return;
        }

        const formData = new FormData();
        formData.append('name', addFormData.name);
        formData.append('category', addFormData.category);
        formData.append('price', addFormData.price);
        formData.append('desc', addFormData.desc);
        // formData.append('location', addFormData.location);
        formData.append('open_hour', addFormData.open_hour);
        formData.append('close_hour', addFormData.close_hour);
        formData.append('image', addFormData.image); // field name HARUS 'image'
        formData.append('venue_id', myVenue._id);

        try {
            const response = await fetch('http://localhost:3000/api/v1/fields', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.status === 201) {
                // Sukses, reset form dan refresh data lapangan
                setAddFormData({
                    name: '',
                    category: '',
                    price: '',
                    desc: '',
                    location: '',
                    open_hour: '',
                    close_hour: '',
                    image: null,
                });
                setIsAddDialogOpen(false);
                // TODO: Panggil fungsi fetchLapangans() jika ada, agar data terbaru muncul
                // fetchLapangans();
                alert('Lapangan berhasil ditambahkan!');
            } else {
                alert(result.message || 'Gagal menambah lapangan');
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan/server');
            console.error(error);
        }
    };


    const handleEditClick = (lapangan) => {
        setEditingLapangan(lapangan);
        setEditFormData({
            name: lapangan.name,
            // location: lapangan.location,
            category: lapangan.category,
            desc: lapangan.desc,
            status: lapangan.status,
            image: lapangan.image,
            openHour: lapangan.openHour,
            closeHour: lapangan.closeHour,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setEditFormData(prev => ({ ...prev, image: imageUrl }));
        }
    };

    const handleEditSelectChange = (name, value) => {
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = () => {
        setLapangans(prevLapangans =>
            prevLapangans.map(lap =>
                lap.id === editingLapangan.id ? { ...lap, ...editFormData } : lap
            )
        );
        setIsEditDialogOpen(false);
        setEditingLapangan(null);
        if (editFormData.image.startsWith('blob:')) {
            URL.revokeObjectURL(editFormData.image);
        }
    };

    // --- Delete Handlers ---
    const handleDeleteClick = (lapangan) => {
        setLapanganToDelete(lapangan);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setLapangans(prev => prev.filter(lap => lap.id !== lapanganToDelete.id));
        const newActiveSchedules = { ...activeSchedules };
        delete newActiveSchedules[lapanganToDelete.id];
        setActiveSchedules(newActiveSchedules);

        setIsDeleteDialogOpen(false);
        setLapanganToDelete(null);
    };

    const handleCheckboxChange = (lapanganId, slotTime, checked) => {
        setActiveSchedules(prev => ({
            ...prev,
            [lapanganId]: {
                ...prev[lapanganId],
                [slotTime]: checked,
            },
        }));
    };

    const totalActiveSchedules = Object.values(activeSchedules).reduce((total, lapanganSlots) => {
        return total + Object.values(lapanganSlots).filter(isActive => isActive).length;
    }, 0);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // Logika filter hanya berdasarkan nama lapangan
    const filteredLapangans = lapangans.filter(lapangan =>
        lapangan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen font-sans relative">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
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
                                placeholder="Cari berdasarkan nama venue..."
                                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" className="p-2 h-auto hover:bg-gray-100">
                            <Bell className="h-6 w-6" />
                        </Button>
                    </header>

                    <div className="relative bg-green-700 rounded-lg shadow-md overflow-hidden mb-6 p-8 text-white text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-600 opacity-90"></div>
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full opacity-30"></div>
                            <div className="absolute top-1/2 left-1/3 w-8 h-8 border-2 border-white rounded-full opacity-30"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Selamat Datang</h2>
                            <h3 className="text-2xl font-semibold mb-2">di Dashboard Kelola Venue</h3>
                            <p className="text-green-100">Kelola semua Lapangan anda dengan mudah dan efisien</p>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-4 mb-6">
                        <Button className="bg-green-600 font-bold" onClick={() => handleAddClick()}>
                            Tambah Lapangan
                        </Button>
                        <div className="bg-green-700 text-white font-bold px-4 py-2 rounded-full text-sm shadow-md">
                            <span>{totalActiveSchedules} Jadwal Aktif</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* IMPLEMENTASI: Tampilkan pesan jika tidak ada hasil pencarian */}
                        {filteredLapangans.length === 0 && (
                            <Card className="text-center py-12">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada lapangan ditemukan</h3>
                                <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian Anda.</p>
                            </Card>
                        )}

                        {filteredLapangans.map((lapangan) => (
                            <Card key={lapangan.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start">
                                        <img src={lapangan.image} alt={lapangan.name} className="w-32 h-24 object-cover rounded-lg mr-4 flex-shrink-0 shadow-sm" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold text-gray-800">{lapangan.name}</h3>
                                                <Button variant="outline" className={`text-sm px-3 py-1 h-auto font-medium ml-6 ${lapangan.status === 'Online' ? 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100' : 'text-red-700 border-red-300 bg-red-50 hover:bg-red-100'}`}>
                                                    {lapangan.status}
                                                </Button>
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm mb-1">
                                                <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                                                <span className="font-medium">{lapangan.rating}</span>
                                                <span className="mx-2">•</span>
                                                <span>{lapangan.location}</span>
                                                <span className="mx-2">•</span>
                                                <span>{lapangan.openHour} - {lapangan.closeHour}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium">{lapangan.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action Buttons: Edit and Delete */}
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(lapangan)} className="hover:bg-gray-100">
                                            <Edit className="h-5 w-5 text-gray-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(lapangan)} className="hover:bg-red-100">
                                            <Trash className="h-5 w-5 text-red-600" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-700">Tanggal:</span>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? formatDateFull(selectedDate) : <span>Pilih Tanggal</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus disabled={(date) => date < new Date()} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 flex-shrink-0">
                                        Jadwal Aktif: <span className="font-bold text-green-600">{Object.values(activeSchedules[lapangan.id] || {}).filter(isActive => isActive).length}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-200">
                                    {lapangan.timeSlots.map((slot, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                            <label htmlFor={`slot-${lapangan.id}-${idx}`} className="flex-1 cursor-pointer">
                                                <span className="font-semibold text-sm block text-gray-800">{slot.time}</span>
                                                <span className={`text-xs font-medium ${slot.status === 'available' ? 'text-green-600' : slot.status === 'booked' ? 'text-orange-600' : 'text-gray-500'}`}>
                                                    {slot.status === 'booked' ? 'Booked' : slot.status === 'filled' ? 'Penuh' : 'Tersedia'}
                                                </span>
                                            </label>
                                            <Checkbox id={`slot-${lapangan.id}-${idx}`} checked={activeSchedules[lapangan.id]?.[slot.time] || false} onCheckedChange={(checked) => handleCheckboxChange(lapangan.id, slot.time, checked)} disabled={slot.status !== 'available'} />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- DIALOGS --- */}
            
            {/* Dialog Form Add Lapangan */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Lapangan</DialogTitle>
                        <DialogDescription>Tambahkan lapangan yang anda miliki melalui form ini. <br />Klik Tambah setelah selesai mengisi seluruh data lapangan.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right font-medium">Nama</label>
                            <Input id="name" name="name" value={addFormData.name} onChange={handleAddFormChange} className="col-span-3" />
                        </div>
                        {/* <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="location" className="text-right font-medium">Lokasi</label>
                            <Input id="location" name="location" value={addFormData.location} onChange={handleAddFormChange} className="col-span-3" />
                        </div> */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="category" className="text-right font-medium">Kategori</label>
                            <Input id="category" name="category" value={addFormData.category} onChange={handleAddFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="price" className="text-right font-medium">Harga</label>
                            <Input id="price" name="price" type="number" value={addFormData.price} onChange={handleAddFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="desc" className="text-right font-medium">Deskripsi</label>
                            <Input id="desc" name="desc" value={addFormData.desc} onChange={handleAddFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="open_hour" className="text-right font-medium">Jam Buka</label>
                            <Input id="open_hour" name="open_hour" type="time" value={addFormData.open_hour} onChange={handleAddFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="close_hour" className="text-right font-medium">Jam Tutup</label>
                            <Input id="close_hour" name="close_hour" type="time" value={addFormData.close_hour} onChange={handleAddFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="imageUpload" className="text-right font-medium">Gambar</label>
                            <div className="col-span-3">
                                <Button type="button" variant="outline" onClick={handleButtonClick}>Pilih Foto</Button>
                                <input id="imageUpload" name="imageUpload" type="file" accept="image/*" onChange={handleAddImageChange} ref={fileInputRef} style={{ display: 'none' }} />
                            </div>
                        </div>
                        {addFormData.image && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1"></span>
                                <div className="col-span-3">
                                    <img src={URL.createObjectURL(addFormData.image)} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleAddLapanganSubmit}>Tambah</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Form Edit Venue */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Detail Venue</DialogTitle>
                        <DialogDescription>Lakukan perubahan pada detail venue di sini. Klik simpan saat selesai.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right font-medium">Nama</label>
                            <Input id="name" name="name" value={editFormData.name} onChange={handleEditFormChange} className="col-span-3" />
                        </div>
                        {/* --- START: Added Form Fields --- */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="category" className="text-right font-medium">Kategori</label>
                            <Input id="category" name="category" value={editFormData.category} onChange={handleEditFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="desc" className="text-right font-medium">Deskripsi</label>
                            <Input id="desc" name="desc" value={editFormData.desc} onChange={handleEditFormChange} className="col-span-3" />
                        </div>
                        {/* --- END: Added Form Fields --- */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="imageUpload" className="text-right font-medium">Gambar</label>
                            <div className="col-span-3">
                                <Button type="button" variant="outline" onClick={handleButtonClick}>Pilih Foto</Button>
                                <input id="imageUpload" name="imageUpload" type="file" accept="image/*" onChange={handleEditImageChange} ref={fileInputRef} style={{ display: 'none' }} />
                            </div>
                        </div>
                        {editFormData.image && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1"></span>
                                <div className="col-span-3">
                                    <img src={editFormData.image} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="openHourEdit" className="text-right font-medium">Jam Buka</label>
                            <Input
                                id="openHourEdit"
                                name="openHour"
                                type="time"
                                className="col-span-3"
                                value={editFormData.openHour}
                                onChange={handleEditFormChange}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="closeHourEdit" className="text-right font-medium">Jam Tutup</label>
                            <Input
                                id="closeHourEdit"
                                name="closeHour"
                                type="time"
                                className="col-span-3"
                                value={editFormData.closeHour}
                                onChange={handleEditFormChange}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="status" className="text-right font-medium">Status</label>
                            <Select name="status" value={editFormData.status} onValueChange={(value) => handleEditSelectChange('status', value)}>
                                <SelectTrigger className="col-span-3"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Online">Online</SelectItem>
                                    <SelectItem value="Offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSaveEdit}>Simpan Perubahan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus lapangan
                            <span className="font-bold"> {lapanganToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="button" variant="destructive" onClick={confirmDelete}>
                                Hapus
                            </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default KelolaLapanganDashboard;