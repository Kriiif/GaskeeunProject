import React from 'react';
import { ArrowLeft, Star, Trash2 } from 'lucide-react';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo and Navigation positioned above card */}
        <div className="mb-6 ml-2">
          {/* Logo */}
          <header className="mb-4">
            <div className="flex items-center mt-4">
              <img src="/logos/mukaijo.png" alt="Logo" className="max-h-20"/>
            </div>
          </header>

          {/* Navigation */}
          <nav>
            <button className="flex items-center text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Tambah Jadwal</span>
            </button>
          </nav>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          {/* Arena Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Jorhar Arena</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              <span className="mr-1">4.6</span>
              <span>Jorhar Baru, Daerah Khusus Ibukata Jakarta</span>
            </div>
          </div>

          {/* Court Booking */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Lapangan 1</h3>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center">
                <div className="w-1.5 h-10 bg-black rounded-sm mr-3"></div> {/* Black vertical line */}
                <div>
                  <p className="text-sm text-gray-800">Selasa, 30 Juni 2025 • 11.00 - 12.00</p>
                  <p className="font-bold text-gray-900">Rp. 70.000</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-red-600 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors">
              Gaskeeun!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;