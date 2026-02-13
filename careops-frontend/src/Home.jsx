import { Link } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { motion } from "framer-motion";
import { Activity, BarChart3, Boxes, Users } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      {/* ================= HERO SECTION ================= */}
      <section className="py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 to-cyan-400 text-transparent bg-clip-text"
        >
          CareOps — Smart Operations for Modern Clinics
        </motion.h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10">
          Manage leads, bookings, inventory, revenue, and reports — all in one
          powerful real-time dashboard built for operational excellence.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition"
          >
            View Dashboard
          </Link>
          <Link
            to="/reports"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
          >
            View Reports
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          <Feature
            icon={<Users size={40} />}
            title="Lead Management"
            desc="Track and convert leads with real-time funnel insights."
          />
          <Feature
            icon={<BarChart3 size={40} />}
            title="Revenue Analytics"
            desc="Visual revenue tracking with date filters & PDF export."
          />
          <Feature
            icon={<Boxes size={40} />}
            title="Inventory Control"
            desc="Monitor stock levels and receive low-stock alerts instantly."
          />
          <Feature
            icon={<Activity size={40} />}
            title="Live Dashboard"
            desc="Real-time operational insights powered by WebSockets."
          />
        </div>
      </section>

      {/* ================= SYSTEM PREVIEW ================= */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Real-Time Operational Intelligence
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <PreviewCard
            title="Today's Revenue"
            value="₹48,500"
            highlight
          />
          <PreviewCard
            title="Active Leads"
            value="124"
          />
          <PreviewCard
            title="Low Stock Alerts"
            value="5 Items"
          />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">
          How CareOps Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Step
            number="01"
            title="Capture & Manage"
            desc="Centralize leads, bookings, and clients in one place."
          />
          <Step
            number="02"
            title="Track & Analyze"
            desc="Visualize revenue trends and operational KPIs."
          />
          <Step
            number="03"
            title="Optimize & Scale"
            desc="Use insights to improve performance and growth."
          />
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 text-center bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your Operations?
        </h2>

        <Link
          to="/dashboard"
          className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-slate-900 transition"
        >
          Launch Dashboard
        </Link>
      </section>
    </Layout>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
    <div className="mb-4 text-indigo-400">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-400">{desc}</p>
  </div>
);

const PreviewCard = ({ title, value, highlight }) => (
  <div
    className={`p-8 rounded-2xl ${
      highlight
        ? "bg-indigo-600"
        : "bg-slate-800"
    }`}
  >
    <h3 className="text-lg opacity-80">{title}</h3>
    <p className="text-3xl font-bold mt-4">{value}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="bg-slate-800 p-8 rounded-2xl">
    <div className="text-4xl font-bold text-indigo-500 mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">
      {title}
    </h3>
    <p className="text-slate-400">{desc}</p>
  </div>
);

export default Home;
