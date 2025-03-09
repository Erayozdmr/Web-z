import React from "react";
import { AiOutlineDesktop } from "react-icons/ai"; // Örnek ikonlar
import { FaRegCreditCard } from "react-icons/fa";
import { IoMdRocket } from "react-icons/io";
const ServiceCard = ({ title, description, icon }) => {
  return (
    <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-6 transition-all duration-300 hover:transform hover:scale-105 hover:translate-y-[-10px] hover:bg-fuchsia-100">
      <div className="flex items-center justify-center mb-4">
        <div className="text-5xl text-fuchsia-600 mr-4 transition-transform duration-300 hover:scale-125">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        {title}
      </h3>
      <p className="text-base text-gray-600 text-center">{description}</p>
    </div>
  );
};

const ServicesPage = () => {
  return (
    <div
      id="hizmetlerimiz"
      className="relative py-16 px-6 bg-fuchsia-600 overflow-hidden"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-12">
        Sunduğumuz Hizmetler
      </h2>

      {/* Arka plandaki toplar */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white opacity-20 rounded-full animate-floating"
            style={{
              width: `${Math.random() * 50 + 30}px`,
              height: `${Math.random() * 50 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Kartlar */}
      <div className="flex flex-wrap justify-center gap-8 z-20 relative">
        <ServiceCard
          icon={<AiOutlineDesktop />}
          title="Web Tasarımı"
          description="Özel ve kullanıcı dostu web siteleri tasarlıyoruz. Markanızı en iyi şekilde dijital dünyada temsil etmek için modern çözümler sunuyoruz."
        />
        <ServiceCard
          icon={<FaRegCreditCard />}
          title="Google ADS"
          description="Reklamlarla hedef kitlenize ulaşmanızı ve istediğiniz popülerliği kazandırıyoruz"
        />
        <ServiceCard
          icon={<IoMdRocket />}
          title="Ceo Optimizasyonu"
          description="Web sitenizi sadece tasarlamakla kalmıyor, aynı zamanda SEO, sosyal medya ve reklam yönetimi gibi dijital pazarlama hizmetleriyle de destekliyoruz."
        />
      </div>

      {/* Tailwind için animasyon */}
      <style>
        {`
          @keyframes floating {
            0% { transform: translateX(-100vw); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translateX(100vw); opacity: 0; }
          }
          .animate-floating {
            animation: floating linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ServicesPage;
