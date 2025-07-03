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
import axios from 'axios';

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
        open_hour: '',
        close_hour: '',
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // State for Data being manipulated
    const [editingLapangan, setEditingLapangan] = useState(null);
    const [lapanganToDelete, setLapanganToDelete] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeSchedules, setActiveSchedules] = useState({});
    const [totalActiveSchedules, setTotalActiveSchedules] = useState(0);

    // Main data state
    const [lapangans, setLapangans] = useState([]);

    // Fetch lapangan dari database sesuai venue_id
    useEffect(() => {
        if (!myVenue || !myVenue._id) return;
        const fetchLapangans = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/v1/fields/venue/${myVenue._id}?source=owner_dashboard`);
                const data = await res.json();
                if (res.ok && Array.isArray(data.data)) {
                    setLapangans(data.data);
                } else {
                    setLapangans([]);
                }
            } catch (err) {
                setLapangans([]);
            }
        };
        fetchLapangans();
    }, [myVenue]);

    // Hitung jadwal aktif dari jumlah lapangan yang online saja
    useEffect(() => {
        if (!lapangans || lapangans.length === 0) {
            setTotalActiveSchedules(0);
            return;
        }
        const onlineFields = lapangans.filter(l => l.is_active);
        setTotalActiveSchedules(onlineFields.length);
    }, [lapangans]);

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
                console.error('Gagal fetch venue:', err);
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
            location: '',
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
            !addFormData.location ||
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
        formData.append('location', addFormData.location);
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
                // Fetch lapangan terbaru
                if (myVenue && myVenue._id) {
                    const res = await fetch(`http://localhost:3000/api/v1/fields/venue/${myVenue._id}?source=owner_dashboard`);
                    const data = await res.json();
                    if (res.ok && data.data) setLapangans(data.data);
                }
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
            location: lapangan.location,
            category: lapangan.category,
            desc: lapangan.desc,
            status: lapangan.status,
            image: lapangan.image,
            open_hour: lapangan.open_hour,
            close_hour: lapangan.close_hour,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imageUpload") {
            if (files && files[0]) {
                const file = files[0];
                setEditFormData(prev => ({ ...prev, image: file }));
            }
        } else {
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditFormData(prev => ({ ...prev, image: file }));
        }
    };

    const handleEditSelectChange = (name, value) => {
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        if (!editingLapangan || !editingLapangan._id) {
            alert('Lapangan yang akan diedit tidak valid.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Sesi anda telah berakhir, silakan login kembali.');
            return;
        }

        const formData = new FormData();

        // Loop through editFormData to find changed fields
        Object.keys(editFormData).forEach(key => {
            // Check if the field is the image file input
            if (key === 'image' && editFormData.image instanceof File) {
                formData.append('image', editFormData.image);
            } else if (editFormData[key] !== editingLapangan[key]) {
                // For other fields, append if the value has changed
                formData.append(key, editFormData[key]);
            }
        });

        // If no data is changed, just close the dialog
        if (Array.from(formData.keys()).length === 0) {
            setIsEditDialogOpen(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/v1/fields/${editingLapangan._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                // Update local state with the returned updated data
                setLapangans(prevLapangans =>
                    prevLapangans.map(lap =>
                        lap._id === editingLapangan._id ? result.data : lap
                    )
                );
                setIsEditDialogOpen(false);
                setEditingLapangan(null);
                alert('Lapangan berhasil diperbarui!');
            } else {
                alert(result.message || 'Gagal memperbarui lapangan');
            }
        } catch (error) {
            console.error('Error updating field:', error);
            alert('Terjadi kesalahan saat memperbarui lapangan.');
        }
    };

    // --- Delete Handlers ---
    const handleDeleteClick = (lapangan) => {
        setLapanganToDelete(lapangan);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!lapanganToDelete || !lapanganToDelete._id) return;
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Sesi anda telah berakhir, silakan login kembali.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/v1/fields/${lapanganToDelete._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setLapangans(prev => prev.filter(lap => lap._id !== lapanganToDelete._id));
                setIsDeleteDialogOpen(false);
                setLapanganToDelete(null);
                alert('Lapangan berhasil dihapus.');
            } else {
                const result = await response.json();
                alert(result.message || 'Gagal menghapus lapangan.');
            }
        } catch (error) {
            console.error('Error deleting field:', error);
            alert('Terjadi kesalahan saat menghapus lapangan.');
        }
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

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // Logika filter hanya berdasarkan nama lapangan
    const filteredLapangans = lapangans.filter(lapangan =>
        (lapangan.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                            <Card key={lapangan._id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start">
                                        <img src={lapangan.image_url ? `http://localhost:3000/${lapangan.image_url}` : '/venue/badmin1.jpg'} alt={lapangan.name} className="w-32 h-24 object-cover rounded-lg mr-4 flex-shrink-0 shadow-sm" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold text-gray-800">{lapangan.name}</h3>
                                                {/* Status button bisa diatur dari is_active */}
                                                <Button variant="outline" className={`text-sm px-3 py-1 h-auto font-medium ml-6 ${lapangan.is_active ? 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100' : 'text-red-700 border-red-300 bg-red-50 hover:bg-red-100'}`}>
                                                    {lapangan.is_active ? 'Online' : 'Offline'}
                                                </Button>
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm mb-1">
                                                <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                                                {/* Rating bisa diisi manual atau dari backend jika ada */}
                                                <span className="font-medium">-</span>
                                                <span className="mx-2">•</span>
                                                <span>{lapangan.location}</span>
                                                <span className="mx-2">•</span>
                                                <span>{lapangan.open_hour} - {lapangan.close_hour}</span>
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
                                {/* Hilangkan timeSlots mapping karena field dari DB tidak punya timeSlots default */}
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="location" className="text-right font-medium">Lokasi</label>
                            <Input id="location" name="location" value={addFormData.location} onChange={handleAddFormChange} className="col-span-3" />
                        </div>
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
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()}>Pilih Foto</Button>
                                <input id="imageUpload" name="imageUpload" type="file" accept="image/*" onChange={handleEditImageChange} ref={fileInputRef} style={{ display: 'none' }} />
                            </div>
                        </div>
                        {editFormData.image && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="col-span-1"></span>
                                <div className="col-span-3">
                                    <img 
                                        src={editFormData.image instanceof File ? URL.createObjectURL(editFormData.image) : (editFormData.image ? `http://localhost:3000/${editFormData.image}` : '')}
                                        alt="Preview" 
                                        className="w-24 h-24 object-cover rounded-md" 
                                    />
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="open_hour" className="text-right font-medium">Jam Buka</label>
                            <Input
                                id="open_hour"
                                name="open_hour"
                                type="time"
                                className="col-span-3"
                                value={editFormData.open_hour}
                                onChange={handleEditFormChange}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="close_hour" className="text-right font-medium">Jam Tutup</label>
                            <Input
                                id="close_hour"
                                name="close_hour"
                                type="time"
                                className="col-span-3"
                                value={editFormData.close_hour}
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