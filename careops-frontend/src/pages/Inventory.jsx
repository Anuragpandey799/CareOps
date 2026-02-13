import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";
import Layout from "../components/layout/Layout";
import {
  Plus,
  Package,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit,
} from "lucide-react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    cost: "",
    stockQuantity: "",
    lowStockThreshold: 5,
  });

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/inventory");
      setProducts(data);
    } catch {
      setError("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();

    socket.on("productCreated", (product) =>
      setProducts((prev) => [product, ...prev])
    );

    socket.on("stockUpdated", (updatedProduct) =>
      setProducts((prev) =>
        prev.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        )
      )
    );

    socket.on("productDeleted", ({ id }) =>
      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      )
    );

    return () => {
      socket.off("productCreated");
      socket.off("stockUpdated");
      socket.off("productDeleted");
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await API.post("/inventory", {
        ...form,
        price: Number(form.price),
        cost: Number(form.cost),
        stockQuantity: Number(form.stockQuantity),
        lowStockThreshold: Number(form.lowStockThreshold),
      });

      setShowForm(false);
      setForm({
        name: "",
        sku: "",
        category: "",
        price: "",
        cost: "",
        stockQuantity: "",
        lowStockThreshold: 5,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, type) => {
    const quantity = prompt("Enter quantity:");
    if (!quantity || quantity <= 0) return;

    await API.put(`/inventory/${id}/stock`, {
      type,
      quantity: Number(quantity),
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await API.delete(`/inventory/${id}`);
  };

  const getStockBadge = (status) => {
    if (status === "Low Stock")
      return "bg-yellow-500/20 text-yellow-400";
    if (status === "Out of Stock")
      return "bg-red-500/20 text-red-400";
    return "bg-green-500/20 text-green-400";
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-slate-400 mt-2">
            Manage products, stock levels & pricing
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 rounded-xl hover:scale-105 transition"
        >
          <Plus size={18} />
          {showForm ? "Close" : "Add Product"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl mb-10 grid md:grid-cols-3 gap-6"
        >
          {error && (
            <div className="col-span-3 bg-red-500/20 text-red-400 p-3 rounded-xl">
              {error}
            </div>
          )}

          {Object.keys(form).map((key) => (
            <input
              key={key}
              type={key.includes("price") || key.includes("cost") || key.includes("Quantity") || key.includes("Threshold") ? "number" : "text"}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              required={key !== "category"}
              className="p-3 bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          ))}

          <button
            disabled={loading}
            className="col-span-3 bg-indigo-600 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      )}

      {/* PRODUCT GRID */}
      {products.length === 0 ? (
        <div className="text-center text-slate-400 py-20">
          No products available 🚀
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-semibold text-lg">
                    {product.name}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    SKU: {product.sku}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${getStockBadge(
                    product.stockStatus
                  )}`}
                >
                  {product.stockStatus}
                </span>
              </div>

              <p className="text-sm mb-1">
                Stock: {product.stockQuantity}
              </p>
              <p className="text-sm mb-1">
                Price: ₹{product.price}
              </p>
              <p className="text-sm mb-4">
                Cost: ₹{product.cost}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    updateStock(product._id, "IN")
                  }
                  className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded-lg text-sm"
                >
                  <ArrowUp size={14} /> Stock In
                </button>

                <button
                  onClick={() =>
                    updateStock(product._id, "OUT")
                  }
                  className="flex items-center gap-1 bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                >
                  <ArrowDown size={14} /> Stock Out
                </button>

                <button
                  onClick={() =>
                    updateStock(product._id, "ADJUSTMENT")
                  }
                  className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-lg text-sm"
                >
                  <Edit size={14} /> Adjust
                </button>

                <button
                  onClick={() =>
                    deleteProduct(product._id)
                  }
                  className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-lg text-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Inventory;
