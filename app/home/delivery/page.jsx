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

  const getStatusColor = (status) => {
    switch (status) {
      case "In Transit": return "#3b82f6";
      case "Out for Delivery": return "#f59e0b";
      case "Delivered": return "#10b981";
      default: return "#64748b";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "In Transit": return "#eff6ff";
      case "Out for Delivery": return "#fffbeb";
      case "Delivered": return "#f0fdf4";
      default: return "#f8fafc";
    }
  };

  return (
    <div className="app-container delivery-container">
      {/* Header */}
      <header className="header">
        <button onClick={() => router.back()} className="header-back-btn">
          <ArrowLeft size={24} color="#0f172a" />
        </button>
        <h1 className="logo">Delivery Tracking</h1>
        <button className="icon-btn">
          <Truck size={24} color="#0f172a" />
        </button>
      </header>

      {/* Active Delivery Section */}
      <section className="section">
        <h2 className="section-title">Live Tracking</h2>

        {DELIVERIES.length > 0 && (
          <div className="delivery-card">
            <div className="delivery-card-header">
              <div>
                <p className="order-id-text">
                  ORDER {DELIVERIES[activeDelivery].orderId}
                </p>
                <h3 className="status-title-text">
                  {DELIVERIES[activeDelivery].status}
                </h3>
              </div>
              
              {/* Dynamic Inline Style for Badge Colors */}
              <div
                className="status-badge"
                style={{
                  backgroundColor: getStatusBgColor(DELIVERIES[activeDelivery].status),
                  color: getStatusColor(DELIVERIES[activeDelivery].status),
                }}
              >
                {DELIVERIES[activeDelivery].status}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-track">
                {/* Dynamic Inline Style for Progress Width & Color */}
                <div
                  className="progress-fill"
                  style={{
                    backgroundColor: getStatusColor(DELIVERIES[activeDelivery].status),
                    width: `${DELIVERIES[activeDelivery].progress}%`,
                  }}
                ></div>
              </div>
              <p className="progress-text">
                {DELIVERIES[activeDelivery].progress}% Complete
              </p>
            </div>

            {/* Driver Info */}
            <div className="driver-info-card">
              <div>
                <p className="driver-label">Driver</p>
                <p className="driver-name">{DELIVERIES[activeDelivery].driver}</p>
              </div>
              <a href={`tel:${DELIVERIES[activeDelivery].phone}`} className="phone-btn">
                <Phone size={18} />
              </a>
            </div>

            {/* ETA & Location */}
            <div className="eta-location-grid">
              <div className="grid-item-card">
                <Clock size={20} className="grid-item-icon" />
                <p className="grid-item-label">ETA</p>
                <p className="grid-item-value">{DELIVERIES[activeDelivery].eta}</p>
              </div>
              <div className="grid-item-card">
                <MapPin size={20} className="grid-item-icon" />
                <p className="grid-item-label">Distance</p>
                <p className="grid-item-value">{DELIVERIES[activeDelivery].location}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* All Deliveries */}
      <section className="section">
        <h2 className="section-title">All Deliveries</h2>

        <div className="delivery-list">
          {DELIVERIES.map((delivery, index) => (
            <div
              key={delivery.id}
              onClick={() => setActiveDelivery(index)}
              className="delivery-list-item"
              // Dynamic Inline Style for Active Border
              style={{
                border: activeDelivery === index ? "2px solid #3b82f6" : "1px solid #e2e8f0",
              }}
            >
              <div>
                <p className="list-item-id">{delivery.orderId}</p>
                <p className="list-item-name">{delivery.driver}</p>
              </div>
              <div className="list-item-status-col">
                {delivery.status === "Delivered" ? (
                  <CheckCircle size={20} color="#10b981" />
                ) : (
                  <Truck size={20} color={getStatusColor(delivery.status)} />
                )}
                <p className="list-item-status-text">{delivery.status}</p>
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', color: '#64748b' }}>
        Loading delivery tracking...
      </div>
    }>
      <DeliveryContent />
    </Suspense>
  );
}