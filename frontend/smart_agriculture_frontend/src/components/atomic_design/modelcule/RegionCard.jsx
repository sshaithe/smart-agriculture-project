import React from 'react';
import { useNavigate } from 'react-router-dom';
// ⚠️ Buradaki hatalı import satırını SİLİN
// import { region } from '../../../features/map_model'; 

// 1. Bileşen, dışarıdan 'region' objesini PROP olarak almalı
const RegionCard = ({ region, onClick }) => { 
    const navigate = useNavigate();

    // region objesi prop olarak geldiği için artık kullanılabilir.
    const handleCardClick = () => {
        // Detay sayfasına yönlendirme
        navigate(`/regions/${region.id}`); 
    };
    
    // Her karta farklı bir renk vermek için basit bir sınıf ataması
    const colorClasses = {
        marmara: "bg-green-500 hover:bg-green-600",
        icanadolu: "bg-yellow-500 hover:bg-yellow-600",
        karadeniz: "bg-blue-500 hover:bg-blue-600",
        ege: "bg-red-500 hover:bg-red-600",
        akdeniz: "bg-orange-500 hover:bg-orange-600",
        guneydoguanadolu: "bg-purple-500 hover:bg-purple-600",
        doguanadolu: "bg-gray-500 hover:bg-gray-600"
    };

    return (
        <div 
            // region.id'ye artık güvenle erişebilirsiniz
            className={`p-4 md:p-6 rounded-xl shadow-lg text-white cursor-pointer transition duration-300 ${colorClasses[region.id] || 'bg-gray-700'}`}
            onClick={handleCardClick}
        >
            <h3 className="text-xl font-bold mb-2">{region.name}</h3>
            <p className="text-sm">
                {/* region objesi props'tan geldiği için bu alanlar da çalışır */}
                {/* Tahmini: {region.top_crops ? region.top_crops.join(', ') : 'Veri yükleniyor...'} */}
            </p>
            <span className="text-xs mt-3 block opacity-80">Detaylar için tıklayın</span>
        </div>
    );
};

export default RegionCard;