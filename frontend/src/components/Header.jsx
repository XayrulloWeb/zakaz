import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap, UserCircle2, LayoutDashboard, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const publicLinks = [
  { label: "Bosh sahifa", to: "/" },
  { label: "AI qo'llanma", to: "/ai-guide" },
  { label: "Eski usul", to: "/old-method" },
  { label: "Yangi usul", to: "/new-method" },
  { label: "Kutubxona", to: "/library" },
  { label: "Chatbot", to: "/chatbot" }
];

function navClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-indigo-100 text-indigo-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function Header({ isDark, onToggleTheme }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const authLinks = isAuthenticated
    ? [
        { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
        { label: "Profil", to: "/profile", icon: UserCircle2 }
      ]
    : [];

  const allLinks = [...publicLinks, ...authLinks];

  const handleLogout = () => {
    logout();
    showToast("Hisobdan chiqildi.", "success");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-900">
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-2 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-sm font-extrabold sm:text-base">AI Arch Edu</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {allLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            aria-label={isDark ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Light" : "Dark"}
          </button>

          {isAuthenticated ? (
            <>
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                Salom, {user?.fullName?.split(" ")[0] || "Foydalanuvchi"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Chiqish
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Kirish
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-md"
              >
                Ro'yxatdan o'tish
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Menyu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="container-shell flex flex-col gap-2 py-4">
              <button
                type="button"
                onClick={onToggleTheme}
                className="mb-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? "Yorug' rejim" : "Qorong'i rejim"}
              </button>

              {allLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navClass}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileOpen(false);
                  }}
                  className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Chiqish
                </button>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Ro'yxatdan o'tish
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export default Header;
