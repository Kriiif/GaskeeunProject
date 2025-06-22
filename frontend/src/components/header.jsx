import React from "react";
import { Button } from "@/components/ui/button"; // Pastikan jalur impor sesuai dengan struktur proyek Anda
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Header = () => {
  return (
    <nav className="bg-white shadow-md py-5 px-6 flex justify-between items-center fixed w-full top-0 z-50"> {/* Menaikkan padding vertikal menjadi py-5 */}
        <div className="flex items-center"> {/* Hapus space-x dan h-12 dari div pembungkus */}
            <img src="../public/logos/mukaijo.png" className="max-h-14 max-w-30 max-ml-20" /> {/* Terapkan tinggi langsung ke img, h-16 (64px) cocok untuk logo, dan mr-4 untuk spasi */}
        </div>
        <div className="flex flex-grow justify-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 font-medium text-center">Sewa Lapangan</a>
            <a href="#" className="text-gray-700 hover:text-green-600 font-medium text-center">Partnership</a>
        </div>
        <div className="flex items-center space-x-4 max-mr-20">
            <Button className="bg-white hover:bg-neutral-300" ><FontAwesomeIcon icon={faCartShopping} size="2xl" style={{color: "#000000"}} /></Button>
            <Button variant="ghost" className="font-medium">Masuk</Button>
            <Button className="bg-green-600 hover:bg-green-700 font-medium">Daftar</Button> {/* Pastikan warna tombol Daftar sesuai keinginan Anda */}
        </div>
    </nav>
  );
}

export {Header};