import { useState } from 'react';
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
  { src: '/carausel/futsalcourt.jpg', alt: 'Futsal Court', title: 'Futsal' },
  { src: '/carausel/basketcourt.jpg', alt: 'Basketball Court', title: 'Basket' },
  { src: '/carausel/tenniscourt.jpg', alt: 'Tennis Court', title: 'Tenis' },
];

const venues = [
  {
    name: 'Jonhar Arena',
    rating: 5.0,
    location: 'Kota Jakarta Pusat',
    price: { amount: 'Rp 50.000', per: '/ Sesi' },
    sports: ['Futsal', 'Badminton'],
    image: '/venue/jorhar.png'
  },
  {
    name: 'Vlocity Arena',
    rating: 5.0,
    location: 'Kota Jakarta Barat',
    price: { amount: 'Rp 50.000', per: '/ Sesi' },
    sports: ['Basket', 'Tenis'],
    image: '/venue/tenis.jpg'
  },
  {
    name: 'GOR Kurnia',
    rating: 5.0,
    location: 'Kota Jakarta Timur',
    price: { amount: 'Rp 50.000', per: '/ Sesi' },
    sports: ['Badminton'],
    image: '/venue/badmin1.jpg'
  },
  {
    name: 'Johar Arena',
    rating: 5.0,
    location: 'Kota Jakarta Pusat',
    price: { amount: 'Rp 50.000', per: '/ Sesi' },
    sports: ['Futsal'],
    image: '/venue/futsal1.jpg'
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [sportType, setSportType] = useState('');
  const [sortBy, setSortBy] = useState('Harga Tertinggi');
  const [cartItems, setCartItems] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const removeFromCart = (slotId, fieldId, date) => {
    setCartItems(cartItems.filter(item => !(item.slotId === slotId && item.fieldId === fieldId && item.date === date)));
  };

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
          <Input placeholder="Cari Nama Venue" className="flex-1 min-w-[200px]" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
          <Input placeholder="Pilih kota" className="flex-1 min-w-[200px]" value={city} onChange={(e) => setCity(e.target.value)} />
          <Select onValueChange={setSportType} value={sportType}>
            <SelectTrigger className="flex-1 min-w-[200px]">
              <SelectValue placeholder="Pilih Cabang Olahraga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Badminton">Badminton</SelectItem>
              <SelectItem value="Futsal">Futsal</SelectItem>
              <SelectItem value="Basket">Basket</SelectItem>
              <SelectItem value="Tenis">Tenis</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-green-600 hover:bg-green-700 px-6 py-3 font-medium">Cari Venue</Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue, index) => (
            <Card key={index} className="overflow-hidden pt-0 mb-0">
              <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover" />
              <CardHeader className="px-4 pb-0">
                <CardDescription className="text-sm text-gray-500 mb-1">Venue</CardDescription>
                <CardTitle className="text-xl font-semibold text-gray-800 leading-tight">{venue.name}</CardTitle>
                <CardDescription className="flex items-center text-gray-600 text-sm mt-1">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="font-medium text-gray-700">{venue.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{venue.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
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
              <CardFooter className="p-4 pt-0">
                <div className="flex items-baseline text-gray-800">
                  <span className="text-sm mr-1">Mulai</span>
                  <span className="font-bold text-xl">{venue.price.amount}</span>
                  <span className="text-sm ml-1">{venue.price.per}</span>
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
