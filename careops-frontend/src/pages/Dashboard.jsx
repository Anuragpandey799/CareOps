import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";
import Layout from "../components/layout/Layout";
import CountUp from "react-countup";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Users,
  CalendarCheck,
  IndianRupee,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLORS = ["#6366f1", "#22c55e", "#facc15", "#ef4444"];

const Dashboard = () => {
    const navigate = useNavigate();

  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    const { data } = await API.get("/dashboard/overview");
    setData(data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    socket.on("dashboardUpdated", fetchDashboard);
    return () => socket.off("dashboardUpdated");
  }, []);

  if (!data)
    return (
      <Layout>
        <div className="animate-pulse text-center py-20 text-slate-400">
          Loading Dashboard...
        </div>
      </Layout>
    );

  return (
    <Layout>
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Operational Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Real-time business insights & analytics
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Today's Leads"
          value={data.todayLeads}
          icon={<Users />}
          onClick={()=>{navigate("/leads")}}
        />
        <StatCard
          title="Today's Bookings"
          value={data.todayBookings}
          icon={<CalendarCheck />}
          onClick={()=>{navigate("/bookings")}}
        />
        <StatCard
          title="Today's Revenue"
          value={data.todayRevenue}
          icon={<IndianRupee />}
          highlight
          onClick={()=>{navigate("/reports")}}
        />
      </div>

      {/* CHART + ALERT GRID */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* LEAD FUNNEL */}
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Activity size={18} /> Lead Funnel
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.leadFunnel}
                dataKey="count"
                nameKey="_id"
                outerRadius={100}
              >
                {data.leadFunnel.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LOW STOCK */}
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-400" />
            Low Stock Alerts
          </h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {data.lowStock.length === 0 ? (
              <p className="text-slate-400">No low stock items 🎉</p>
            ) : (
              data.lowStock.map((p) => (
                <Item key={p._id}>
                  {p.name} ({p.stockQuantity})
                </Item>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ACTIVITY SECTIONS */}
      <div className="grid md:grid-cols-2 gap-8">
        <Section title="Upcoming Bookings">
          {data.upcomingBookings.map((b) => (
            <Item key={b._id}>
              {b.lead?.name} - {b.date?.slice(0, 10)}
            </Item>
          ))}
        </Section>

        <Section title="Recent Leads">
          {data.recentLeads.map((l) => (
            <Item key={l._id}>{l.name}</Item>
          ))}
        </Section>

        <Section title="Recent Bookings">
          {data.recentBookings.map((b) => (
            <Item key={b._id}>{b.service}</Item>
          ))}
        </Section>
      </div>
    </Layout>
  );
};

/* ================= COMPONENTS ================= */
const StatCard = ({ title, value, icon, highlight, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-2xl shadow-xl border border-slate-800 transition transform 
    ${onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-2xl active:scale-95" : ""}
    ${
      highlight
        ? "bg-gradient-to-br from-green-500 to-emerald-600"
        : "bg-slate-900/80 backdrop-blur-md"
    }`}
  >
    <div className="flex justify-between items-center">
      <h2 className="text-sm opacity-80">{title}</h2>
      <div className="opacity-80">{icon}</div>
    </div>

    <p className="text-3xl font-bold mt-4">
      <CountUp end={parseInt(value) || 0} duration={1.5} />
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800">
    <h2 className="font-semibold mb-4">{title}</h2>
    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
      {children}
    </div>
  </div>
);

const Item = ({ children }) => (
  <div className="bg-slate-800 hover:bg-slate-700 transition p-3 rounded-xl cursor-pointer">
    {children}
  </div>
);

export default Dashboard;
