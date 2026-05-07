import { useEffect } from "react";
import { BookOpen, Download, ExternalLink } from "lucide-react";
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

const resources = [
  {
    title: "Axborot texnologiyalari (o'quv-uslubiy majmua)",
    language: "O'zbek",
    level: "Bakalavr",
    type: "O'quv-uslubiy majmua",
    source: "my.edu.uz -> unilibrary.uz",
    viewUrl: "https://my.edu.uz",
    pdfUrl: "https://api.unilibrary.uz/storage/PublisherResourceFile/537704/images/1719049538.pdf",
    note: "Ichida: shaxsiy kompyuter arxitekturasi, texnik va dasturiy ta'minot bo'limlari."
  },
  {
    title: "Mutaxassislik fanlarini o'qitish metodikasi",
    language: "O'zbek",
    level: "Magistratura",
    type: "O'quv qo'llanma",
    source: "my.edu.uz -> unilibrary.uz",
    viewUrl: "https://my.edu.uz",
    pdfUrl: "https://api.unilibrary.uz/storage/PublisherResourceFile/25357/images/1662445211.pdf",
    note: "Kompyuter arxitekturasi va AKT bo'yicha metodik tushuntirishlar berilgan."
  },
  {
    title: "San'at ta'limida axborot texnologiyalari",
    language: "O'zbek",
    level: "Oliy ta'lim",
    type: "O'quv material",
    source: "my.edu.uz -> unilibrary.uz",
    viewUrl: "https://my.edu.uz",
    pdfUrl: "https://api.unilibrary.uz/storage/PublisherResourceFile/23288/images/1661841665.pdf",
    note: "Kompyuter arxitekturasi va Fon Neyman prinsipi bo'yicha amaliy izohlar mavjud."
  },
  {
    title: "Parallel kompyuterlarning arxitekturasi va dasturlash",
    language: "O'zbek (lotin)",
    level: "Oliy ta'lim",
    type: "O'quv-uslubiy majmua",
    source: "ZiyoNET / TATU Nukus",
    viewUrl: "https://uzsmart.uz/library/view/104997.html",
    pdfUrl: "https://api.ziyonet.uz/uploads/books/795806/5e71bac841182.pdf",
    note: "Kompyuter injiniringi uchun parallel arxitektura bo'yicha amaliy material."
  }
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

      <div className="mt-12">
        <h2 className="section-title">Kutubxona manbalari</h2>
        <p className="section-subtitle">
          Kompyuter arxitekturasi bo'yicha real manbalar va PDF kitoblar shu yerda jamlangan.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {resources.map((item) => (
            <article key={item.title} className="glass-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                </div>
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Til:</span> {item.language}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Daraja:</span> {item.level}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Turi:</span> {item.type}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Manba:</span> {item.source}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={item.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <ExternalLink className="h-4 w-4" />
                  Sahifani ochish
                </a>
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  PDF kitob
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OldMethod;
