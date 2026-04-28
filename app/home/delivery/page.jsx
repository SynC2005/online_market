"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

export const dynamic = "force-dynamic";

const DELIVERIES = [
  {
    id: "#ORD-8921",
    orderId: "#ORD-8921",
    status: "In Transit",
    driver: "John Smith",
    phone: "+1-555-123-4567",
    eta: "15 mins away",
    items: "4 items",
    location: "2.5 km away",
    progress: 75,
  },
  {
    id: "#ORD-8920",
    orderId: "#ORD-8920",
    status: "Out for Delivery",
    driver: "Sarah Johnson",
    phone: "+1-555-987-6543",
    eta: "30 mins away",
    items: "3 items",
    location: "5.2 km away",
    progress: 50,
  },
  {
    id: "#ORD-8919",
    orderId: "#ORD-8919",
    status: "Delivered",
    driver: "Mike Wilson",
    phone: "+1-555-456-7890",
    eta: "Delivered",
    items: "5 items",
    location: "Delivered",
    progress: 100,
  },
];

function DeliveryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [activeDelivery, setActiveDelivery] = useState(() => {
    if (orderId) {
      const index = DELIVERIES.findIndex((d) => d.id === orderId);
      return index !== -1 ? index : 0;
    }
    return 0;
  });

  // Helper untuk warna status yang dinamis menggunakan Tailwind classes
  const getStatusClasses = (status) => {
    switch (status) {
      case "In Transit": return "bg-blue-50 text-azure-primary";
      case "Out for Delivery": return "bg-amber-50 text-amber-600";
      case "Delivered": return "bg-emerald-50 text-emerald-600";
      default: return "bg-slate-50 text-slate-500";
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "In Transit": return "bg-azure-primary";
      case "Out for Delivery": return "bg-amber-500";
      case "Delivered": return "bg-emerald-500";
      default: return "bg-slate-400";
    }
  };

  const current = DELIVERIES[activeDelivery];

  return (
    <div className="min-h-screen bg-azure-bg pb-24 max-w-[420px] mx-auto font-sans relative">
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-azure-bg sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-xl shadow-sm text-slate-800 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Delivery Tracking</h1>
        <div className="p-2 text-azure-primary">
          <Truck size={24} />
        </div>
      </header>

      {/* Active Delivery Section */}
      <section className="px-6 py-4">
        <h2 className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-4">Live Tracking</h2>

        {DELIVERIES.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  ORDER {current.orderId}
                </p>
                <h3 className="text-xl font-black text-slate-900 leading-none">
                  {current.status}
                </h3>
              </div>
              
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusClasses(current.status)}`}>
                {current.status}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${getProgressColor(current.status)}`}
                  style={{ width: `${current.progress}%` }}
                ></div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 text-right">
                {current.progress}% Complete
              </p>
            </div>

            {/* Driver Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-azure-primary rounded-full flex items-center justify-center text-white font-bold">
                  {current.driver[0]}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Driver</p>
                  <p className="text-sm font-bold text-slate-900">{current.driver}</p>
                </div>
              </div>
              <a href={`tel:${current.phone}`} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-azure-primary hover:bg-azure-primary hover:text-white transition-all active:scale-90">
                <Phone size={18} />
              </a>
            </div>

            {/* ETA & Location Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center">
                <Clock size={20} className="text-azure-primary mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">ETA</p>
                <p className="text-[13px] font-black text-slate-900">{current.eta}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center">
                <MapPin size={20} className="text-red-500 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Distance</p>
                <p className="text-[13px] font-black text-slate-900">{current.location}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* All Deliveries */}
      <section className="px-6 py-4">
        <h2 className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-4">All Deliveries</h2>

        <div className="flex flex-col gap-3">
          {DELIVERIES.map((delivery, index) => (
            <div
              key={delivery.id}
              onClick={() => setActiveDelivery(index)}
              className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all border ${
                activeDelivery === index 
                ? "bg-white border-azure-primary shadow-md scale-[1.02]" 
                : "bg-white/50 border-transparent text-slate-400"
              }`}
            >
              <div className="flex gap-3 items-center">
                <div className={`w-2 h-10 rounded-full ${getProgressColor(delivery.status)}`}></div>
                <div>
                  <p className={`text-[12px] font-bold ${activeDelivery === index ? 'text-slate-900' : 'text-slate-400'}`}>
                    {delivery.orderId}
                  </p>
                  <p className="text-[11px] font-medium">{delivery.driver}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                {delivery.status === "Delivered" ? (
                  <CheckCircle size={20} className="text-emerald-500" />
                ) : (
                  <div className={activeDelivery === index ? "text-azure-primary" : "text-slate-300"}>
                    <Truck size={20} />
                  </div>
                )}
                <p className={`text-[9px] font-black uppercase tracking-tighter ${activeDelivery === index ? 'text-slate-900' : 'text-slate-400'}`}>
                  {delivery.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-azure-bg text-slate-400 font-sans">
        <Loader2 size={32} className="animate-spin mb-2" />
        <p className="text-xs font-bold tracking-widest uppercase">Loading Delivery...</p>
      </div>
    }>
      <DeliveryContent />
    </Suspense>
  );
}