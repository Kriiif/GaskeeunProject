import React, { useState } from 'react';
import { HeaderUser } from '@/components/header-user'; // Pastikan path ini benar sesuai struktur proyek Anda
import axios from 'axios'; // Pastikan Anda telah menginstal axios
import { useNavigate } from 'react-router-dom';

const FormPartner = () => {  // State untuk semua bidang formulir (controlled components)
  const [formData, setFormData] = useState({
    namaPemilik: '',
    namaVenue: '',
    npwp: '',
    nomorTelepon: '',
    email: '',
    lokasiVenue: '',
    nomorIndukBerusaha: '',
  });

  // State untuk nama file yang dipilih
  const [fotoSuratTanahFileName, setFotoSuratTanahFileName] = useState('');
  const [fotoKTPFileName, setFotoKTPFileName] = useState('');
  const [fotoVenueFileName, setFotoVenueFileName] = useState('');

  // State untuk kesalahan validasi
  const [errors, setErrors] = useState({});

  // State untuk status pengiriman formulir
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' }); // 'success' atau 'error'

  const navigate = useNavigate();

  // Handler untuk perubahan input teks
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
    // Hapus pesan error untuk bidang ini saat pengguna mulai mengetik
    if (errors[id]) {
      setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    }
  };

  // Handler untuk perubahan input file
  const handleFileChange = (event, setFileName, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Hapus pesan error untuk bidang file ini
      if (errors[fieldName]) {
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
      }
    } else {
      setFileName('');
    }
  };

  // Fungsi validasi formulir
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;    // Validasi input teks
    if (!formData.namaPemilik.trim()) { newErrors.namaPemilik = 'Nama Pemilik wajib diisi.'; isValid = false; }
    if (!formData.namaVenue.trim()) { newErrors.namaVenue = 'Nama Venue wajib diisi.'; isValid = false; }
    if (!formData.npwp.trim()) { newErrors.npwp = 'NPWP wajib diisi.'; isValid = false; }
    if (!formData.nomorTelepon.trim()) { newErrors.nomorTelepon = 'Nomor Telepon wajib diisi.'; isValid = false; }
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.'; isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.'; isValid = false;
    }
    if (!formData.lokasiVenue.trim()) { newErrors.lokasiVenue = 'Lokasi Venue wajib diisi.'; isValid = false; }
    if (!formData.nomorIndukBerusaha.trim()) { newErrors.nomorIndukBerusaha = 'Nomor Induk Berusaha wajib diisi.'; isValid = false; }

    // Validasi input file
    if (!fotoSuratTanahFileName) { newErrors.fotoSuratTanah = 'Foto Surat Tanah wajib diunggah.'; isValid = false; }
    if (!fotoKTPFileName) { newErrors.fotoKTP = 'Foto KTP wajib diunggah.'; isValid = false; }
    if (!fotoVenueFileName) { newErrors.fotoVenue = 'Foto Venue wajib diunggah.'; isValid = false; }

    setErrors(newErrors);
    return isValid; // Mengembalikan true jika tidak ada error
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionMessage({ type: '', text: '' });

    if (!validateForm()) {
      setSubmissionMessage({ type: 'error', text: 'Mohon lengkapi semua bidang yang wajib diisi.' });
      return;
    }

    setIsSubmitting(true);

    try {      // Buat FormData untuk mengirim file dan data teks
      const apiFormData = new FormData();
      apiFormData.append('namaPemilik', formData.namaPemilik);
      apiFormData.append('namaVenue', formData.namaVenue);
      apiFormData.append('npwp', formData.npwp);
      apiFormData.append('nomorTelepon', formData.nomorTelepon);
      apiFormData.append('email', formData.email);
      apiFormData.append('lokasiVenue', formData.lokasiVenue);
      apiFormData.append('nomorIndukBerusaha', formData.nomorIndukBerusaha);

      // Ambil file dari input
      apiFormData.append('fotoSuratTanah', document.getElementById('fotoSuratTanah').files[0]);
      apiFormData.append('fotoKTP', document.getElementById('fotoKTP').files[0]);
      apiFormData.append('fotoVenue', document.getElementById('fotoVenue').files[0]);

      // Kirim ke backend (ganti URL sesuai endpoint backend kamu)
      const response = await axios.post('http://localhost:3000/api/v1/partnership', apiFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const result = response.data;

      if (response.status === 201 && result.message) {
        setSubmissionMessage({ type: 'success', text: result.message || 'Permohonan partnership berhasil dikirim!' });
        setFormData({ namaPemilik: '', namaVenue: '', npwp: '', nomorTelepon: '', email: '', lokasiVenue: '', nomorIndukBerusaha: '' });
        setFotoSuratTanahFileName('');
        setFotoKTPFileName('');
        setFotoVenueFileName('');
        setErrors({});
        // Redirect ke dashboard setelah 1.5 detik
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setSubmissionMessage({ type: 'error', text: result.message || 'Terjadi kesalahan saat mengirim permohonan.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionMessage({ type: 'error', text: 'Terjadi kesalahan jaringan atau server.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  // // Handler untuk pengiriman formulir
  // const handleSubmit = async (event) => {
  //   event.preventDefault(); // Mencegah perilaku default form submission (reload halaman)
  //   setSubmissionMessage({ type: '', text: '' }); // Hapus pesan sebelumnya

  //   if (!validateForm()) {
  //     setSubmissionMessage({ type: 'error', text: 'Mohon lengkapi semua bidang yang wajib diisi.' });
  //     return; // Hentikan pengiriman jika validasi gagal
  //   }

  //   setIsSubmitting(true); // Atur status loading

  //   // --- LOGIKA PENGIRIMAN FORMULIR SEBENARNYA (Simulasi) ---
  //   try {
  //     // Di aplikasi nyata, Anda akan membuat objek FormData untuk mengirim file
  //     // const apiFormData = new FormData();
  //     // apiFormData.append('namaPemilik', formData.namaPemilik);
  //     // apiFormData.append('fotoSuratTanah', document.getElementById('fotoSuratTanah').files[0]);
  //     // ... tambahkan semua bidang teks dan file lainnya

  //     // Contoh panggilan API (Anda perlu mengganti ini dengan endpoint API Anda yang sebenarnya)
  //     // const response = await fetch('/api/partnership', {
  //     //   method: 'POST',
  //     //   body: apiFormData, // Gunakan apiFormData untuk mengirim file
  //     // });

  //     // const result = await response.json(); // Proses respons dari API

  //     // Simulasi respons sukses dari API
  //     await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi penundaan jaringan
  //     const result = { success: true, message: 'Permohonan partnership berhasil dikirim!' };

  //     if (result.success) {
  //       console.log('Data formulir berhasil dikirim:', {
  //         ...formData,
  //         fotoSuratTanah: fotoSuratTanahFileName,
  //         fotoKTP: fotoKTPFileName,
  //         nomorIndukBerusaha: nomorIndukBerusahaFileName,
  //         fotoVenue: fotoVenueFileName,
  //       });
  //       setSubmissionMessage({ type: 'success', text: result.message });
  //       // Opsional: Reset formulir setelah pengiriman berhasil
  //       setFormData({ namaPemilik: '', npwp: '', nomorTelepon: '', email: '', lokasiVenue: '' });
  //       setFotoSuratTanahFileName('');
  //       setFotoKTPFileName('');
  //       setNomorIndukBerusahaFileName('');
  //       setFotoVenueFileName('');
  //       setErrors({}); // Hapus semua error
  //     } else {
  //       setSubmissionMessage({ type: 'error', text: result.message || 'Terjadi kesalahan saat mengirim permohonan.' });
  //     }
  //   } catch (error) {
  //     console.error('Submission error:', error);
  //     setSubmissionMessage({ type: 'error', text: 'Terjadi kesalahan jaringan atau server.' });
  //   } finally {
  //     setIsSubmitting(false); // Hapus status loading
  //   }
  // };

  // Fungsi helper untuk kelas CSS input file berdasarkan status
  const fileInputClasses = (fileName, error) => `relative border rounded py-2 px-3 text-gray-700 overflow-hidden cursor-pointer
    ${fileName ? 'bg-green-50' : 'bg-gray-50'}
    ${error ? 'border-red-500' : 'border-gray-300'}
    flex items-center`; // Tambahkan flex untuk penataan teks

  const fileTextClasses = (fileName) => `
    ${fileName ? 'text-green-700' : 'text-gray-500'}
    ${fileName ? 'font-medium' : ''}
    truncate`; // Tambahkan truncate untuk teks nama file yang panjang

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      {/* HeaderUser component */}
      {/* Pastikan HeaderUser menerima props yang sesuai atau sesuaikan di sini jika diperlukan */}
      <HeaderUser cartItemCount={0} onCartClick={() => { }} />

      {/* Card Formulir Utama */}
      <div className="bg-white shadow-md rounded-lg p-8 mt-20 w-full max-w-xl"> {/* Lebar card diubah menjadi max-w-xl */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Partnership Gaskeeun</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-6">            {/* Nama Pemilik */}
            <div className="mb-4">
              <label htmlFor="namaPemilik" className="block text-gray-700 text-sm font-bold mb-2">
                Nama Pemilik <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaPemilik"
                value={formData.namaPemilik}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.namaPemilik ? 'border-red-500' : ''}`}
                placeholder="Masukkan nama pemilik usaha"
              />
              {errors.namaPemilik && <p className="text-red-500 text-xs italic mt-1">{errors.namaPemilik}</p>}
            </div>

            {/* Nama Venue */}
            <div className="mb-4">
              <label htmlFor="namaVenue" className="block text-gray-700 text-sm font-bold mb-2">
                Nama Venue <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaVenue"
                value={formData.namaVenue}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.namaVenue ? 'border-red-500' : ''}`}
                placeholder="Masukkan nama venue"
              />
              {errors.namaVenue && <p className="text-red-500 text-xs italic mt-1">{errors.namaVenue}</p>}
            </div>

            {/* Foto Surat Tanah */}
            <div className="mb-4">
              <label htmlFor="fotoSuratTanah" className="block text-gray-700 text-sm font-bold mb-2">
                Foto Surat Tanah <span className="text-red-500">*</span>
              </label>
              <div className={fileInputClasses(fotoSuratTanahFileName, errors.fotoSuratTanah)}>
                <input
                  type="file"
                  id="fotoSuratTanah"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, setFotoSuratTanahFileName, 'fotoSuratTanah')}
                  accept="image/png, image/jpeg, image/jpg"
                />
                <span className={fileTextClasses(fotoSuratTanahFileName)}>
                  {fotoSuratTanahFileName || 'Pilih File (PNG, JPG)'}
                </span>
              </div>
              {errors.fotoSuratTanah && <p className="text-red-500 text-xs italic mt-1">{errors.fotoSuratTanah}</p>}
            </div>

            {/* Foto KTP */}
            <div className="mb-4">
              <label htmlFor="fotoKTP" className="block text-gray-700 text-sm font-bold mb-2">
                Foto KTP <span className="text-red-500">*</span>
              </label>
              <div className={fileInputClasses(fotoKTPFileName, errors.fotoKTP)}>
                <input
                  type="file"
                  id="fotoKTP"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, setFotoKTPFileName, 'fotoKTP')}
                  accept="image/png, image/jpeg, image/jpg"
                />
                <span className={fileTextClasses(fotoKTPFileName)}>
                  {fotoKTPFileName || 'Pilih File (PNG, JPG)'}
                </span>
              </div>
              {errors.fotoKTP && <p className="text-red-500 text-xs italic mt-1">{errors.fotoKTP}</p>}
            </div>

            {/* NPWP */}
            <div className="mb-4">
              <label htmlFor="npwp" className="block text-gray-700 text-sm font-bold mb-2">
                NPWP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="npwp"
                value={formData.npwp}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.npwp ? 'border-red-500' : ''}`}
                placeholder="Masukkan nomor NPWP Anda"
              />
              {errors.npwp && <p className="text-red-500 text-xs italic mt-1">{errors.npwp}</p>}
            </div>

            {/* Nomor Induk Berusaha */}
            <div className="mb-4">
              <label htmlFor="nomorIndukBerusaha" className="block text-gray-700 text-sm font-bold mb-2">
                Nomor Induk Berusaha <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nomorIndukBerusaha"
                value={formData.nomorIndukBerusaha}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.nomorIndukBerusaha ? 'border-red-500' : ''}`}
                placeholder="Masukkan nomor Induk Berusaha Anda"
              />
              {errors.nomorIndukBerusaha && <p className="text-red-500 text-xs italic mt-1">{errors.nomorIndukBerusaha}</p>}
            </div>

            {/* Foto Venue */}
            <div className="mb-4">
              <label htmlFor="fotoVenue" className="block text-gray-700 text-sm font-bold mb-2">
                Foto Venue <span className="text-red-500">*</span>
              </label>
              <div className={fileInputClasses(fotoVenueFileName, errors.fotoVenue)}>
                <input
                  type="file"
                  id="fotoVenue"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, setFotoVenueFileName, 'fotoVenue')}
                  accept="image/png, image/jpeg, image/jpg"
                />
                <span className={fileTextClasses(fotoVenueFileName)}>
                  {fotoVenueFileName || 'Pilih File (PNG, JPG)'}
                </span>
              </div>
              {errors.fotoVenue && <p className="text-red-500 text-xs italic mt-1">{errors.fotoVenue}</p>}
            </div>

            {/* Nomor Telepon (WA) */}
            <div className="mb-4">
              <label htmlFor="nomorTelepon" className="block text-gray-700 text-sm font-bold mb-2">
                Nomor Telepon (WA) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="nomorTelepon"
                value={formData.nomorTelepon}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.nomorTelepon ? 'border-red-500' : ''}`}
                placeholder="e.g., +6281234567890"
              />
              {errors.nomorTelepon && <p className="text-red-500 text-xs italic mt-1">{errors.nomorTelepon}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
            </div>

            {/* Lokasi Venue */}
            <div className="mb-4">
              <label htmlFor="lokasiVenue" className="block text-gray-700 text-sm font-bold mb-2">
                Lokasi Venue <span className="text-red-500">*</span>
              </label>
              <textarea
                id="lokasiVenue"
                value={formData.lokasiVenue}
                onChange={handleChange}
                rows="3"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lokasiVenue ? 'border-red-500' : ''}`}
                placeholder="Alamat lengkap venue Anda..."
              />
              {errors.lokasiVenue && <p className="text-red-500 text-xs italic mt-1">{errors.lokasiVenue}</p>}
            </div>

            {/* Pesan Feedback Pengiriman */}
            {submissionMessage.text && (
              <div className={`mt-4 p-3 rounded text-center ${submissionMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {submissionMessage.text}
              </div>
            )}

            {/* Tombol Submit */}
            <div className="flex items-center justify-center mt-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
                disabled={isSubmitting} // Menonaktifkan tombol saat sedang mengirim
              >
                {isSubmitting ? 'Mengirim...' : 'Submit Partnership'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPartner;