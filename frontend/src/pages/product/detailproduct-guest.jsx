import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Import komponen Accordion
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import komponen Sheet dari Shadcn UI
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter // Tambahkan jika Anda berencana menggunakan footer di sheet
} from "@/components/ui/sheet";

import { addDays, format, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { Header } from '../../components/header';

const DetailProductPage = () => {
  // --- Data Produk (Tetap sama) ---
  const product = {
    name: "Johar Arena",
    mainImage: "../public/carausel/badminton.jpg",
    sport: "Badminton",
    rating: 4.6,
    location: "Jl. Johar Baru, Kec. Johar Baru, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10560",
    price: "Rp. 50.000/Sesi",
    description: "Lapangan berstandar BWF yang memungkinkan kenyamanan saat bermain badminton.",
    fields: [
      {
        id: 1,
        name: "Lapangan 1",
        image: "../public/venue/jorhar.png",
        availabilityStatus: "3 Jadwal Tersedia",
        timeSlots: [
          { id: '1-1800', time: "18:00 - 19:00", available: true, price: "Rp. 50.000" },
          { id: '1-1900', time: "19:00 - 20:00", available: false, price: null },
          { id: '1-2000', time: "20:00 - 21:00", available: true, price: "Rp. 50.000" },
          { id: '1-2100', time: "21:00 - 22:00", available: true, price: "Rp. 50.000" },
        ],
      },
      {
        id: 2,
        name: "Lapangan 2",
        image: "../public/venue/jorhar.png",
        availabilityStatus: "3 Jadwal Tersedia",
        timeSlots: [
          { id: '2-1800', time: "18:00 - 19:00", available: true, price: "Rp. 50.000" },
          { id: '2-1900', time: "19:00 - 20:00", available: true, price: "Rp. 50.000" },
          { id: '2-2000', time: "20:00 - 21:00", available: false, price: null },
          { id: '2-2100', time: "21:00 - 22:00", available: true, price: "Rp. 50.000" },
        ],
      },
    ],
    reviews: [
      { user: "Uchiha Ucup", text: "lapangannya sudah bagus namun hanya saja parkirannya lumayan sempit.", rating: 3.9, avatar: "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=UU" },
      { user: "Saklar Melebar", text: "lapangannya sudah bagus namun hanya saja parkirannya lumayan sempit.", rating: 3.9, avatar: "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=SM" },
      { user: "Sapiderman212", text: "lapangannya sudah bagus namun hanya saja parkirannya lumayan sempit.", rating: 3.9, avatar: "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=S2" },
    ]
  };

  // --- Dinamisasi Tanggal ---
  const today = new Date();
  const daysInIndonesian = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const generateNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      dates.push({
        dayName: daysInIndonesian[getDay(date)],
        dateFormatted: format(date, "dd MMMM", { locale: id }),
        fullDateObject: date
      });
    }
    return dates;
  };

  const next7Days = generateNext7Days();
  const [selectedDateObject, setSelectedDateObject] = useState(next7Days[0].fullDateObject);
  const [cartItems, setCartItems] = useState([]); // State baru untuk item keranjang
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State untuk mengontrol Sheet

  // Hitung total slot tersedia untuk tombol Accordion
  const totalAvailableSlots = product.fields.reduce((count, field) => {
    return count + field.timeSlots.filter(slot => slot.available).length;
  }, 0);

  // Fungsi untuk menambahkan slot ke keranjang
  const handleSlotClick = (fieldId, fieldName, slot) => {
    if (!slot.available) return; // Jangan tambahkan jika tidak tersedia

    const newItem = {
      slotId: slot.id,
      fieldId: fieldId,
      fieldName: fieldName,
      date: format(selectedDateObject, "dd MMMM yyyy", { locale: id }),
      time: slot.time,
      price: slot.price,
    };

    // Cek apakah slot sudah ada di keranjang
    const existingItemIndex = cartItems.findIndex(
      (item) => item.slotId === newItem.slotId && item.fieldId === newItem.fieldId && item.date === newItem.date
    );

    if (existingItemIndex > -1) {
      // Jika sudah ada, hapus dari keranjang (toggle)
      const updatedCart = cartItems.filter((_, index) => index !== existingItemIndex);
      setCartItems(updatedCart);
    } else {
      // Jika belum ada, tambahkan ke keranjang
      setCartItems([...cartItems, newItem]);
    }
  };

  // Fungsi untuk menghapus item dari keranjang
  const removeFromCart = (slotId, fieldId, date) => {
    setCartItems(cartItems.filter(item => !(item.slotId === slotId && item.fieldId === fieldId && item.date === date)));
  };

  // --- Render Komponen ---
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* HEADER - Kini menerima props cartItemCount dan onCartClick */}
      <Header cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />

      {/* Main Content */}
      <div className="container mx-auto p-6 pt-[100px] mb-8 mt-4">
        {/* Top Product Info Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-80 object-cover rounded-t-lg"
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                <div className="flex items-center text-gray-600 text-base mb-4">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="font-medium">{product.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{product.location.split(',')[0]}, {product.location.split(',')[1]}</span>
                </div>
              </div>
              <div className="bg-green-100 border border-green-300 text-green-700 font-semibold text-sm px-4 py-2 rounded-md shadow-sm">
                Mulai dari {product.price}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 pt-4">Deskripsi</h3>
            <p className="text-gray-700 text-sm mb-4">{product.description}</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Lokasi</h3>
            <p className="text-gray-700 text-sm mb-6">{product.location}</p>
          </div>
        </div>

        {/* Pilih Lapangan Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pilih Lapangan</h2>

          {/* Date Selector Buttons & Calendar Button */}
          <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200">
            {next7Days.map((dateItem, idx) => (
              <Button
                key={idx}
                variant={format(selectedDateObject, "dd MMMM", { locale: id }) === dateItem.dateFormatted ? "default" : "outline"}
                className={selectedDateObject && format(selectedDateObject, "dd MMMM", { locale: id }) === dateItem.dateFormatted ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
                onClick={() => setSelectedDateObject(dateItem.fullDateObject)}
              >
                <div>{dateItem.dayName}</div>
                <div className="font-semibold">{dateItem.dateFormatted}</div>
              </Button>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-auto justify-start text-left font-normal flex-shrink-0 ${
                    selectedDateObject && !next7Days.some(item => format(selectedDateObject, "dd MMMM", { locale: id }) === item.dateFormatted)
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">🗓️</span>
                  {selectedDateObject && !next7Days.some(item => format(selectedDateObject, "dd MMMM", { locale: id }) === item.dateFormatted)
                    ? format(selectedDateObject, "dd MMMM", { locale: id })
                    : "Lainnya"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDateObject}
                  onSelect={setSelectedDateObject}
                  initialFocus
                  locale={id}
                  disabled={date => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Daftar Lapangan, masing-masing dalam Accordion */}
          <div className="space-y-6">
            {product.fields.map((field) => (
              <Accordion key={field.id} type="single" collapsible defaultValue="item-1">
                <AccordionItem value={`field-${field.id}`}>
                  <AccordionTrigger className="px-4 py-3 flex items-center justify-between w-full border border-gray-200 rounded-lg text-left hover:bg-gray-50 hover:no-underline">
                    <div className="flex items-center">
                      <img
                        src={field.image}
                        alt={field.name}
                        className="w-16 h-16 object-cover rounded-md mr-3 flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{field.name}</h3>
                        <p className="text-sm text-green-600 font-medium">{field.availabilityStatus}</p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-4 px-4 pb-4 border-l border-r border-b border-gray-200 rounded-b-lg -mt-px">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                      {field.timeSlots.map((slot) => {
                        const isSelectedInCart = cartItems.some(
                          (item) => item.slotId === slot.id && item.fieldId === field.id && item.date === format(selectedDateObject, "dd MMMM yyyy", { locale: id })
                        );
                        return (
                          <Button
                            key={slot.id}
                            variant={slot.available ? "outline" : "secondary"}
                            onClick={() => handleSlotClick(field.id, field.name, slot)}
                            className={`h-auto py-2 text-sm
                              ${slot.available ? 'border-green-500 text-green-700 hover:bg-green-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                              ${isSelectedInCart ? 'bg-green-50 ring-2 ring-green-400' : ''}
                            `}
                            disabled={!slot.available}
                          >
                            {slot.time}
                            {slot.price && <div className="text-xs font-normal mt-1"></div>}
                          </Button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Review</h2>
          <div className="flex items-center text-gray-700 text-lg mb-4">
            <span className="text-yellow-500 text-xl mr-2">⭐</span>
            <span className="font-bold">{product.rating}</span>
            <span className="ml-1 text-gray-500">({product.reviews.length} reviews)</span>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="flex items-start border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                <img
                  src={review.avatar}
                  alt={review.user}
                  className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{review.user}</h4>
                  <div className="flex items-center text-yellow-500 text-sm mb-1">
                    <span className="mr-1">⭐</span>
                    <span>{review.rating}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SHADCn Sheet untuk Keranjang */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right"> {/* side="right" agar muncul dari kanan */}
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">JADWAL DIPILIH</SheetTitle>
            <SheetDescription className="text-gray-600">
              Berikut adalah jadwal yang Anda pilih.
            </SheetDescription>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <span className="text-5xl mb-4">🛒</span>
              <p>Belum ada jadwal di keranjang.</p>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {cartItems.map((item) => (
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
};

export default DetailProductPage;