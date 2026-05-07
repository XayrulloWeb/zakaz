import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            AI Architecture EdTech
          </h3>
          <p className="mt-3 text-sm text-slate-600">
            Kompyuter arxitekturasini sun'iy intellekt yordamida o'rganish
            bo'yicha zamonaviy diplom platforma.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Sahifalar</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link to="/ai-guide" className="hover:text-indigo-700">
              AI qo'llanma
            </Link>
            <Link to="/new-method" className="hover:text-indigo-700">
              Yangi o'qituv usuli
            </Link>
            <Link to="/chatbot" className="hover:text-indigo-700">
              AI Chatbot
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Mualliflik</h4>
          <p className="mt-3 text-sm text-slate-600">
            (c) 2026 Diplom loyihasi. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
