import { motion } from "framer-motion";

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="glass-card p-6 transition duration-200"
    >
      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-2 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </motion.article>
  );
}

export default FeatureCard;
