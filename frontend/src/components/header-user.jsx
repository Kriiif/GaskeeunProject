// src/components/header.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from 'lucide-react'; // Mengimpor ikon User
import { useNavigate } from "react-router-dom"; // Untuk navigasi

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Header kini menerima props cartItemCount dan onCartClick
const HeaderUser = ({ cartItemCount, onCartClick }) => {
    const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md py-5 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        <div className="flex items-center">
            <img src="/logos/mukaijo.png" alt="Logo" className="h-14 w-auto max-ml-20" />
        </div>
        <div className="flex flex-grow justify-center space-x-8">
            <button className="text-gray-700 hover:text-green-600 font-medium text-center" onClick={() => {
                    navigate('/')
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
        <div className="flex items-center space-x-4 mr-20 max-mr-40">
            {/* Tombol Keranjang */}
            <Button variant="ghost" className="font-medium relative" onClick={onCartClick}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger> {/* asChild agar Button menjadi trigger */}
                    <Button variant="ghost" className="font-xl p-0 h-10 rounded-full"> {/* Styling button trigger */}
                        <User className="h-20 w-20" /> {/* Ikon Profil */}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount> {/* align="end" agar menu muncul di kanan trigger */}
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile-pages')}>
                        <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/history-user')}>
                        <span>Riwayat Reservasi</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <span>Keluar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </nav>
  );
}

export {HeaderUser};