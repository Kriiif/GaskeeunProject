import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Adjust path based on your shadcn setup
import { Input } from '@/components/ui/input';   // Adjust path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Adjust path
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Adjust path

const SewaLapanganDashboard = () => {
  const [selectedSport, setSelectedSport] = useState('Badminton');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [sportType, setSportType] = useState('');
  const [sortBy, setSortBy] = useState('Harga Tertinggi');

const venues = [
    {
        name: 'Jonhar Arena',
        rating: 5.0,
        location: 'Kota Jakarta Pusat', // Menyesuaikan agar lebih singkat seperti contoh
        price: { amount: 'Rp 50.000', per: '/ Sesi' }, // Mengubah menjadi objek untuk format harga
        sports: ['Futsal', 'Badminton'], // Menambahkan jenis olahraga
        image: '../public/venue/jorhar.png' // Placeholder image
    },
    {
        name: 'Vlocity Arena',
        rating: 5.0,
        location: 'Kota Jakarta Barat',
        price: { amount: 'Rp 50.000', per: '/ Sesi' },
        sports: ['Basket', 'Tenis'],
        image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Venue+Image'
    },
    {
        name: 'GOR Kurnia',
        rating: 5.0,
        location: 'Kota Jakarta Timur',
        price: { amount: 'Rp 50.000', per: '/ Sesi' },
        sports: ['Badminton'],
        image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Venue+Image'
    },
    {
        name: 'Johar Arena',
        rating: 5.0,
        location: 'Kota Jakarta Pusat',
        price: { amount: 'Rp 50.000', per: '/ Sesi' },
        sports: ['Futsal'],
        image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Venue+Image'
    },
];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-5 px-6 flex justify-between items-center fixed w-full top-0 z-50"> {/* Menaikkan padding vertikal menjadi py-5 */}
        <div className="flex items-center"> {/* Hapus space-x dan h-12 dari div pembungkus */}
          <img src="../public/logos/mukaijo.png" className="h-14 w-30 ml-20" /> {/* Terapkan tinggi langsung ke img, h-16 (64px) cocok untuk logo, dan mr-4 untuk spasi */}
        </div>
        <div className="flex flex-grow justify-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-green-600 font-medium text-center">Sewa Lapangan</a>
          <a href="#" className="text-gray-700 hover:text-green-600 font-medium text-center">Partnership</a>
        </div>
        <div className="flex items-center space-x-4 mr-20">
          <Button variant="ghost" className="font-medium">Masuk</Button>
          <Button className="bg-green-600 hover:bg-green-700 font-medium">Daftar</Button> {/* Pastikan warna tombol Daftar sesuai keinginan Anda */}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 pt-[100px]"> {/* Sesuaikan padding-top agar konten tidak tertutup header yang lebih tinggi */}
        {/* Banner Section */}
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden mb-8 mt-4"> {/* Menambahkan margin-top */}
          <img
            src="../public/carausel/badminton.jpg" // Placeholder for badminton court image
            alt="Badminton Court"
            className="w-full h-84 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-3xl font-bold">Badminton</h2>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-wrap gap-4 items-center justify-between">
          <Input
            placeholder="Cari Nama Venue"
            className="flex-1 min-w-[200px]"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />

          <Input
            placeholder="Pilih kota"
            className="flex-1 min-w-[200px]"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Select onValueChange={setSportType} value={sportType}>
            <SelectTrigger className="flex-1 min-w-[200px]">
              <SelectValue placeholder="Pilih Cabang Olahraga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Badminton">Badminton</SelectItem>
              <SelectItem value="Futsal">Futsal</SelectItem>
              <SelectItem value="Basket">Basket</SelectItem>
              {/* Add more sports as needed */}
            </SelectContent>
          </Select>

          <Button className="bg-green-600 hover:bg-green-700 px-6 py-3 font-medium">
            Cari Venue
          </Button>
        </div>

        {/* Venue List Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-700 text-lg">Menemukan <span className="font-bold">212</span> Venue Tersedia</p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Urutkan Berdasarkan:</span>
            <Select onValueChange={setSortBy} value={sortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Harga Tertinggi">Harga Tertinggi</SelectItem>
                <SelectItem value="Harga Terendah">Harga Terendah</SelectItem>
                <SelectItem value="Rating Tertinggi">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Venue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue, index) => (
            <Card key={index} className="overflow-hidden pt-0 mb-0">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
               <CardHeader className="px-4 pb-0"> {/* Mengurangi padding bawah */}
                {/* Label "Venue" */}
                <CardDescription className="text-sm text-gray-500 mb-1">Venue</CardDescription>
                {/* Nama Venue */}
                <CardTitle className="text-xl font-semibold text-gray-800 leading-tight">{venue.name}</CardTitle> {/* Ukuran judul lebih besar */}
                {/* Rating dan Lokasi */}
                <CardDescription className="flex items-center text-gray-600 text-sm mt-1">
                  <span className="text-yellow-500 mr-1">⭐</span> {/* Warna bintang kuning */}
                  <span className="font-medium text-gray-700">{venue.rating}</span> {/* Warna teks rating */}
                  <span className="mx-1">•</span> {/* Pemisah */}
                  <span>{venue.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4"> {/* Mengurangi padding atas */}
                {/* Jenis Olahraga */}
                <div className="flex items-center text-gray-700 text-sm space-x-3">
                  {venue.sports.map((sport, sIdx) => (
                    <span key={sIdx} className="flex">
                      {sport === 'Futsal' && <span>⚽</span>}
                      {sport === 'Badminton' && <span>🏸</span>}
                      {sport === 'Basket' && <span>🏀</span>}
                      {sport === 'Tenis' && <span>🎾</span>}
                      {sport}
                    </span>
                  ))}
                </div>
              </CardContent>
               <CardFooter className="p-4 pt-0"> {/* Mengurangi padding atas */}
                {/* Harga */}
                <div className="flex items-baseline text-gray-800">
                  <span className="text-sm mr-1">Mulai</span>
                  <span className="font-bold text-xl">{venue.price.amount}</span> {/* Harga utama lebih besar */}
                  <span className="text-sm ml-1">{venue.price.per}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SewaLapanganDashboard;