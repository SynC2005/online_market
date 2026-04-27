"use client";

import { useState } from "react";
import { CheckCircle, Clock, MapPin, Menu, Phone, Truck } from "lucide-react";
import BottomNav from "@/frontend/components/ui/BottomNav";
import { DELIVERIES, DELIVERY_STATUS_STYLES } from "@/frontend/constants/deliveries";

function getStatusStyle(status) {
  return DELIVERY_STATUS_STYLES[status] ?? DELIVERY_STATUS_STYLES.default;
}

export default function DeliveryPage() {
  const [activeDelivery, setActiveDelivery] = useState(0);
  const activeDeliveryData = DELIVERIES[activeDelivery];
  const activeStatusStyle = getStatusStyle(activeDeliveryData.status);

  return (
    <div className="app-container">
      <header className="header">
        <button className="icon-btn">
          <Menu size={24} color="#0d47a1" />
        </button>
        <h1 className="logo">Delivery Tracking</h1>
        <button className="icon-btn">
          <Truck size={24} color="#0d47a1" />
        </button>
      </header>

      <section className="section">
        <h2 style={{ marginBottom: "16px" }}>Live Tracking</h2>

        <div
          className="delivery-card"
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "16px",
            }}
          >
            <div>
              <p style={{ fontSize: "11px", color: "#999", fontWeight: 600 }}>
                ORDER {activeDeliveryData.orderId}
              </p>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: "4px" }}>
                {activeDeliveryData.status}
              </h3>
            </div>
            <div
              style={{
                backgroundColor: activeStatusStyle.backgroundColor,
                color: activeStatusStyle.color,
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {activeDeliveryData.status}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                height: "8px",
                backgroundColor: "#e5e7eb",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  backgroundColor: activeStatusStyle.color,
                  width: `${activeDeliveryData.progress}%`,
                  borderRadius: "4px",
                }}
              />
            </div>
            <p style={{ fontSize: "12px", color: "#666" }}>
              {activeDeliveryData.progress}% Complete
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                  Driver
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>
                  {activeDeliveryData.driver}
                </p>
              </div>
              <a
                href={`tel:${activeDeliveryData.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <TrackingMetric icon={Clock} label="ETA" value={activeDeliveryData.eta} />
            <TrackingMetric icon={MapPin} label="Distance" value={activeDeliveryData.location} />
          </div>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: "16px" }}>All Deliveries</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {DELIVERIES.map((delivery, index) => {
            const statusStyle = getStatusStyle(delivery.status);

            return (
              <button
                type="button"
                key={delivery.id}
                onClick={() => setActiveDelivery(index)}
                style={{
                  padding: "16px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: activeDelivery === index ? "2px solid #2563eb" : "1px solid #e5e7eb",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                      {delivery.orderId}
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 600 }}>{delivery.driver}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {delivery.status === "Delivered" ? (
                      <CheckCircle size={20} color={statusStyle.color} />
                    ) : (
                      <Truck size={20} color={statusStyle.color} />
                    )}
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      {delivery.status}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

function TrackingMetric({ icon: Icon, label, value }) {
  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#f3f4f6",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <Icon size={18} style={{ marginBottom: "8px", color: "#2563eb" }} />
      <p style={{ fontSize: "12px", color: "#999" }}>{label}</p>
      <p style={{ fontSize: "14px", fontWeight: 600 }}>{value}</p>
    </div>
  );
}
