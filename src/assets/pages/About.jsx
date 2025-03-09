import React, { useState, useEffect } from "react";
import AboutImage from "../images/About1.png";
import AboutImage2 from "../images/Abput2.jpg";
import { useInView } from "react-intersection-observer"; // Kartların ekrana gelmesini kontrol etmek için
import { AiOutlineFundProjectionScreen } from "react-icons/ai"; // İkonu içeri aktar
import { GoPeople } from "react-icons/go"; // İkinci kartın ikonu
import { FaRegStar } from "react-icons/fa";

const Card = ({ title, number, icon }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true, // Kart bir kez görünür olunca animasyonu başlatır
    threshold: 0.5, // Kartın yarısı görünür olursa başlar
  });

  // Sayı artışı
  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount < number) {
            return prevCount + 1;
          }
          clearInterval(interval); // Sayıya ulaşıldığında durdur
          return prevCount;
        });
      }, 50); // Sayıyı 50ms'lik aralıklarla arttırıyoruz
    }
  }, [inView, number]);

  return (
    <div
      ref={ref}
      className="w-full md:w-1/3 p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-6"
    >
      <div className="flex items-center justify-center mb-4">
        {/* İkon */}
        <div className="text-3xl text-fuchsia-600 mr-4">
          {icon} {/* Burada icon prop'u üzerinden gelen ikonu kullanıyoruz */}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-4xl font-bold text-fuchsia-600 mt-4">{count}</div>
    </div>
  );
};

const About = () => {
  return (
    <div id="hakkimizda">
      {/* Üstteki kısım */}
      <div className="border-t-2 border-b-2 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-16 bg-gray-100">
        {/* Sol tarafta görsel */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={AboutImage}
            alt="Biz Kimiz"
            className="rounded-lg shadow-lg w-full max-w-[500px]"
          />
        </div>

        {/* Sağ tarafta metin */}
        <div className="md:w-1/2 md:pl-12 text-gray-800 text-center md:text-left mt-6 md:mt-0">
          <h1 className="text-4xl font-bold text-fuchsia-600 mb-6">
            Biz Kimiz?
          </h1>
          <p className="text-base leading-relaxed">
            Web-Öz olarak, modern ve yenilikçi web tasarım hizmetleri sunuyoruz.
            Profesyonel ekibimizle, işletmenize özel, kullanıcı dostu ve estetik
            açıdan güçlü web siteleri geliştiriyoruz. Markanızı dijital dünyada
            ön plana çıkarmak için buradayız!
          </p>
        </div>
      </div>

      {/* Alttaki kısım */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between px-6 md:px-10 py-10 md:py-16 bg-gray-100">
        {/* Sağ tarafta görsel */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={AboutImage2}
            alt="Biz Kimiz"
            className="rounded-lg shadow-lg w-full max-w-[500px]"
          />
        </div>

        {/* Sol tarafta metin */}
        <div className="md:w-1/2 md:pr-12 text-gray-800 text-center md:text-left mt-6 md:mt-0">
          <h1 className="text-4xl font-bold text-fuchsia-600 mb-6">
            Neden Bizi Tercih Etmelisiniz?
          </h1>
          <p className="text-base leading-relaxed">
            Web-Öz olarak, işinizi dijital dünyada bir adım öne taşımak için
            buradayız. Müşterilerimize sadece estetik açıdan mükemmel değil,
            aynı zamanda kullanıcı dostu ve işlevsel web siteleri sunuyoruz.
            Sizin için en doğru çözümleri sunmak adına her projeye özel, özgün
            tasarımlar yaratıyor ve her detayda mükemmelliği hedefliyoruz.
          </p>
          <h3 className="text-2xl font-bold text-fuchsia-600 mt-6 mb-6">
            Neden Web-Öz?
          </h3>
          <p className="text-base leading-relaxed">
            Yenilikçi Tasarımlar: Sizi ve markanızı en iyi şekilde temsil edecek
            modern ve şık web tasarımları. Kullanıcı Odaklı Yaklaşım: Web
            sitenizin ziyaretçileri için kolay navigasyon, hızlı yükleme süresi
            ve mükemmel kullanıcı deneyimi. SEO Dostu Yapılar: Web sitenizi
            arama motorlarında üst sıralara taşıyacak, SEO uyumlu altyapılar.
            Hızlı ve Güvenilir Destek: Her adımda yanınızdayız. Projeniz bitse
            de, her zaman güvenilir bir destek sunuyoruz. Mobil Uyumlu
            Tasarımlar: Web sitenizin her platformda mükemmel görünmesini
            sağlıyoruz. Web-Öz, sadece bir web sitesi değil, markanızı dijital
            dünyada parlatan bir çözüm ortağınızdır. Sizinle işbirliği yaparak,
            işinizi büyütmek için sabırsızlanıyoruz!
          </p>
        </div>
      </div>

      {/* Deneyimlerimiz Başlığı ve Kartlar */}
      <div className="py-16  px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-fuchsia-600 mb-12">
          Deneyimlerimiz
        </h2>
        <div className="flex flex-wrap justify-center  gap-8">
          {/* "Bitirilen Projeler" kartına ikon ekliyoruz */}
          <Card
            icon={<AiOutlineFundProjectionScreen />} // Bu kartın ikonu
            title="Bitirilen Projeler"
            number={40}
          />
          {/* "Müşteri Memnuniyeti" kartının ikonunu değiştiriyoruz */}
          <Card
            icon={<GoPeople />} // İkinci kartın ikonu olarak GoPeople'i kullanıyoruz
            title="Müşteri Memnuniyeti"
            number={150}
          />
          <Card icon={<FaRegStar />} title="Yıllık Deneyim" number={10} />
        </div>
      </div>
    </div>
  );
};

export default About;
