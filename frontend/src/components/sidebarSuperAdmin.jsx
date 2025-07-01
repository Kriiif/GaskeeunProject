import React from 'react'; // No need for useState here, as states will be passed via props
import { Button } from '@/components/ui/button';
import { Home, List, ShoppingCart, User, Menu, Bell, Star, CalendarIcon, Edit, X, Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomDropdownOwner from '@/components/dropdown-owner';

// Destructure props: isSidebarOpen, setIsSidebarOpen, activeMenuItem, setActiveMenuItem
const CustomSidebarSuperAdmin = ({ isSidebarOpen, setIsSidebarOpen, activeMenuItem, setActiveMenuItem }) => {
    const navigate = useNavigate();

    return (
        <aside className={`
            bg-white flex flex-col justify-between fixed h-full z-50 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            w-64 shadow-lg
        `}>
            <div className="p-4">
                {/* Close button for mobile */}
                <div className="flex items-center justify-between mb-8 lg:justify-center">
                    <div className="flex items-center">
                        <img
                            src="/logos/mukaijo.png"
                            alt="Mukaijo Logo"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <nav className="space-y-2">
                    <Button
                        variant={activeMenuItem === 'Dashboard' ? 'default' : 'ghost'}
                        className="w-full justify-start text-lg px-4 py-3"
                        onClick={() => {
                            setActiveMenuItem('Dashboard');
                            navigate('/dashboard-superAdmin');
                        }}
                    >
                        <Home className="mr-3 h-5 w-5" /> Dashboard
                    </Button>
                    <Button
                        variant={activeMenuItem === 'Kelola Pengajuan' ? 'default' : 'ghost'}
                        className="w-full justify-start text-lg px-4 py-3"
                        onClick={() => {
                            setActiveMenuItem('Kelola Pengajuan'); // Corrected from 'Order' to 'Kelola Lapangan'
                            navigate('/dashboard-kelolaAjuan');
                        }}
                    >
                        <List className="mr-3 h-5 w-5" /> Kelola Pengajuan
                    </Button>
                    
                </nav>
            </div>
            <CustomDropdownOwner />
        </aside>
    );
}

export default CustomSidebarSuperAdmin;