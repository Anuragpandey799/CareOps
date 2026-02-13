import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Layout from "../../components/layout/Layout";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden">
        
        {/* Background Glow Effects */}
        <div className="absolute w-72 h-72 bg-indigo-600 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl w-full max-w-md shadow-2xl border border-slate-800"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Login to continue to your dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative mb-5">
            <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Forgot Password */}
          

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-slate-400 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
