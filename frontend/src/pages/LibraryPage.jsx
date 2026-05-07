import { useEffect } from "react";
import { BookOpen, Download, ExternalLink } from "lucide-react";
import { markSectionVisited } from "../services/api";

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
  },
  {
    title: "Computer Organization with ARM64",
    language: "English",
    level: "Undergraduate",
    type: "Open Textbook",
    source: "Rowan University OER (CC license)",
    viewUrl: "https://rdw.rowan.edu/textbooks/2/",
    pdfUrl: "https://rdw.rowan.edu/cgi/viewcontent.cgi?article=1001&context=textbooks",
    note: "Kompyuter tashkiloti va arxitekturasi bo'yicha to'liq ochiq darslik."
  },
  {
    title: "Computer Organization with MIPS",
    language: "English",
    level: "Undergraduate",
    type: "Open Textbook",
    source: "Rowan University OER (CC license)",
    viewUrl: "https://rdw.rowan.edu/oer/9/",
    pdfUrl: "https://rdw.rowan.edu/cgi/viewcontent.cgi?article=1008&context=oer",
    note: "MIPS ISA asosida computer architecture asoslarini tushuntiradi."
  },
  {
    title: "Computer Organization",
    language: "English",
    level: "Undergraduate",
    type: "Open Textbook",
    source: "OpenALG / University System of Georgia (CC BY 4.0)",
    viewUrl: "https://alg.manifoldapp.org/projects/computer-organization",
    pdfUrl:
      "https://nyc3.digitaloceanspaces.com/manifold-alg-api-store/store/actioncallout/9/7/0/970f49e0-fd75-4e2f-8685-25ac473ad767/attachment/eef4257951b0e08432216ab0cfcd3fb0.pdf",
    note: "CPU organization, ISA, pipeline, memory va virtual xotira bo'yicha to'liq kitob."
  }
];

function LibraryPage() {
  useEffect(() => {
    markSectionVisited("Kutubxona");
  }, []);

  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="section-title">Kompyuter Arxitekturasi Kutubxonasi</h1>
        <p className="section-subtitle">
          Ushbu sahifada kompyuter arxitekturasi bo'yicha real va foydali manbalar jamlandi:
          rasmiy sahifalar, ochiq darsliklar va PDF kitoblar.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {resources.map((item) => (
          <article key={item.title} className="glass-card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
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
    </section>
  );
}

export default LibraryPage;
