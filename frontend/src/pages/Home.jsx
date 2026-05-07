import { useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Clock3, Image, UserRoundSearch } from "lucide-react";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import { markSectionVisited } from "../services/api";

const features = [
  {
    icon: BrainCircuit,
    title: "Interaktiv o'rganish",
    text: "Murakkab arxitektura mavzulari AI yordamida sodda va qiziqarli tushuntiriladi."
  },
  {
    icon: Clock3,
    title: "24/7 yordam",
    text: "Chatbot orqali istalgan vaqtda savol berish va javob olish imkoniyati."
  },
  {
    icon: Image,
    title: "Rasm orqali tushuntirish",
    text: "Qurilma rasmlarini yuklab, ularning vazifasi bo'yicha mock AI tahlil olish."
  },
  {
    icon: UserRoundSearch,
    title: "Individual yondashuv",
    text: "Har bir talabaga moslashtirilgan tushuntirish va tavsiyalar."
  }
];

const stats = [
  { value: "10+", label: "Interaktiv sahifalar" },
  { value: "24/7", label: "AI yordam va chat" },
  { value: "8", label: "Asosiy arxitektura mavzusi" },
  { value: "100%", label: "Mobile-friendly dizayn" }
];

function Home() {
  useEffect(() => {
    markSectionVisited("Bosh sahifa");
  }, []);

  return (
    <>
      <Hero />
      <section className="container-shell pb-16">
        <div className="mb-8">
          <h2 className="section-title">Platforma afzalliklari</h2>
          <p className="section-subtitle">
            Zamonaviy ta'lim jarayonini kuchaytiruvchi AI funksiyalari orqali
            kompyuter arxitekturasini samarali o'rganing.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} text={item.text} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-7 sm:p-10"
        >
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Natijalar statistikasi</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-indigo-700">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default Home;
