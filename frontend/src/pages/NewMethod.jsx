import { useEffect } from "react";
import { Brain, Clock, FileSpreadsheet, ImagePlus, MessageSquareMore, UserRound } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import ComparisonTable from "../components/ComparisonTable";
import { markSectionVisited } from "../services/api";

const methodCards = [
  {
    icon: MessageSquareMore,
    title: "Chatbot orqali savol-javob",
    text: "Talaba istalgan vaqtda savol berib, mavzuni tez tushunishi mumkin."
  },
  {
    icon: ImagePlus,
    title: "Rasm orqali qurilmani aniqlash",
    text: "Rasm yuklab, qurilmaning vazifasi bo'yicha tushuntirish olish."
  },
  {
    icon: UserRound,
    title: "Individual tushuntirish",
    text: "Har bir talabaga o'z bilim darajasiga mos javob beriladi."
  },
  {
    icon: FileSpreadsheet,
    title: "AI yordamida test va mashqlar",
    text: "Nazorat savollari va mashqlar orqali bilim mustahkamlanadi."
  },
  {
    icon: Clock,
    title: "24/7 yordam",
    text: "Darsdan keyin ham chatbot yordamida o'rganish davom etadi."
  },
  {
    icon: Brain,
    title: "Real misollar bilan o'rganish",
    text: "Amaliy holatlar asosida mavzuni eslab qolish osonlashadi."
  }
];

function NewMethod() {
  useEffect(() => {
    markSectionVisited("Yangi usul");
  }, []);

  return (
    <section className="container-shell py-12 sm:py-16">
      <h1 className="section-title">
        Kompyuter arxitekturasini o'qitishda sun'iy intellektdan foydalangan holda
        yangi o'qituv usuli
      </h1>
      <p className="section-subtitle">
        Zamonaviy AI vositalari o'qitish jarayonini tezkor, tushunarli va
        natijador qiladi. Talaba markazli yondashuv asosida bilimlar mustahkamlanadi.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {methodCards.map((item) => (
          <FeatureCard key={item.title} icon={item.icon} title={item.title} text={item.text} />
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Eski usul vs AI yordamidagi yangi usul
        </h2>
        <ComparisonTable />
      </div>
    </section>
  );
}

export default NewMethod;
