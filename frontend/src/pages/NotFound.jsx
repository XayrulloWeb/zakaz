import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="container-shell py-16">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Sahifa topilmadi</h1>
        <p className="mt-3 text-slate-600">
          Siz qidirgan sahifa mavjud emas yoki manzil noto'g'ri kiritilgan.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
