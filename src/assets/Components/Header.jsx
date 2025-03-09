import React, { useState } from "react";
import Logo from "../images/LOGO.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="flex border-b border-gray-300 py-3 px-4 sm:px-10 bg-white min-h-[65px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between w-full max-w-screen-xl mx-auto">
        {/* Logo */}
        <a href="#" className="max-sm:hidden">
          <img
            src={Logo}
            alt="logo"
            className="w-[150px] border rounded-full"
          />
        </a>
        <a href="#" className="hidden max-sm:block">
          <img src={Logo} alt="logo" className=" " width={120} height={100} />
        </a>

        {/* Menü - Büyük ekranda yatay, küçük ekranda açılır kapanır */}
        <div
          id="collapseMenu"
          className={`lg:flex lg:gap-x-5 ${
            isOpen ? "block" : "hidden"
          } max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50`}
        >
          {/* Kapatma Butonu (Mobil İçin) */}
          <button
            id="toggleClose"
            className="lg:hidden absolute top-4 right-4 rounded-full bg-white w-9 h-9 flex items-center justify-center border"
            onClick={handleClick}
          >
            ✖
          </button>

          {/* Menü Öğeleri */}
          <ul className="lg:flex lg:gap-x-5 max-lg:space-y-3">
            {["Anasayfa", "Hakkımızda", "Hizmetlerimiz", "İletişim"].map(
              (item, index) => (
                <li key={index} className="px-3">
                  <a
                    href={
                      item === "Hakkımızda"
                        ? "#hakkimizda"
                        : item === "Hizmetlerimiz"
                        ? "#hizmetlerimiz"
                        : item === "İletişim"
                        ? "#iletişim"
                        : "#"
                    }
                    className="font-medium text-slate-900 block text-[15px] hover:text-fuchsia-600"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Sağ Taraftaki Arama ve Menü Butonu */}
        <div className="flex items-center gap-4">
          {/* Menü Açma Butonu (Mobil İçin) */}
          <button className="lg:hidden" onClick={handleClick}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
