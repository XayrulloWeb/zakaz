import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      showToast("Email va parolni to'ldiring.", "error");
      return;
    }

    setLoading(true);
    try {
      await login({
        email: form.email.trim(),
        password: form.password
      });
      showToast("Muvaffaqiyatli kirildi.", "success");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      showToast(err.message || "Email yoki parol noto'g'ri.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Kirish</h1>
        <p className="mt-2 text-sm text-slate-600">
          Hisobingizga kiring va dashboard bo'limiga o'ting.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Parol</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Hisobingiz yo'qmi?{" "}
          <Link to="/register" className="font-semibold text-indigo-700 hover:underline">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
