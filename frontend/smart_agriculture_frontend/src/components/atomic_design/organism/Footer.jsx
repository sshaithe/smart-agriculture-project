// src/components/atomic_design/organism/Footer.jsx
import React from "react";

// Not: Gerçek uygulamada, React Router kullanıyorsanız, 
// bu <a> etiketlerini <Link to="..."> olarak değiştirmelisiniz.

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    // Arka planı koyu gri (bg-gray-900) ve gölgeyi belirginleştirdik
    <footer className="w-full bg-gray-800 shadow-xl">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-6 md:py-8">
        
        {/* Üst Bölüm: Logo ve Navigasyon Bağlantıları */}
        <div className="sm:flex sm:items-center sm:justify-between">
          
          {/* Logo Alanı */}
          <a href="#" className="flex items-center gap-3 mb-4 sm:mb-0">
            <img
              alt="Flowbite Logo"
              // Koyu arka planda daha iyi görünmesi için h-8 ve filtre uygulandı
              className="h-8 filter brightness-150" 
              src="https://flowbite.com/docs/images/logo.svg"
            />
            {/* Marka Adı: Vurgu rengi ve metin boyutu güncellendi */}
            <span className="text-2xl font-extrabold whitespace-nowrap text-indigo-400">
              Smart
              <span className="text-white"> Agriculture</span>
            </span>
          </a>

          {/* Navigasyon Bağlantıları */}
          <ul className="flex flex-wrap items-center text-sm font-medium text-gray-400 gap-x-6 md:gap-x-8">
            <li>
              <a 
                href="#" 
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Licensing
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />

        <span className="block text-sm text-gray-500 sm:text-center">
          © {year}{" "}
          <span className="font-semibold text-white hover:text-indigo-400 transition-colors duration-200">
            Smart Agriculture
          </span>
          . All rights reserved.
        </span> */}
      </div>
    </footer>
  );
};

export default Footer;