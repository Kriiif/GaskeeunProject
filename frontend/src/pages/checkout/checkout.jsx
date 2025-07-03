import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const CheckoutPage = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [venue, setVenue] = useState(location.state?.venue || {});

  const grossAmount = cartItems.reduce((acc, item) => acc + item.numericPrice, 0);

  useEffect(() => {
    if (!location.state?.cartItems || location.state.cartItems.length === 0) {
      navigate(-1); // Go back if cart is empty
    }
  }, [location.state, navigate]);

  // Load Midtrans Snap script
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SET_YOUR_CLIENT_KEY_HERE";

    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    const items = cartItems.map(item => ({
      id: item.fieldId,
      price: item.numericPrice,
      quantity: 1,
      name: `${item.fieldName} (${item.time})`,
    }));

    try {
      const response = await fetch('http://localhost:3000/api/v1/payment/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          gross_amount: grossAmount,
          items: items,
          venue_id: venue.id,
          booking_details: cartItems.map(item => ({
            field_id: item.fieldId,
            date: item.date,
            time: item.time,
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat transaksi');
      }

      const transaction = await response.json();
      
      window.snap.pay(transaction.token, {
        onSuccess: function(result){
          navigate(`/order/status?order_id=${result.order_id}`);
        },
        onPending: function(result){
          navigate(`/order/status?order_id=${result.order_id}`);
        },
        onError: function(result){
          alert("Payment failed!");
          console.log(result);
        },
        onClose: function(){
          console.log('Popup closed without finishing payment');
        }
      });

    } catch (error) {
      console.error('Checkout Error:', error);
      alert(error.message);
    }
  };

  const handleRemoveItem = (slotId, fieldId, date) => {
    const updatedCart = cartItems.filter(item => !(item.slotId === slotId && item.fieldId === fieldId && item.date === date));
    setCartItems(updatedCart);
  };
    
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4">
          <div className="flex items-center mt-4">
            <img src="/logos/mukaijo.png" alt="Logo" className="max-h-20"/>
          </div>
        </header>

        <nav className="mb-6 ml-2">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Kembali</span>
          </button>
        </nav>

        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              <span className="mr-1">{venue.rating}</span>
              <span>{venue.location}</span>
            </div>
          </div>

          {cartItems.map(item => (
            <div key={`${item.slotId}-${item.date}`} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{item.fieldName}</h3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <div className="w-1.5 h-10 bg-black rounded-sm mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-800">{item.date} • {item.time}</p>
                    <p className="font-bold text-gray-900">{item.price}</p>
                  </div>
                </div>
                <button onClick={() => handleRemoveItem(item.slotId, item.fieldId, item.date)} className="text-gray-500 hover:text-red-600 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button onClick={handleCheckout} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors">
              Gaskeeun!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;