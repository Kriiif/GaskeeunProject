import React, { useState } from 'react'; // Import React and useState
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'; // Import dropdown components
import { Navigate, useNavigate } from 'react-router-dom'; // If you want to navigate after password change
import { Home, List, ShoppingCart, User, Menu, Bell, Star, CalendarIcon, Edit, X, Search, TrendingUp } from 'lucide-react'; // Import TrendingUp
import useAuth from '@/hooks/useAuth'; 

const CustomDropdownOwner = () => {   
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { logout, user } = useAuth(); // Import logout function and user from your auth context or hook
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChangePassword = () => {
        // Implement your change password logic here
        console.log("Changing password...");
        // Example: navigate to change password page
        navigate('/verification'); // Adjust the route as needed
    };

    const handleMovePage = () => {
        navigate("/");
    };

    return (
        <div className="p-4 border-t border-gray-200 text-center">
            <DropdownMenu>                <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
                        <User className="h-12 w-12 mx-auto mb-2 text-gray-700" />
                        <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                        <div className="mt-2 text-gray-600">
                            <List className="h-5 w-5 inline-block" />
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuItem onClick={handleMovePage}>
                        Dashboard Penyewa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleChangePassword}>
                        Ganti Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
export default CustomDropdownOwner;