import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      showToast("Barcha maydonlarni to'ldiring.", "error");
      return;
    }

    if (form.password.length < 6) {
      showToast("Parol kamida 6 belgidan iborat bo'lishi kerak.", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("Parollar mos emas.", "error");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      showToast("Ro'yxatdan o'tish muvaffaqiyatli. Endi kirishingiz mumkin.", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.message || "Ro'yxatdan o'tishda xatolik.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Ro'yxatdan o'tish</h1>
        <p className="mt-2 text-sm text-slate-600">
          Yangi hisob yarating va AI platformadan foydalanishni boshlang.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="font-semibold text-indigo-700 hover:underline">
            Kirish
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
