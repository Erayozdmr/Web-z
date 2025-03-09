import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Logo from "../images/LOGO.png"; // Şirket logosu
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa"; // React Icons'dan telefon ve e-posta simgeleri

export const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    emailjs
      .sendForm("service_zwzan0z", "template_s1p113a", form.current, {
        publicKey: "wwVJlhwicZrvl1Y5O",
      })
      .then(
        () => {
          setSubmitSuccess(true);
          setIsSubmitting(false);
        },
        (error) => {
          console.log("FAILED...", error.text);
          setIsSubmitting(false);
        }
      );
  };

  return (
    <div
      id="iletişim"
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-fuchsia-600 to-pink-600 pt-20 relative overflow-hidden px-6 md:px-20"
    >
      {/* Arka Planda Topların Hareketi */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br opacity-30 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full z-0 animate-moveBalls">
        <div
          className="absolute top-10 left-0 w-12 h-12 bg-white rounded-full animate-moveRight"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-20 left-10 w-12 h-12 bg-white rounded-full animate-moveRight"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-10 left-20 w-12 h-12 bg-white rounded-full animate-moveRight"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-30 w-12 h-12 bg-white rounded-full animate-moveRight"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="mt-5 mb-20 flex w-full max-w-7xl p-10 bg-white rounded-3xl shadow-xl space-y-10 md:space-y-0 md:space-x-10 md:flex-row flex-col relative z-10">
        {/* Sol Taraf - Logo ve Yazı */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-8 mb-10 md:mb-2">
          <img
            src={Logo}
            alt="Company Logo"
            className="object-contain w-full max-w-[300px] mx-auto"
          />

          {/* İletişim Bilgileri - Logo Altına */}
          <div className="flex flex-col items-center space-y-4 mt-5">
            <div className="flex items-center space-x-2 ">
              <FaPhoneAlt size={20} /> {/* Telefon simgesi */}
              <span>(+90) 551 112 7128</span>{" "}
              {/* Telefon numarasını buraya ekleyin */}
            </div>
            <div className="flex items-center space-x-2 ">
              <FaEnvelope size={20} /> {/* E-posta simgesi */}
              <span>weboz5756@gmail.com</span>{" "}
              {/* E-posta adresini buraya ekleyin */}
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Form */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="flex-1 space-y-6 p-10 bg-white rounded-2xl shadow-lg border-2 border-fuchsia-600"
        >
          <h3 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500">
            Hızlı Fiyat Teklifi Alın!
          </h3>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Adınız
            </label>
            <input
              type="text"
              name="user_name"
              className="w-full p-5 border-2 border-transparent rounded-2xl bg-gray-100 focus:bg-white focus:border-fuchsia-600 focus:ring-2 focus:ring-fuchsia-600 transition-all transform hover:scale-105 hover:shadow-lg hover:ring-fuchsia-300 focus:outline-none"
              placeholder="Adınızı girin"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="user_email"
              className="w-full p-5 border-2 border-transparent rounded-2xl bg-gray-100 focus:bg-white focus:border-fuchsia-600 focus:ring-2 focus:ring-fuchsia-600 transition-all transform hover:scale-105 hover:shadow-lg hover:ring-fuchsia-300 focus:outline-none"
              placeholder="E-posta adresinizi girin"
              required
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Mesajınız
            </label>
            <textarea
              name="message"
              className="w-full p-5 border-2 border-transparent rounded-2xl bg-gray-100 focus:bg-white focus:border-fuchsia-600 focus:ring-2 focus:ring-fuchsia-600 transition-all transform hover:scale-105 hover:shadow-lg hover:ring-fuchsia-300 focus:outline-none"
              rows="6"
              placeholder="Mesajınızı yazın"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-2xl transform transition duration-500 hover:scale-110 hover:bg-gradient-to-r hover:from-fuchsia-700 hover:to-pink-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Gönderiliyor..."
              : submitSuccess
              ? "Gönderildi!"
              : "Mesaj Gönder"}
          </button>
        </form>
      </div>

      {/* Animasyon için ek stil */}
      <style>
        {`
          @keyframes moveRight {
            0% { transform: translateX(-100vw); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translateX(100vw); opacity: 0; }
          }
          .animate-moveRight {
            animation: moveRight 10s linear infinite;
          }
          @keyframes moveBalls {
            0% { transform: translateX(-50vw); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translateX(50vw); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};
