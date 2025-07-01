import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { HeaderUser } from '../../components/header-user';

const ProfileUser = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Alexander Graham',
    username: 'Username',
    phone: '08981852424',
    email: 'alexgbarem@gmail.com',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Saving changes:', formData);
    // Add your save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
    <HeaderUser/>
      <div className="max-w-4xl mx-auto mt-30 p-10">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Tab Navigation */}
            <div className="flex space-x-8 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'profile' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'password' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ubah Kata Sandi
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="space-y-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Nama Lengkap"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Username"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Nomor Telepon"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Email"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded-lg transition-colors ml-auto block"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <div className="space-y-6">
                  <div>
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Masukkan kata sandi lama"
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Masukkan kata sandi baru"
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Ketik ulang kata sandi baru"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-8 py-3 rounded-lg transition-colors ml-auto block"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileUser;