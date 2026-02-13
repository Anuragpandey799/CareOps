import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";
import Layout from "../components/layout/Layout";
import { UserPlus, Phone, Globe, Users } from "lucide-react";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "",
  });

  const fetchLeads = async () => {
    const { data } = await API.get("/leads");
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();

    socket.on("leadCreated", (lead) => {
      setLeads((prev) => [lead, ...prev]);
    });

    socket.on("leadUpdated", (updatedLead) => {
      setLeads((prev) =>
        prev.map((l) => (l._id === updatedLead._id ? updatedLead : l)),
      );
    });

    socket.on("leadDeleted", ({ id }) => {
      setLeads((prev) => prev.filter((l) => l._id !== id));
    });

    return () => {
      socket.off("leadCreated");
      socket.off("leadUpdated");
      socket.off("leadDeleted");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/leads", form);
      setForm({ name: "", phone: "", source: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create lead");
    }
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Leads Management
        </h1>
        <p className="text-slate-400 mt-2">
          Track, manage and convert your incoming leads
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* FORM CARD */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <UserPlus size={18} /> Add New Lead
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <select
              value={form.source}
              onChange={(e) =>
                setForm({ ...form, source: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Select Source</option>
              <option value="Website">Website</option>
              <option value="Form">Form</option>
              <option value="Referral">Referral</option>
              <option value="Social">Social</option>
              <option value="Email">Email</option>
              <option value="Other">Other</option>
            </select>

            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-xl font-semibold hover:scale-105 transition transform">
              Add Lead
            </button>
          </form>
        </div>

        {/* LEADS LIST */}
        <div className="md:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <Users size={18} /> All Leads
          </h2>

          {leads.length === 0 ? (
            <p className="text-slate-400 text-center py-10">
              No leads yet. Start by adding one 🚀
            </p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="bg-slate-800 p-5 rounded-xl hover:bg-slate-700 transition cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {lead.name}
                      </h3>
                      <p className="text-slate-400 flex items-center gap-2">
                        <Phone size={14} /> {lead.phone}
                      </p>
                    </div>

                    <span className="px-3 py-1 text-sm rounded-full bg-indigo-600/20 text-indigo-400">
                      {lead.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Leads;
