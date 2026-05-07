import { useEffect } from "react";
import { markSectionVisited } from "../services/api";

const oldMethodSteps = [
  "O'qituvchi doskada tushuntiradi",
  "Talabalar daftar yozadi",
  "Kitob va slaydlardan foydalaniladi",
  "Amaliy va interaktivlik kam",
  "Talaba darsdan keyin yordam ololmaydi"
];

const oldMethodCons = [
  "Individual yondashuv kam",
  "Murakkab mavzularni tushunish qiyin",
  "Vizual tushuntirish yetarli emas",
  "Savol-javob faqat dars vaqtida bo'ladi"
];

function OldMethod() {
  useEffect(() => {
    markSectionVisited("Eski usul");
  }, []);

  return (
    <section className="container-shell py-12 sm:py-16">
      <h1 className="section-title">Kompyuter arxitekturasini o'qitishdagi eski usul</h1>
      <p className="section-subtitle">
        An'anaviy yondashuvning afzalliklari bo'lsa-da, zamonaviy talabalar
        uchun interaktivlik va individual moslashuvchanlik yetarli emas.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Eski usul tavsifi</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {oldMethodSteps.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-slate-400" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-rose-800">Eski usulning kamchiliklari</h2>
          <ul className="mt-4 space-y-3 text-sm text-rose-700">
            {oldMethodCons.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export default OldMethod;
