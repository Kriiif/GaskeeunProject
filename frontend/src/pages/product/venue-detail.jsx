import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Header } from '@/components/header';
import { HeaderUser } from '@/components/header-user';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { addDays, format, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';

const VenueDetailPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [venue, setVenue] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch cart from DB for logged-in users
  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) {
        try {
          const response = await axios.get('http://localhost:3000/api/v1/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setCartItems(response.data.data.items);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          // Silently fail, user can still browse. Cart will appear empty.
        }
      } else {
        // If user logs out, clear the cart
        setCartItems([]);
      }
    };

    fetchCart();
  }, [user, token]);
  
  // Helper function to generate time slots
  const generateTimeSlots = (openHour, closeHour, fieldId, price) => {
    const slots = [];
    if (!openHour || !closeHour) {
      return [];
    }

    let start = parseInt(openHour.split(':')[0]);
    let end = parseInt(closeHour.split(':')[0]);

    // If end hour is 00, it means midnight of the next day.
    if (end === 0) {
      end = 24;
    }

    for (let hour = start; hour < end; hour++) {
      const nextHour = hour + 1;
      const time = `${String(hour).padStart(2, '0')}:00 - ${String(nextHour > 24 ? nextHour - 24 : nextHour).padStart(2, '0')}:00`;
      slots.push({
        id: `${fieldId}-${String(hour).padStart(2, '0')}00`,
        time: time,
        available: true, // Default to available, can be updated with real booking data
        price: price
      });
    }
    return slots;
  };

  // Date selection
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

  // Fetch venue details and fields
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch venue details
        const venueResponse = await axios.get(`http://localhost:3000/api/v1/venues/${venueId}`);
        
        if (venueResponse.data.success) {
          const venueData = venueResponse.data.data;
          
          // Format venue data for display
          const formattedVenue = {
            id: venueData._id,
            name: venueData.partner_req_id?.namaVenue || 'Unknown Venue',
            mainImage: venueData.partner_req_id?.fotoVenue 
              ? `http://localhost:3000/uploads/${venueData.partner_req_id.fotoVenue}` 
              : '/venue/default.jpg',
            sports: venueData.sports || ['Multi-Sport'],
            rating: 4.5, // Default rating, you can enhance this later
            location: venueData.partner_req_id?.lokasiVenue || 'Unknown Location',
            price: `Rp. ${(venueData.price || 50000).toLocaleString('id-ID')}/Sesi`,
            description: venueData.description || 'No description available',
            owner: venueData.partner_req_id?.namaPemilik || 'Unknown Owner',
            email: venueData.partner_req_id?.email || '',
            phone: venueData.partner_req_id?.nomorTelepon || '',
            // Mock reviews - you'll need to implement a proper review system later
            reviews: [
              { user: "Anonymous User", text: "Venue yang bagus dan nyaman untuk bermain olahraga.", rating: 4.5, avatar: "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=AU" },
              { user: "Sport Enthusiast", text: "Fasilitas lengkap dan pelayanan memuaskan.", rating: 4.3, avatar: "https://via.placeholder.com/40/CCCCCC/FFFFFF?text=SE" },
            ]
          };
          
          setVenue(formattedVenue);
          
          // Fetch fields for this venue
          try {
            const fieldsResponse = await axios.get(`http://localhost:3000/api/v1/fields/venue/${venueId}`);
            
            if (fieldsResponse.data.success) {
              const fieldsData = fieldsResponse.data.data;
              
              // Format fields data with mock time slots
              const formattedFields = fieldsData.map(field => ({
                id: field._id,
                name: field.name,
                image: field.image_url 
                  ? `http://localhost:3000${field.image_url}` 
                  : '/venue/default.jpg',
                category: field.category,
                description: field.desc,
                price: field.price,
                openHour: field.open_hour,
                closeHour: field.close_hour,
                availabilityStatus: "Tersedia", // You can calculate this based on bookings
                timeSlots: generateTimeSlots(field.open_hour, field.close_hour, field._id, field.price)
              }));
              
              setFields(formattedFields);
            } else {
              // If no fields found, set empty array
              setFields([]);
            }
          } catch (fieldsErr) {
            console.error('Error fetching fields:', fieldsErr);
            // Set empty fields if there's an error
            setFields([]);
          }
        }
      } catch (err) {
        console.error('Error fetching venue details:', err);
        setError('Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenueDetails();
    }
  }, [venueId]);

  // Cart functions
  const handleSlotClick = async (field, slot) => {
    if (!slot.available) return;

    // If user is not logged in, redirect to login page
    if (!user) {
      navigate('/login', { state: { from: `/venues/${venueId}` } });
      return;
    }

    const newItem = {
      venueId: venue.id,
      fieldId: field.id,
      fieldName: field.name,
      fieldImage: field.image,
      date: format(selectedDateObject, "dd MMMM yyyy", { locale: id }),
      time: slot.time,
      price: `Rp. ${slot.price.toLocaleString('id-ID')}`,
      numericPrice: slot.price
    };

    // DB operations for logged-in users
    const existingItemIndex = cartItems.findIndex(
      (item) => item.fieldId === newItem.fieldId && item.date === newItem.date && item.time === newItem.time
    );

    try {
      if (existingItemIndex > -1) {
        // Item exists, so remove it
        const itemToRemove = cartItems[existingItemIndex];
        await axios.post('http://localhost:3000/api/v1/cart/remove', 
          { fieldId: itemToRemove.fieldId, date: itemToRemove.date, time: itemToRemove.time },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedCart = cartItems.filter((_, index) => index !== existingItemIndex);
        setCartItems(updatedCart);
      } else {
        // Item doesn't exist, so add it
        const response = await axios.post('http://localhost:3000/api/v1/cart/add', 
          newItem, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Make sure to update the cart with the latest full state from the server
        if (response.data.success) {
          setCartItems(response.data.data.items);
        }
      }
    } catch (error) {
      console.error("Failed to update cart in DB:", error);
    }
  };

  const removeFromCart = async (itemToRemove) => {
    // This function now only works for logged-in users
    if (!user) return;

    // The backend expects the fieldId as a string, not an object.
    const fieldIdToRemove = itemToRemove.fieldId?._id || itemToRemove.fieldId;

    try {
      await axios.post('http://localhost:3000/api/v1/cart/remove', 
        { fieldId: fieldIdToRemove, date: itemToRemove.date, time: itemToRemove.time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After successful removal from DB, update the local state
      setCartItems(currentCartItems => 
        currentCartItems.filter(item => {
          const itemFieldId = item.fieldId?._id || item.fieldId;
          return !(
            itemFieldId === fieldIdToRemove && 
            item.date === itemToRemove.date && 
            item.time === itemToRemove.time
          );
        })
      );
    } catch (error) {
      console.error("Failed to remove item from DB:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.numericPrice, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        {user ? (
          <HeaderUser cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
        ) : (
          <Header cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
        )}
        <div className="container mx-auto p-6 pt-[100px]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        {user ? (
          <HeaderUser cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
        ) : (
          <Header cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
        )}
        <div className="container mx-auto p-6 pt-[100px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Venue Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The venue you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {user ? (
        <HeaderUser cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
      ) : (
        <Header cartItemCount={cartItems.length} onCartClick={() => setIsSheetOpen(true)} />
      )}

      <div className="container mx-auto p-6 pt-[100px] mb-8 mt-4">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')} 
          className="mb-6"
        >
          ← Kembali ke Beranda
        </Button>

        {/* Top Product Info Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <img
            src={venue.mainImage}
            alt={venue.name}
            className="w-full h-80 object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = '/venue/default.jpg';
            }}
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{venue.name}</h1>
                <div className="flex items-center text-gray-600 text-base mb-4">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="font-medium">{venue.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{venue.location.split(',')[0]}, {venue.location.split(',')[1]}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <span className="font-medium mr-2">Sports:</span>
                  <span>{venue.sports.join(', ')}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="font-medium mr-2">Owner:</span>
                  <span>{venue.owner}</span>
                </div>
              </div>
              <div className="bg-green-100 border border-green-300 text-green-700 font-semibold text-sm px-4 py-2 rounded-md shadow-sm">
                Mulai dari {venue.price}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 pt-4">Deskripsi</h3>
            <p className="text-gray-700 text-sm mb-4">{venue.description}</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Lokasi</h3>
            <p className="text-gray-700 text-sm mb-6">{venue.location}</p>
          </div>
        </div>

        {/* Pilih Lapangan Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pilih Lapangan</h2>

          {/* Date Selector */}
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

          {/* Field List */}
          <div className="space-y-6">
            {fields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Belum ada lapangan tersedia</p>
                <p className="text-gray-400 text-sm">Venue ini belum memiliki lapangan yang dapat dipesan</p>
              </div>
            ) : (
              fields.map((field) => (
                <Accordion key={field.id} type="single" collapsible defaultValue="item-1">
                  <AccordionItem value={`field-${field.id}`}>
                    <AccordionTrigger className="px-4 py-3 flex items-center justify-between w-full border border-gray-200 rounded-lg text-left hover:bg-gray-50 hover:no-underline">
                      <div className="flex items-center">
                        <img
                          src={field.image}
                          alt={field.name}
                          className="w-16 h-16 object-cover rounded-md mr-3 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/venue/default.jpg';
                          }}
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{field.name}</h3>
                          <p className="text-sm text-green-600 font-medium">{field.availabilityStatus}</p>
                          <p className="text-xs text-gray-500">{field.category}</p>
                        </div>
                      </div>
                      <div className="text-right ml-auto">
                        <p className="text-lg font-bold text-green-600">Rp {field.price.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-gray-500">per jam</p>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-4 px-4 pb-4 border-l border-r border-b border-gray-200 rounded-b-lg -mt-px">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Deskripsi:</span> {field.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Jam Operasional:</span> {field.openHour} - {field.closeHour}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                        {field.timeSlots.map((slot) => {
                          const isSelectedInCart = cartItems.some((item) => {
                            // The backend now populates fieldId, so it's an object.
                            // We need to compare the _id of the populated object.
                            const itemFieldId = item.fieldId?._id || item.fieldId;
                            return itemFieldId === field.id && 
                              item.date === format(selectedDateObject, "dd MMMM yyyy", { locale: id }) && 
                              item.time === slot.time;
                          });
                          
                          return (
                            <Button
                              key={slot.id}
                              variant={slot.available ? "outline" : "secondary"}
                              onClick={() => handleSlotClick(field, slot)}
                              className={`h-auto py-2 text-sm flex flex-col items-start
                                ${slot.available ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                                ${isSelectedInCart ? 'bg-green-50 ring-2 ring-green-400 border-green-500 text-green-700' : ''}
                              `}
                              disabled={!slot.available}
                            >
                              <div>{slot.time}</div>
                            </Button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Review</h2>
          <div className="flex items-center text-gray-700 text-lg mb-4">
            <span className="text-yellow-500 text-xl mr-2">⭐</span>
            <span className="font-bold">{venue.rating}</span>
            <span className="ml-1 text-gray-500">({venue.reviews.length} reviews)</span>
          </div>

          <div className="space-y-6">
            {venue.reviews.map((review, idx) => (
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

      {/* Cart Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">JADWAL DIPILIH</SheetTitle>
            <SheetDescription className="text-gray-600">
              {user ? "Berikut adalah jadwal yang Anda pilih." : "Silakan masuk untuk menambahkan jadwal."}
            </SheetDescription>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <span className="text-5xl mb-4">🛒</span>
              <p>Belum ada jadwal di keranjang.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto -mx-6 px-6 py-4 space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.fieldId}-${item.date}-${item.time}-${index}`} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img src={item.fieldImage} alt={item.fieldName} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-bold text-gray-800">{item.fieldName}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-md font-semibold text-green-600 mt-1">{item.price}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFromCart(item)} 
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 -mr-2 -mt-2 flex-shrink-0"
                  >
                    <span className="text-2xl">×</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && user && (
            <SheetFooter className="mt-auto border-t pt-4 bg-white">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>
                <Button 
                  onClick={() => navigate('/checkout', { state: { cartItems, venue } })}
                  className="bg-green-600 hover:bg-green-700 text-white w-full text-base py-3"
                  disabled={!user}
                >
                  Lanjutkan Pembayaran
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default VenueDetailPage;
