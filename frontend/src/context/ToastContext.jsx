import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

function toastStyles(type) {
  if (type === "error") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (type === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  return "border-blue-200 bg-blue-50 text-blue-700";
}

function ToastIcon({ type }) {
  if (type === "error") return <AlertCircle className="h-4 w-4" />;
  if (type === "success") return <CheckCircle2 className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${toastStyles(
                toast.type
              )}`}
            >
              <ToastIcon type={toast.type} />
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast ToastProvider ichida ishlatilishi kerak.");
  }
  return context;
}

