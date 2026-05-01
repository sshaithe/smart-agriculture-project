// src/components/atomic_design/template/Layout.jsx

import React from "react";
// React Router'dan Outlet'i içeri aktarın
import { Outlet } from "react-router-dom"; 
import SideBar from "../organism/SideBar";
import Footer from "../organism/Footer";
import "../../../routing/route";

// Layout bileşeni artık children prop'unu beklemiyor
const Layout = () => {
    return (
        // flex min-h-screen ile tüm sayfayı kaplayın
        <div className="flex min-h-screen bg-gray-100">
            {/* 1. Sol sabit sidebar */}
            {/* Sidebar'ınız fixed olduğu için flex konteynerin dışına yerleştirin */}
            <SideBar />

            {/* 2. Sağ taraf: içerik + footer */}
            {/* sm:ml-64 (Sidebar genişliği kadar boşluk bırakır) ve flex-col ile dikey hizalama */}
            <div className="sm:ml-64 flex flex-col flex-1"> 
                
                {/* İçerik alanı (flex-1 ile kalan tüm dikey alanı kaplar) */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="w-full max-w-7xl mx-auto">
                        {/* Dinamik sayfalar Outlet ile yüklenir */}
                        <Outlet /> 
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;