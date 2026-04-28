"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import BottomNav from "@/components/BottomNav";

// Sample order data (fallback jika database kosong)
const sampleOrdersData = [
  {
    id: "#ORD-8921",
    date: "Oct 24, 2023 • 14:30 PM",
    status: "IN_DELIVERY",
    items: [
      { emoji: "🥑", color: "#e5f3cc", name: "Hass Avocado" },
      { emoji: "🥛", color: "#e0f2fe", name: "Whole Milk" },
    ],
    itemsTotal: 4,
    totalAmount: "Rp 32.400",
    action: "Track Order",
  },
  {
    id: "#ORD-8814",
    date: "Oct 21, 2023 • 09:15 AM",
    status: "COMPLETED",
    items: [
      { emoji: "🍌", color: "#fef08a", name: "Organic Bananas" },
      { emoji: "🍞", color: "#ffedd5", name: "Grocery Bundle" },
    ],
    itemsTotal: 2,
    totalAmount: "Rp 18.900",
    action: "Reorder",
  },
  {
    id: "#ORD-8702",
    date: "Oct 18, 2023 • 18:45 PM",
    status: "CANCELLED",
    items: [{ emoji: "🍫", color: "#e5e7eb", name: "Dark Artisan Chocolates" }],
    itemsTotal: 1,
    totalAmount: "Rp 12.000",
    action: "View Details",
  },
];

export default function OrderList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("ongoing");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setOrders(sampleOrdersData);
      } else {
        setOrders(data);
      }
    } catch {
      setOrders(sampleOrdersData);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "IN_DELIVERY":
        return "bg-blue-50 text-azure-primary border-blue-100";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED":
        return "bg-red-50 text-red-500 border-red-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "IN_DELIVERY": return <Truck size={14} />;
      case "COMPLETED": return <CheckCircle size={14} />;
      case "CANCELLED": return <XCircle size={14} />;
      default: return null;
    }
  };

  const ongoingOrders = orders.filter(o => o.status === "IN_DELIVERY");
  const historyOrders = orders.filter(o => ["COMPLETED", "CANCELLED"].includes(o.status));
  const displayOrders = activeTab === "ongoing" ? ongoingOrders : historyOrders;

  return (
    <div className="min-h-screen bg-azure-bg pb-24 max-w-[420px] mx-auto font-sans relative">
      
      {/* Header */}
      <header className="p-6 pb-2 sticky top-0 bg-azure-bg z-40">
        <div className="flex justify-between items-center mb-6">
          <Menu size={24} className="text-slate-800 cursor-pointer" />
          <h1 className="text-xl font-black text-slate-900 tracking-tight">My Orders</h1>
          <ShoppingBag size={24} className="text-slate-800 cursor-pointer" />
        </div>

        {/* Tabs Modern */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`flex-1 py-4 text-sm font-bold transition-all relative ${
              activeTab === "ongoing" ? "text-azure-primary" : "text-slate-400"
            }`}
          >
            Ongoing ({ongoingOrders.length})
            {activeTab === "ongoing" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-azure-primary rounded-t-full shadow-[0_-2px_10px_rgba(0,119,190,0.3)]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-4 text-sm font-bold transition-all relative ${
              activeTab === "history" ? "text-azure-primary" : "text-slate-400"
            }`}
          >
            History ({historyOrders.length})
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-azure-primary rounded-t-full shadow-[0_-2px_10px_rgba(0,119,190,0.3)]"></div>
            )}
          </button>
        </div>
      </header>

      {/* Order List */}
      <div className="px-6 mt-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={32} className="animate-spin mb-2" />
            <p className="text-xs font-bold tracking-widest uppercase">Loading Orders...</p>
          </div>
        ) : displayOrders.length > 0 ? (
          displayOrders.map((order, index) => (
            <div
              key={index}
              className={`bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 transition-all active:scale-[0.98] ${
                order.status === "CANCELLED" ? "opacity-75 grayscale-[0.3]" : ""
              }`}
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Order ID <span className="text-slate-900">{order.id}</span>
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">{order.date}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace("_", " ")}
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                <div className="flex -space-x-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-white shadow-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.emoji}
                    </div>
                  ))}
                  {order.itemsTotal > order.items.length && (
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 border-2 border-white">
                      +{order.itemsTotal - order.items.length}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {order.items.map(i => i.name).join(", ")}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {order.itemsTotal} items
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                  <p className="text-lg font-black text-azure-primary">{order.totalAmount}</p>
                </div>
                <button
                  onClick={() => {
                    if (order.status === "IN_DELIVERY") {
                      router.push(`/home/delivery?orderId=${order.id}`);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                    order.status === "CANCELLED" 
                    ? "bg-slate-100 text-slate-400" 
                    : "bg-azure-primary text-white shadow-blue-500/20"
                  }`}
                >
                  {order.action}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-bold text-slate-400">
              {activeTab === "ongoing" ? "No ongoing orders" : "No order history"}
            </p>
          </div>
        )}
      </div>

      {/* Restock Banner (Azure Tertiary Styled) */}
      <section className="mx-6 mt-10 mb-8 bg-gradient-to-br from-azure-tertiary to-purple-700 rounded-[32px] p-8 text-center text-white relative overflow-hidden shadow-xl shadow-purple-500/20">
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} className="text-purple-200" />
            <span className="text-[10px] font-black uppercase tracking-[3px]">Weekly Routine</span>
          </div>
          <h2 className="text-2xl font-black mb-2 leading-tight">Restock your<br/>favorites?</h2>
          <p className="text-[11px] opacity-80 mb-6 font-medium">Your frequent items are ready for a quick checkout.</p>
          <button className="bg-white text-azure-tertiary px-6 py-3 rounded-full text-xs font-black shadow-lg active:scale-95 transition-transform uppercase tracking-wider">
            Order Fresh Milk & Bread
          </button>
          <div className="text-4xl mt-6 animate-bounce">🥖🥛</div>
        </div>
        {/* Dekorasi Background */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      <BottomNav />
    </div>
  );
}