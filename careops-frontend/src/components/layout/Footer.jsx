// src/components/layout/Footer.jsx
import {
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({ dark = true }) => {
  return (
    <footer
      className={`relative border-t backdrop-blur-xl ${
        dark
          ? "bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-900 border-white/10 text-gray-300"
          : "bg-gradient-to-br from-purple-100 via-pink-100 to-blue-200 border-black/10 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* GRID */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              CareOps
            </h2>

            <p className="mt-4 text-sm leading-relaxed opacity-80">
              Smart Admin & Operations Dashboard to manage leads, bookings,
              inventory, reports, and communication efficiently.
            </p>

            <div className="mt-4 text-sm font-medium text-indigo-400">
              Built with MERN Stack & TailwindCSS
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold text-lg mb-5 tracking-wide">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <ul className="space-y-3">
                {[
                  "dashboard",
                  "leads",
                  "bookings",
                  "messages",
                  "reports",
                  "inventory",
                ].map((route) => (
                  <li key={route}>
                    <Link
                      to={`/${route}`}
                      className="hover:text-indigo-400 transition flex items-center gap-1"
                    >
                      {route.charAt(0).toUpperCase() + route.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* PORTFOLIO LINKS */}
              <ul className="space-y-3">
                <li>
                  <Link
                    target="_blank"
                    to="https://my-portfolio-wheat-zeta-89.vercel.app/"
                    className="hover:text-red-500 underline flex items-center gap-1"
                  >
                    Portfolio <ArrowUpRight size={14} />
                  </Link>
                </li>

                {[
                  "project",
                  "about",
                  "services",
                  "blog",
                ].map((path) => (
                  <li key={path}>
                    <Link
                      target="_blank"
                      to={`https://my-portfolio-wheat-zeta-89.vercel.app/${path}`}
                      className="hover:text-indigo-400 transition flex items-center gap-1"
                    >
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                      <ArrowUpRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FEATURES */}
          <div>
            <h3 className="font-semibold text-lg mb-5 tracking-wide">
              Features
            </h3>

            <ul className="space-y-3 text-sm opacity-80">
              <li>Lead & Booking Management</li>
              <li>Real-time Messages & Notifications</li>
              <li>Inventory & Stock Tracking</li>
              <li>Reports & Analytics Dashboard</li>
              <li>PDF Export & Charts</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold text-lg mb-5 tracking-wide">
              Get in Touch
            </h3>

            <p className="text-sm opacity-80 mb-5">
              Want to collaborate or suggest improvements? Let’s connect.
            </p>

            <a
              href="https://my-portfolio-wheat-zeta-89.vercel.app/contact"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition"
            >
              Contact Me <ArrowUpRight size={16} />
            </a>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href="tel:+917991845638"
                className="flex items-center gap-2 hover:text-indigo-400 transition"
              >
                <Phone size={16} />
                +91 7991845638
              </a>

              <a
                href="mailto:anurag.application799@gmail.com"
                className="flex items-center gap-2 hover:text-indigo-400 transition"
              >
                <Mail size={16} />
                anurag.application799@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* SOCIALS */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-6">
            {[
              { href: "https://github.com/Anuragpandey799", icon: <Github size={22} />, name:"GitHub" },
              { href: "https://www.linkedin.com/in/anurag-pandey-7b4502304", icon: <Linkedin size={22} />, name:"Linkedin"},
              { href: "https://www.youtube.com/@anuragpandey9337", icon: <Youtube size={22} />, name:"YouTube" },
              { href: "https://www.instagram.com/logicluminaryanurag", icon: <Instagram size={22} />, name:"Instagram" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                title={social.name}
                className="p-3 rounded-full bg-white/5 hover:bg-indigo-500/20
                           border border-white/10 hover:border-indigo-500/40
                           transition-all duration-300 transform hover:scale-110"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* BOTTOM TEXT */}
          <div className="text-xs opacity-70 text-center md:text-right">
            <div className="flex justify-center md:justify-end gap-4 mb-2">
              <span className="hover:underline cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:underline cursor-pointer">
                Terms of Service
              </span>
            </div>
            © {new Date().getFullYear()} CareOps. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
