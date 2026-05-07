import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function formatDate(dateValue) {
  if (!dateValue) return "Noma'lum";
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const createdAt = useMemo(() => formatDate(user?.createdAt), [user?.createdAt]);

  const handleLogout = () => {
    logout();
    showToast("Hisobdan chiqdingiz.", "info");
    navigate("/");
  };

  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Profil</h1>
        <p className="mt-2 text-slate-600">Foydalanuvchi ma'lumotlari</p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Full name</p>
            <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Account created date</p>
            <p className="text-sm font-semibold text-slate-900">{createdAt}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </section>
  );
}

export default Profile;
