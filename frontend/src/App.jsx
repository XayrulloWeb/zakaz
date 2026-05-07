import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AIGuide from "./pages/AIGuide";
import OldMethod from "./pages/OldMethod";
import NewMethod from "./pages/NewMethod";
import ChatbotPage from "./pages/ChatbotPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-guide" element={<AIGuide />} />
          <Route path="/old-method" element={<OldMethod />} />
          <Route path="/new-method" element={<NewMethod />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
