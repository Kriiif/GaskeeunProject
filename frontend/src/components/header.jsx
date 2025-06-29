// src/components/header.jsx
import React from "react";
import { Button } from "@/components/ui/button"; // Pastikan named import untuk Button
import { ShoppingCart } from 'lucide-react'; // Import ikon keranjang. Instal: npm install lucide-react
import { useNavigate } from "react-router-dom";

// Header kini menerima props cartItemCount dan onCartClick
const Header = ({ cartItemCount, onCartClick }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    }

  return (
    <nav className="bg-white shadow-md py-5 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        <div className="flex items-center">
            <img src="/logos/mukaijo.png" alt="Logo" className="max-h-14 w-auto max-ml-20" />
        </div>
        <div className="flex flex-grow justify-center space-x-8">
            <button className="text-gray-700 hover:text-green-600 font-medium text-center" onClick={() => {
                    navigate('/dashboard-user')
                }}>Sewa Lapangan</button>
            <button 
                className="text-gray-700 hover:text-green-600 font-medium text-center"
                onClick={() => {
                    navigate('/partnership')
                }}
            >
                Partnership
            </button>
        </div>
        <div className="flex items-center space-x-4 max-mr-20">
            {/* Tombol Keranjang */}
            <Button variant="ghost" className="font-medium relative" onClick={onCartClick}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
            </Button>
            <Button variant="ghost" className="font-medium" onClick={handleLogin} >Masuk</Button>
            <Button className="bg-green-600 hover:bg-green-700 font-medium">Daftar</Button>
        </div>
    </nav>
  );
}

export {Header};