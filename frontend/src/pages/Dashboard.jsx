import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpenText, Bot, ChartColumn, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getRecentChatMessages, getVisitedSections } from "../services/api";

const quickActions = [
  { title: "AI qo'llanma", to: "/ai-guide", icon: BookOpenText },
  { title: "Eski usul", to: "/old-method", icon: ChartColumn },
  { title: "Yangi usul", to: "/new-method", icon: ChartColumn },
  { title: "Chatbot", to: "/chatbot", icon: Bot }
];

function Dashboard() {
  const { user } = useAuth();

  const visitedCount = useMemo(() => getVisitedSections().length, []);
  const latestMessages = useMemo(() => getRecentChatMessages().slice(-4).reverse(), []);

  return (
    <section className="container-shell py-12 sm:py-16">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Salom, {user?.fullName || "Foydalanuvchi"}
          </h1>
          <p className="mt-2 text-slate-600">
            Bu yerda o'qish faoliyatingiz va AI bilan ishlash holati ko'rsatiladi.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article className="glass-card p-5">
          <p className="text-sm text-slate-500">O'rganilgan bo'limlar soni</p>
          <p className="mt-2 text-3xl font-extrabold text-indigo-700">{visitedCount}</p>
        </article>
        <article className="glass-card p-5">
          <p className="text-sm text-slate-500">Platforma holati</p>
          <p className="mt-2 text-lg font-semibold text-emerald-700">Faol</p>
        </article>
        <article className="glass-card p-5">
          <p className="text-sm text-slate-500">Profilga o'tish</p>
          <Link
            to="/profile"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline"
          >
            <User className="h-4 w-4" />
            Profil sahifasi
          </Link>
        </article>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Tezkor tugmalar</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700"
              >
                <action.icon className="h-4 w-4" />
                {action.title}
              </Link>
            ))}
          </div>
        </article>

        <article className="glass-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">So'nggi AI xabarlari</h2>
          {latestMessages.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              Hozircha AI chat tarixi yo'q. Chatbot sahifasida suhbatni boshlang.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {latestMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  <span className="mr-2 font-semibold text-indigo-700">
                    {message.role === "user" ? "Siz:" : "AI:"}
                  </span>
                  {message.text}
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
