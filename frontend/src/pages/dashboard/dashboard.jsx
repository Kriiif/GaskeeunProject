import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { Header } from '@/components/header';
import { HeaderUser } from '@/components/header-user';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter
} from '@/components/ui/sheet';
import {
  Carousel, CarouselContent, CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const carouselImages = [
  { src: '/carausel/badmintoncourt.jpg', alt: 'Badminton Court', title: 'Badminton' },
  { src: '/carausel/1.jpg', alt: 'Futsal Court', title: 'Futsal' },
  { src: '/carausel/basketcourt.jpg', alt: 'Basketball Court', title: 'Basket' },
  { src: '/carausel/tenniscourt.jpg', alt: 'Tennis Court', title: 'Tenis' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [allVenues, setAllVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [sportType, setSportType] = useState('');
  const [sortBy, setSortBy] = useState('Harga Tertinggi');
  const [cartItems, setCartItems] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/fields');
        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }
        const data = await response.json();
        setAllVenues(data);
        setFilteredVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);

  const removeFromCart = (slotId, fieldId, date) => {
    setCartItems(cartItems.filter(item => !(item.slotId === slotId && item.fieldId === fieldId && item.date === date)));
  };

  // Fungsi untuk menerapkan filter berdasarkan nama, kota, dan jenis olahraga
  const applyFilters = () => {
    let tempVenues = [...allVenues];

    if (venueName) {
      tempVenues = tempVenues.filter(venue =>
        venue.name.toLowerCase().includes(venueName.toLowerCase())
      );
    }

    if (city) {
      tempVenues = tempVenues.filter(venue =>
        venue.location.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Perubahan di sini: Jika sportType adalah "All", jangan filter berdasarkan olahraga
    if (sportType && sportType !== 'All') {
      tempVenues = tempVenues.filter(venue =>
        venue.category.includes(sportType)
      );
    }

    // Terapkan pengurutan ke hasil filter
    tempVenues.sort((a, b) => {
      if (sortBy === 'Harga Tertinggi') {
        return b.price - a.price;
      } else if (sortBy === 'Harga Terendah') {
        return a.price - b.price;
      }
      // Rating sort removed
      return 0;
    });

    setFilteredVenues(tempVenues);
  };

  // Menerapkan filter setiap kali venueName, city, atau sportType berubah
  useEffect(() => {
    applyFilters();
  }, [venueName, city, sportType, sortBy, allVenues]);


  return (
    <div className="min-h-screen font-sans">
      {user ? (
        <HeaderUser cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
      ) : (
        <Header cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
      )}
      <div className="container mx-auto p-6 pt-[100px]">
        <div className="relative mb-8 mt-4">
          <Carousel
            className="w-full"
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {carouselImages.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                    <img src={item.src} alt={item.alt} className="w-full h-84 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-6 text-white">
                      <h2 className="text-3xl font-bold">{item.title}</h2>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

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
              <SelectItem value="All">All</SelectItem> {/* Opsi "All" ditambahkan di sini */}
              <SelectItem value="Badminton">Badminton</SelectItem>
              <SelectItem value="Futsal">Futsal</SelectItem>
              <SelectItem value="Basket">Basket</SelectItem>
              <SelectItem value="Tenis">Tenis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Venue List Header */}
        <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700 text-lg">Menemukan <span className="font-bold">{filteredVenues.length}</span> Venue Tersedia</p>
            <div className="flex items-center space-x-2">
                <span className="text-gray-700">Urutkan Berdasarkan:</span>
                <Select onValueChange={setSortBy} value={sortBy}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Harga Tertinggi">Harga Tertinggi</SelectItem>
                    <SelectItem value="Harga Terendah">Harga Terendah</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVenues.map((venue, index) => (
            <Card key={index} className="overflow-hidden pt-0 mb-0">
              <img src={`http://localhost:3000${venue.image_url}`} alt={venue.name} className="w-full h-48 object-cover" />
              <CardHeader className="px-4 pb-0">
                <CardDescription className="text-sm text-gray-500 mb-1">{venue.category}</CardDescription>
                <CardTitle className="text-xl font-semibold text-gray-800 leading-tight">{venue.name}</CardTitle>
                <CardDescription className="flex items-center text-gray-600 text-sm mt-1">
                  <span className="font-medium text-gray-700">{venue.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <div className="flex items-center text-gray-700 text-sm space-x-3">
                    <span className="flex">
                      {venue.category === 'Futsal' && <span>⚽</span>}
                      {venue.category === 'Badminton' && <span>🏸</span>}
                      {venue.category === 'Basket' && <span>🏀</span>}
                      {venue.category === 'Tenis' && <span>🎾</span>}
                      {venue.category}
                    </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex items-baseline text-gray-800">
                  <span className="text-sm mr-1">Mulai</span>
                  <span className="font-bold text-xl">Rp {venue.price.toLocaleString('id-ID')}</span>
                  <span className="text-sm ml-1">/ Sesi</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">JADWAL DIPILIH</SheetTitle>
            <SheetDescription className="text-gray-600">Berikut adalah jadwal yang Anda pilih.</SheetDescription>
          </SheetHeader>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <span className="text-5xl mb-4">🛒</span>
              <p>Belum ada jadwal di keranjang.</p>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {cartItems.map(item => (
                <Card key={`${item.slotId}-${item.date}`} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{item.fieldName}</p>
                    <p className="text-sm text-gray-700">{item.date} | {item.time}</p>
                    <p className="text-md font-bold text-green-700">{item.price}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.slotId, item.fieldId, item.date)} className="text-red-500 hover:text-red-700">
                    Hapus
                  </Button>
                </Card>
              ))}
            </div>
          )}
          <SheetFooter className="mt-6 border-t pt-4">
            {cartItems.length > 0 && (
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                Lanjutkan Pembayaran ({cartItems.length} Slot)
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}