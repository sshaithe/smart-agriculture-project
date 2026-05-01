import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from "../../../api/AuthService";

// Simge yer tutucuları (SVG'ler aynı kalır)

// Dashboard Icon
const DashboardIcon = (
  <svg className="w-5 h-5 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

// Home Icon
const HomeIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0v-4"
    />
  </svg>
);

// Örnek Simge: About (Bilgi)
const AboutIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Icon: History Data
const HistoryIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

// Yeni Simge: Services (Hizmetler)
const ServicesIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// Yeni Simge: Contact (İletişim)
const ContactIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M3 8l7.8 5.2a2 2 0 002.4 0L21 8m-2 10a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2h10a2 2 0 012 2v10z"
    />
  </svg>
);

// Örnek Simge: Sign In (Giriş) - En altta kullanılacak
const SignInIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-2l1-1h13V12"
    />
  </svg>
);

// Profile Icon
const ProfileIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Logout Icon
const LogoutIcon = (
  <svg 
    className="w-5 h-5 transition duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

// SideBarLink bileşeni artık 'to' prop'unu alıyor ve <Link> kullanıyor
const SideBarLink = ({ to, icon, label, isActive, onClick }) => (
  <li>
    {/* <a> etiketini <Link> ile değiştiriyoruz */}
    {onClick ? (
      <button
        onClick={onClick}
        className={`
          w-full flex items-center p-2 text-base font-semibold rounded-lg transition-all duration-200 group
          text-gray-200 hover:bg-gray-700 hover:text-white
        `}
      >
        <span className="text-gray-400 group-hover:text-white w-6 h-6 me-3">
          {icon}
        </span>
        <span className="flex-1 ms-3 whitespace-nowrap text-left">{label}</span>
      </button>
    ) : (
      <Link
        to={to}
        className={`
          flex items-center p-2 text-base font-semibold rounded-lg transition-all duration-200 group
          ${isActive 
            ? 'text-white bg-green-700 shadow-lg' 
            : 'text-gray-200 hover:bg-gray-700 hover:text-white'
          }
        `}
      >
        <span className={`
            ${isActive ? 'text-indigo-300' : 'text-gray-400 group-hover:text-white'} 
            w-6 h-6 me-3
          `}>
          {icon}
        </span>
        <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
      </Link>
    )}
  </li>
);

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  // Reactively track auth state
  const [isLoggedIn, setIsLoggedIn] = React.useState(authService.isAuthenticated());
  const [user, setUser] = React.useState(authService.getUser());

  React.useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(authService.isAuthenticated());
      setUser(authService.getUser());
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/sign-in");
  };

  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0 shadow-2xl"
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col bg-gray-700 border-r border-gray-700">
        
        {/* Üst Kısım: Logo ve Ana Menü Öğeleri (flex-grow ile tüm boş alanı kaplar) */}
        <div className="px-3 py-4 overflow-y-auto flex-grow">
          
          {/* Logo/Başlık kısmı */}
          <div className="pb-4 mb-4 border-b border-gray-700">
            <span className="text-2xl font-extrabold text-green-400">
              Smart 
              <span className="text-white"> Agriculture</span>
            </span>
          </div>

          <ul className="space-y-2">
            <SideBarLink 
              to="/dashboard" 
              icon={DashboardIcon} 
              label="AI Dashboard" 
              isActive={path === "/dashboard"}
            />
            {/* to="/" Ana Sayfa (Dashboard) */}
            <SideBarLink 
              to="/" 
              icon={HomeIcon} 
              label="Home" 
              isActive={path === "/"}
            />
            {/* to="/services" Services */}
            <SideBarLink 
              to="/service" 
              icon={ServicesIcon} 
              label="Map Services" 
              isActive={path === "/service"} 
            />
            {/* to="/history-data" History Data */}
            <SideBarLink 
              to="/background" 
              icon={HistoryIcon} 
              label="History Data" 
              isActive={path === "/background"}
            />
            {/* to="/about" About */}
            <SideBarLink 
              to="/about" 
              icon={AboutIcon} 
              label="About" 
              isActive={path === "/about"}
            />
            {/* to="/contact" Contact */}
            <SideBarLink 
              to="/contact" 
              icon={ContactIcon} 
              label="Contact" 
              isActive={path === "/contact"} 
            />
          </ul>
        </div>
        
        {/* Alt Kısım: Auth area - dynamic based on login state */}
        <div className="px-3 py-4 border-t border-gray-600 bg-gray-800/50">
          {isLoggedIn ? (
            <>
              {/* User info mini */}
              <div className="px-2 mb-3">
                <p className="text-white text-sm font-semibold truncate">{user?.username || user?.email || "User"}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              </div>
              <ul className="space-y-2">
                <SideBarLink 
                  to="/profile" 
                  icon={ProfileIcon} 
                  label="My Profile" 
                  isActive={path === "/profile"}
                />
                <SideBarLink 
                  icon={LogoutIcon} 
                  label="Logout" 
                  onClick={handleLogout}
                />
              </ul>
            </>
          ) : (
            <ul className="space-y-2">
              {/* to="/sign-in" Sign In */}
              <SideBarLink 
                to="/sign-in" 
                icon={SignInIcon} 
                label="Sign In" 
                isActive={path === "/sign-in"}
              />
            </ul>
          )}
        </div>

      </div>
    </aside>
  );
};

export default SideBar;