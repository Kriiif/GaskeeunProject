import React, { useState, useContext, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import { HeaderUser } from '../../components/header-user';
import { AuthContext } from '../../contexts/AuthContext';

const ProfileUser = () => {
  const { user, updateProfile, changePassword } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      };

      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile berhasil diperbarui!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Gagal memperbarui profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok' });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter' });
      setLoading(false);
      return;
    }

    try {
      const passwordData = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      };

      await changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password berhasil diubah!' });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Gagal mengubah password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
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

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
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
                      onClick={handleProfileSave}
                      disabled={loading || !formData.name || !formData.phone || !formData.email}
                      className={`font-medium px-8 py-3 rounded-lg transition-colors ml-auto block ${
                        loading || !formData.name || !formData.phone || !formData.email
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kata Sandi Lama
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kata Sandi Baru
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Kata Sandi Baru
                    </label>
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
                      disabled={loading || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                      onClick={handlePasswordSave}
                      className={`font-medium px-8 py-3 rounded-lg transition-colors ml-auto block ${
                        loading || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </div>
              </div>
            )}          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;