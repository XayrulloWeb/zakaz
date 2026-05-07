import { useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircleQuestion, Upload, FileCheck2, Sparkles, SearchCheck } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import { markSectionVisited } from "../services/api";

const guideCards = [
  {
    icon: MessageCircleQuestion,
    title: "Savol berish",
    text: "AI chatbotga aniq savollar berib, mavzuni qadam-baqadam o'rganing."
  },
  {
    icon: Upload,
    title: "Rasm yuklash",
    text: "Kompyuter qismlarini rasm orqali yuklab, ularning vazifasini tahlil qildiring."
  },
  {
    icon: FileCheck2,
    title: "Test tuzish",
    text: "AI yordamida mavzu bo'yicha qisqa testlar yaratib, o'z bilimingizni tekshiring."
  },
  {
    icon: Sparkles,
    title: "Mavzuni soddalashtirish",
    text: "Murakkab tushunchalarni oddiy misollar va real analogiyalar bilan tushuntiring."
  },
  {
    icon: SearchCheck,
    title: "Xatolarni tahlil qilish",
    text: "AI noto'g'ri javoblar sababini ko'rsatib, to'g'ri yondashuvni tavsiya qiladi."
  }
];

function AIGuide() {
  useEffect(() => {
    markSectionVisited("AI qo'llanma");
  }, []);

  return (
    <section className="container-shell py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title">Sun'iy intellektdan foydalanish bo'yicha qo'llanma</h1>
        <p className="section-subtitle">
          Sun'iy intellekt nima, ta'limda qanday yordam beradi va kompyuter
          arxitekturasini o'rganishda qanday ishlatilishini ushbu bo'limda
          batafsil ko'rib chiqamiz.
        </p>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Sun'iy intellekt nima?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sun'iy intellekt (AI) kompyuter tizimining inson fikrlashiga o'xshash
            qarorlar qabul qilishi, savollarga javob berishi va ma'lumotlarni
            tahlil qilishi demakdir.
          </p>
        </article>
        <article className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Ta'limda AI qanday yordam beradi?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            AI talabaning savoliga tez javob beradi, mavzuni darajaga moslab
            tushuntiradi va o'qitish jarayonini interaktiv qiladi.
          </p>
        </article>
        <article className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Kompyuter arxitekturasida AI qanday ishlatiladi?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            CPU, RAM, GPU, Cache, Bus System kabi tushunchalarni AI chatbot
            orqali savol-javob shaklida osonroq o'rganish mumkin.
          </p>
        </article>
        <article className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">AI'dan to'g'ri foydalanish qoidalari</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>- Savolni aniq va qisqa yozing.</li>
            <li>- Javobni tekshirib, qo'shimcha savol bilan chuqurlashtiring.</li>
            <li>- Rasm yuborganda qurilma nomi haqida taxmin ham yozing.</li>
            <li>- Nazariyani amaliy mashq bilan mustahkamlang.</li>
          </ul>
        </article>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {guideCards.map((card) => (
          <FeatureCard key={card.title} icon={card.icon} title={card.title} text={card.text} />
        ))}
      </div>
    </section>
  );
}

export default AIGuide;
