import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="container-shell py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-card relative overflow-hidden p-8 sm:p-12"
      >
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-300/30 blur-2xl" />
        <div className="absolute -bottom-12 left-1/2 h-40 w-40 rounded-full bg-violet-300/30 blur-2xl" />
        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Premium EdTech Diplom Loyihasi
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Kompyuter arxitekturasini{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AI yordamida o'rganing
            </span>
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Sun'iy intellekt yordamida CPU, RAM, GPU, motherboard, cache va
            boshqa mavzularni osonroq tushuning.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/ai-guide"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-indigo-200"
            >
              Boshlash
            </Link>
            <Link
              to="/chatbot"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Chatbotga o'tish
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
