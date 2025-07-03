import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Assuming useAuth provides token

const OrderStatusPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, pending, failure
  const [orderId, setOrderId] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const order_id = searchParams.get('order_id');
    setOrderId(order_id);

    if (order_id) {
      const checkStatus = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/payment/transaction-status/${order_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            switch (data.booking_status) {
              case 'CONFIRMED':
                setStatus('success');
                break;
              case 'PENDING':
                setStatus('pending');
                break;
              case 'CANCELLED':
                setStatus('failure');
                break;
              default:
                setStatus('failure');
            }
          } else {
            // If the transaction is not found, it might still be processing.
            // We can retry a few times.
            // For now, we'll just mark it as pending.
            setStatus('pending');
          }
        } catch (error) {
          console.error('Error fetching transaction status:', error);
          setStatus('failure');
        }
      };

      // Poll for status update
      const interval = setInterval(() => {
        checkStatus();
      }, 3000); // Check every 3 seconds

      // Stop polling after some time (e.g., 30 seconds) or when status is no longer pending
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (status === 'pending') {
            // If still pending after timeout, you might want to show a specific message
        }
      }, 30000);

      checkStatus(); // Initial check

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

  }, [searchParams, token, status]);

  const statusInfo = {
    success: {
      icon: <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />,
      title: "Pembayaran Berhasil!",
      message: "Terima kasih! Pesanan Anda telah dikonfirmasi. Detail pemesanan telah dikirim ke email Anda.",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    pending: {
      icon: <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />,
      title: "Menunggu Pembayaran",
      message: "Kami masih menunggu pembayaran Anda. Selesaikan pembayaran sebelum batas waktu untuk mengonfirmasi pesanan Anda.",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
    },
    failure: {
      icon: <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
      title: "Pembayaran Gagal",
      message: "Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau gunakan metode pembayaran lain.",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
    loading: {
      icon: null,
      title: "Memverifikasi Status Pesanan...",
      message: "Harap tunggu sebentar...",
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
    }
  };

  const currentStatus = statusInfo[status];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className={`max-w-md w-full p-8 rounded-lg shadow-lg text-center ${currentStatus.bgColor}`}>
        {currentStatus.icon}
        <h1 className={`text-2xl font-bold mb-2 ${currentStatus.textColor}`}>{currentStatus.title}</h1>
        <p className={`${currentStatus.textColor} mb-6`}>{currentStatus.message}</p>
        {orderId && (
          <div className="mb-6 text-sm text-gray-600">
            <p>Nomor Pesanan Anda:</p>
            <p className="font-mono bg-gray-200 px-2 py-1 rounded inline-block mt-1">{orderId}</p>
          </div>
        )}
        <Link to="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default OrderStatusPage;
