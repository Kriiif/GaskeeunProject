import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { HeaderUser } from '../../components/header-user';
import { Link } from 'react-router-dom';

const PartnershipPage = () => {
    const { user } = useAuth(); // Mengambil data user dari context
    return(
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Header section */}
            <HeaderUser/>
            {/* Main Content */}
            <div className="container mx-auto p-6 pt-[100px]">
                {/* Page title */}
                <div className="flex justify-around items-center max-h-[103px] max-w-[500px] mx-auto mt-10">
                    <h2 className='text-2xl pr-[10px]'><b>Partnership with </b></h2>
                    <img src="/logos/mukaijotext.png" alt="Text" className='max-w-[200px] max-h-[103px] pr-[10px]'/>
                    <img src="/logos/mukaijologos.png" alt="Logo" className='max-w-[59px] rotate-15'/>
                </div>
                <hr className="my-1 max-w-[500px] mx-auto border-black"/>
                {/* Page description 1 */}
                <div className="flex mx-auto pt-[50px] max-w-[1695px] max-h-[436px]">
                    <img src="/partnership/1.png" alt="" className='max-w-[454px] max-h-[236px] mr-[94px] rounded-[10px] shadow-[1px_3px_3px_3px_rgba(0,0,0,0.25)]'/>
                    <p className='text-l'>Bergabunglah dengan program partnership <b>Gaskeeun</b> dan jadikan lapangan olahraga Anda lebih produktif setiap harinya! <b>Gaskeeun</b> adalah platform terpercaya untuk penyewaan lapangan olahraga seperti futsal, badminton, tenis, dan berbagai jenis olahraga lainnya. Dengan menjadi mitra kami, Anda akan memperluas jangkauan pasar secara digital dan menjangkau lebih banyak penyewa potensial tanpa perlu repot promosi manual.</p>
                </div>
                {/* Page description 2 */}
                <div className="flex mx-auto pt-[50px] max-w-[1695px] max-h-[436px]">
                    <p>Melalui program ini, pemilik lapangan akan mendapatkan berbagai keuntungan menarik. Salah satunya adalah kemudahan dalam memantau reservasi dan kunjungan lapangan secara real-time melalui dashboard <b>Gaskeeun</b>. Tak hanya itu, Anda juga dapat melacak pendapatan harian, mingguan, maupun bulanan dengan transparan. Semua data disajikan secara akurat dan praktis untuk membantu Anda mengambil keputusan bisnis yang lebih tepat.</p>
                    <img src="/partnership/2.png" alt="" className='max-w-[454px] max-h-[236px] ml-[94px] rounded-[10px] shadow-[1px_3px_3px_3px_rgba(0,0,0,0.25)]'/>
                </div>
                {/* Page description 3 */}
                <div className="pt-[50px] mx-auto max-w-[1695px] max-h-[436px]">
                    <img src="/partnership/3.png" alt="" className='mx-auto max-w-[454px] max-h-[236px] mb-[20px] rounded-[10px] shadow-[1px_3px_3px_3px_rgba(0,0,0,0.25)]'/>
                    <p className='text-center'>Jangan lewatkan kesempatan untuk meningkatkan pendapatan dan visibilitas lapangan Anda. Dengan dukungan teknologi dari Gaskeeun, pengelolaan lapangan menjadi lebih efisien, profesional, dan modern. Segera daftarkan lapangan Anda dan rasakan kemudahan serta manfaat menjadi partner resmi <b>Gaskeeun</b>.</p>
                </div>

                {/* button untuk ke form apply partnership */}
                <Link to={user ? "/form-partner" : "/login"} className='flex justify-center my-[50px] mx-auto bg-[#FD2F2F] text-white px-[43px] py-[19px] rounded'><b>Gaskeeun Apply!</b></Link>
            </div>
        </div>
    )
}

export default PartnershipPage;