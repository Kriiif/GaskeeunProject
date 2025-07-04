import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [allVenues, setAllVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [sportType, setSportType] = useState('');
  const [sortBy, setSortBy] = useState('Terbaru');
  const [cartItems, setCartItems] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/venues');
        if (!response.ok) {
          throw new Error('Gagal mengambil data venue');
        }
        const result = await response.json();
          if (result.success) {
          // Filter only active venues and format the data
          const activeVenues = result.data
            .filter(venue => venue.status === 'active' && venue.partner_req_id)
            .map(venue => ({
              id: venue._id,
              name: venue.partner_req_id.namaVenue,
              location: venue.partner_req_id.lokasiVenue,
              description: venue.description,
              owner: venue.partner_req_id.namaPemilik,
              email: venue.partner_req_id.email,
              phone: venue.partner_req_id.nomorTelepon,
              image_url: venue.partner_req_id.fotoVenue ? `/uploads/${venue.partner_req_id.fotoVenue}` : '/venue/default.jpg',
              category: venue.sports && venue.sports.length > 0 ? venue.sports.join(', ') : 'Multi-Sport',
              sports: venue.sports || ['Multi-Sport'],
              price: venue.price || 50000,
              createdAt: venue.createdAt
            }));
          
          setAllVenues(activeVenues);
          setFilteredVenues(activeVenues);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);
  const removeFromCart = (slotId, fieldId, date) => {
    setCartItems(cartItems.filter(item => !(item.slotId === slotId && item.fieldId === fieldId && item.date === date)));
  };

  // Function to navigate to venue detail page
  const handleVenueClick = (venueId) => {
    navigate(`/venue/${venueId}`);
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

    // For venues, we'll show all since they are multi-sport
    // sportType filter can be removed or kept for future enhancement

    // Apply sorting to filtered results
    tempVenues.sort((a, b) => {
      if (sortBy === 'Harga Tertinggi') {
        return b.price - a.price;
      } else if (sortBy === 'Harga Terendah') {
        return a.price - b.price;
      } else if (sortBy === 'Terbaru') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    setFilteredVenues(tempVenues);
  };
  // Menerapkan filter setiap kali venueName, city, atau sortBy berubah
  useEffect(() => {
    applyFilters();
  }, [venueName, city, sortBy, allVenues]);


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
        </div>        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-wrap gap-4 items-center justify-between">
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
        </div>        {/* Venue List Header */}
        <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700 text-lg">Menemukan <span className="font-bold">{filteredVenues.length}</span> Venue Tersedia</p>
            <div className="flex items-center space-x-2">
                <span className="text-gray-700">Urutkan Berdasarkan:</span>
                <Select onValueChange={setSortBy} value={sortBy}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Terbaru">Terbaru</SelectItem>
                    <SelectItem value="Harga Tertinggi">Harga Tertinggi</SelectItem>
                    <SelectItem value="Harga Terendah">Harga Terendah</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVenues.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada venue yang ditemukan</p>
              <p className="text-gray-400 text-sm">Coba ubah filter pencarian Anda</p>
            </div>
          ) : (            filteredVenues.map((venue, index) => (
              <Card 
                key={venue.id || index} 
                className="overflow-hidden pt-0 mb-0 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleVenueClick(venue.id)}
              >
                <img 
                  src={`http://localhost:3000${venue.image_url}`} 
                  alt={venue.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/venue/default.jpg';
                  }}
                />                <CardHeader className="px-4 pb-0">
                  <CardDescription className="text-sm text-gray-500 mb-1">
                    {venue.category}
                  </CardDescription>
                  <CardTitle className="text-xl font-semibold text-gray-800 leading-tight">
                    {venue.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-gray-600 text-sm mt-1">
                    <span className="font-medium text-gray-700">{venue.location}</span>
                  </CardDescription>
                </CardHeader>                <CardContent className="px-4">
                  <div className="flex items-center text-gray-700 text-sm space-x-3">
                    <span className="flex items-center">
                      <span className="mr-1">🏟️</span>
                      {venue.sports && venue.sports.length > 0 
                        ? venue.sports.slice(0, 2).join(', ') + (venue.sports.length > 2 ? '...' : '')
                        : 'Multi-Sport'
                      }
                    </span>
                  </div>
                  {venue.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {venue.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex items-baseline justify-between w-full">
                    <div className="flex items-baseline text-gray-800">
                      <span className="text-sm mr-1">Mulai</span>
                      <span className="font-bold text-xl">Rp {venue.price.toLocaleString('id-ID')}</span>
                      <span className="text-sm ml-1">/ Sesi</span>
                    </div>                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVenueClick(venue.id);
                      }}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
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