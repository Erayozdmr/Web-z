import React from "react";
import Banner from "../images/1Banner.png";

const Home = () => {
  return (
    <div className="relative overflow-hidden bg-fuchsia-600 w-full h-screen flex flex-col md:flex-row text-white justify-center md:justify-between items-center px-6 md:px-20">
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

      {/* Sol tarafta metin */}
      <div className="w-full md:w-1/2 relative z-10 text-center md:text-left animate-slideInFromBottom">
        <h1 className="mb-5 text-3xl md:text-5xl font-bold">Web-Öz</h1>
        <h2 className="text-lg md:text-xl">
          Web Tasarım Ve Danışmanlık Hizmetleri
        </h2>
        <p className="mt-4 text-base md:text-lg">
          Web Tasarım Ve Danışmanlık İşlemlerinizde Profesyonel Hizmetler
          Sunuyoruz.
        </p>

        <button className="cursor-pointer mt-8 bg-white text-fuchsia-600 px-6 py-2 rounded-lg font-bold hover:bg-fuchsia-600 hover:text-white duration-1000 border-2">
          <a href="#iletişim"> İletişim</a>
        </button>
      </div>

      {/* Sağ tarafta görsel */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10 mt-4 md:mt-0">
        <img
          src={Banner}
          alt="Banner"
          className="bg-fuchsia-300 shadow-2xl rounded-full w-full md:w-auto"
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

          @keyframes slideInFromBottom {
            0% {
              transform: translateY(50px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .animate-slideInFromBottom {
            animation: slideInFromBottom 1s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
