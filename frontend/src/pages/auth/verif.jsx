import React, { useState } from 'react';
// Assuming you have components for Input, Button, and Alert (or similar for the info box)
// You might also need a component for the eye icon to toggle password visibility
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui Input
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Assuming shadcn/ui Alert
import { Eye, EyeOff } from 'lucide-react'; // For password visibility toggle
import { Navigate, useNavigate } from 'react-router-dom'; // If you want to navigate after password change

const Verification = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [error, setError] = useState(''); // State for handling errors (e.g., passwords don't match)
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (newPassword.length < 8) {
            setError('Kata sandi baru harus minimal 8 karakter.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Kata sandi baru dan konfirmasi kata sandi tidak cocok.');
            return;
        }

        // Simulate API call success
        alert('Kata sandi berhasil diubah! Silakan masuk kembali.');
        // Navigate to login page or a success page
        // navigate('/login'); // Uncomment if you use react-router-dom navigate
        navigate('/dashboard-main'); // If you want to redirect after successful password change
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 ">Kata Sandi Baru</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Input */}
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Kata Sandi Baru
                        </label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Minimum 8 Karakter"
                                className="pr-10" // Add padding for the eye icon
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 Karakter</p>
                    </div>

                    {/* Confirm New Password Input */}
                    <div>
                        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Ketik Ulang Kata Sandi Baru
                        </label>
                        <div className="relative">
                            <Input
                                id="confirm-new-password"
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                className="pr-10"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                             <button
                                type="button"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive"> {/* Assuming shadcn/ui has a 'destructive' variant for errors */}
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 border-blue-200 text-blue-700">
                        <AlertTitle className="flex items-center text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Informasi
                        </AlertTitle>
                        <AlertDescription>
                            Setelah kata sandi diubah, silakan masuk kembali dengan kata sandi baru di semua perangkatmu.
                        </AlertDescription>
                    </Alert>

                    <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-lg">
                        Lanjut
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Verification;