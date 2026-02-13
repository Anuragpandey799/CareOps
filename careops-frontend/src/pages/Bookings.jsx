import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket"; 
import Layout from "../components/layout/Layout";

import { Calendar, User, Clock, Trash2, PlusCircle } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);

  const [form, setForm] = useState({
    customer: "",
    service: "",
    date: "",
    durationMinutes: 60,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // FETCH DATA
  // ==========================
  const fetchData = async () => {
    try {
      const [bookingRes, leadRes] = await Promise.all([
        API.get("/bookings"),
        API.get("/leads"),
      ]);

      setBookings(bookingRes.data);
      setLeads(leadRes.data);
    } catch (err) {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("bookingCreated", (newBooking) => {
      setBookings((prev) => [newBooking, ...prev]);
    });

    socket.on("bookingUpdated", (updated) => {
      setBookings((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b)),
      );
    });

    socket.on("bookingDeleted", ({ bookingId }) => {
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    });

    return () => {
      socket.off("bookingCreated");
      socket.off("bookingUpdated");
      socket.off("bookingDeleted");
    };
  }, []);

  // ==========================
  // VALIDATION
  // ==========================
  const validateForm = () => {
    if (!form.customer) return "Please select a lead";
    if (!form.service.trim()) return "Service is required";
    if (!form.date) return "Booking date is required";

    const selectedDate = new Date(form.date);
    if (selectedDate < new Date()) return "Booking date cannot be in the past";

    if (form.durationMinutes < 15) return "Minimum duration is 15 minutes";

    return null;
  };

  // ==========================
  // CREATE BOOKING
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    try {
      setLoading(true);

      await API.post("/bookings", form);

      setForm({
        customer: "",
        service: "",
        date: "",
        durationMinutes: 60,
        notes: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UPDATE STATUS
  // ==========================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
    } catch {
      alert("Failed to update status");
    }
  };

  // ==========================
  // DELETE BOOKING
  // ==========================
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await API.delete(`/bookings/${id}`);
    } catch {
      alert("Failed to delete booking");
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" />
          <h1 className="text-3xl font-bold">Booking Management</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ================= FORM ================= */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900 p-6 rounded-2xl shadow-lg space-y-5 border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <PlusCircle size={18} />
                <h2 className="text-lg font-semibold">Create Booking</h2>
              </div>

              {error && (
                <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Lead Select */}
              <div>
                <label className="text-sm text-gray-400">Customer</label>
                <select
                  value={form.customer}
                  onChange={(e) =>
                    setForm({ ...form, customer: e.target.value })
                  }
                  className="w-full mt-1 p-3 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                >
                  <option value="">Select Lead</option>
                  {leads.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.name} ({lead.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service */}
              <div>
                <label className="text-sm text-gray-400">Service</label>
                <input
                  type="text"
                  value={form.service}
                  onChange={(e) =>
                    setForm({ ...form, service: e.target.value })
                  }
                  className="w-full mt-1 p-3 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-400">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm text-gray-400">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1 p-3 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full p-3 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />

              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-xl font-semibold hover:scale-105 transition transform"
              >
                {loading ? "Creating..." : "Create Booking"}
              </button>
            </form>
          </div>

          {/* ================= BOOKINGS LIST ================= */}
          <div className="lg:col-span-2 space-y-5">
            {bookings.length === 0 && (
              <div className="bg-slate-900 rounded-2xl p-10 text-center border border-slate-800">
                <Calendar size={40} className="mx-auto text-gray-500 mb-3" />
                <p className="text-gray-400">
                  No bookings yet. Create your first booking.
                </p>
              </div>
            )}

            {bookings.map((booking) => {
              const statusColors = {
                Pending: "bg-yellow-500/20 text-yellow-400",
                Confirmed: "bg-blue-500/20 text-blue-400",
                Completed: "bg-green-500/20 text-green-400",
                Cancelled: "bg-red-500/20 text-red-400",
              };

              return (
                <div
                  key={booking._id}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-primary transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <h3 className="font-semibold text-lg">
                          {booking.customer?.name}
                        </h3>
                      </div>

                      <p className="text-gray-400 text-sm">{booking.service}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(booking.date).toLocaleString()}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {booking.durationMinutes} mins
                        </span>
                      </div>

                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                          statusColors[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="text-red-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                    className="mt-4 p-2 bg-slate-800 rounded-lg text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;
