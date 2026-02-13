import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";
import Layout from "../components/layout/Layout";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  Mail,
  Download,
} from "lucide-react";

const COLORS = ["#6366f1", "#22c55e", "#facc15", "#ef4444"];

const Reports = () => {
  const [report, setReport] = useState(null);
  const [range, setRange] = useState("month");

  const fetchReport = async () => {
    const { data } = await API.get(`/reports/summary?range=${range}`);
    setReport(data);
  };

  useEffect(() => {
    fetchReport();
  }, [range]);

  useEffect(() => {
    socket.on("reportUpdated", fetchReport);
    return () => socket.off("reportUpdated");
  }, []);

  if (!report)
    return (
      <Layout>
        <div className="animate-pulse text-center py-20 text-slate-400">
          Loading Analytics...
        </div>
      </Layout>
    );

  const exportPDF = () => {
    const pdf = new jsPDF();
    const now = new Date().toLocaleString();

    pdf.setFontSize(18);
    pdf.text(`CareOps Analytics Report`, 14, 20);
    pdf.setFontSize(10);
    pdf.text(`Generated: ${now}`, 14, 28);

    pdf.save(`CareOps_Report_${now}.pdf`);
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Real-time insights & performance tracking
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 rounded-xl hover:scale-105 transition transform"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <KPI title="Total Leads" value={report.totalLeads} icon={<Users />} />
        <KPI title="Total Bookings" value={report.totalBookings} icon={<CalendarCheck />} />
        <KPI title="Unread Messages" value={report.unreadMessages} icon={<Mail />} />
      </div>

      {/* REVENUE TREND */}
      <Card>
        <h2 className="mb-6 font-semibold flex items-center gap-2">
          <TrendingUp size={18} /> Revenue Over Time
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={report.revenueOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="_id" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* STATUS CHARTS */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <ChartCard title="Leads by Status" data={report.leadsByStatus} />
        <ChartCard title="Bookings by Status" data={report.bookingsByStatus} />
      </div>

      {/* INVENTORY PIE */}
      <Card className="mt-12">
        <h2 className="mb-6 font-semibold">Inventory Status</h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={report.inventoryStatus}
              dataKey="count"
              nameKey="_id"
              outerRadius={110}
            >
              {report.inventoryStatus?.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </Layout>
  );
};

/* ================= COMPONENTS ================= */

const KPI = ({ title, value, icon }) => (
  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:-translate-y-1 transition transform">
    <div className="flex justify-between items-center">
      <h2 className="text-sm opacity-70">{title}</h2>
      {icon}
    </div>
    <p className="text-3xl font-bold mt-4">
      <CountUp end={value || 0} duration={1.5} />
    </p>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-xl ${className}`}
  >
    {children}
  </div>
);

const ChartCard = ({ title, data }) => (
  <Card>
    <h2 className="mb-6 font-semibold">{title}</h2>
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="_id" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip />
        <Bar
          dataKey="count"
          fill="#22c55e"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export default Reports;
