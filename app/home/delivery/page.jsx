"use client";

import React, { useState, useEffect, useMemo } from "react";
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

export default function DeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const deliveries = [
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

  // Compute activeDelivery based on orderId
  const activeDelivery = useMemo(() => {
    if (orderId) {
      const index = deliveries.findIndex((d) => d.id === orderId);
      return index !== -1 ? index : 0;
    }
    return 0;
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Transit":
        return "#3b82f6";
      case "Out for Delivery":
        return "#f59e0b";
      case "Delivered":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "In Transit":
        return "#eff6ff";
      case "Out for Delivery":
        return "#fffbf0";
      case "Delivered":
        return "#f0fdf4";
      default:
        return "#f3f4f6";
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <button
          onClick={() => router.back()}
          className="icon-btn"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <ArrowLeft size={24} color="#0d47a1" />
        </button>
        <h1 className="logo">Delivery Tracking</h1>
        <button className="icon-btn">
          <Truck size={24} color="#0d47a1" />
        </button>
      </header>

      {/* Active Delivery Section */}
      <section className="section">
        <h2 style={{ marginBottom: "16px" }}>Live Tracking</h2>

        {deliveries.length > 0 && (
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
                  ORDER {deliveries[activeDelivery].orderId}
                </p>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginTop: "4px",
                  }}
                >
                  {deliveries[activeDelivery].status}
                </h3>
              </div>
              <div
                style={{
                  backgroundColor: getStatusBgColor(
                    deliveries[activeDelivery].status,
                  ),
                  color: getStatusColor(deliveries[activeDelivery].status),
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {deliveries[activeDelivery].status}
              </div>
            </div>

            {/* Progress Bar */}
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
                    backgroundColor: getStatusColor(
                      deliveries[activeDelivery].status,
                    ),
                    width: `${deliveries[activeDelivery].progress}%`,
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
              <p style={{ fontSize: "12px", color: "#666" }}>
                {deliveries[activeDelivery].progress}% Complete
              </p>
            </div>

            {/* Driver Info */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "4px",
                    }}
                  >
                    Driver
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>
                    {deliveries[activeDelivery].driver}
                  </p>
                </div>
                <a
                  href={`tel:${deliveries[activeDelivery].phone}`}
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
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Phone size={18} />
                </a>
              </div>
            </div>

            {/* ETA & Location */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <Clock
                  size={18}
                  style={{ marginBottom: "8px", color: "#2563eb" }}
                />
                <p style={{ fontSize: "12px", color: "#999" }}>ETA</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>
                  {deliveries[activeDelivery].eta}
                </p>
              </div>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <MapPin
                  size={18}
                  style={{ marginBottom: "8px", color: "#2563eb" }}
                />
                <p style={{ fontSize: "12px", color: "#999" }}>Distance</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>
                  {deliveries[activeDelivery].location}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* All Deliveries */}
      <section className="section">
        <h2 style={{ marginBottom: "16px" }}>All Deliveries</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {deliveries.map((delivery, index) => (
            <div
              key={delivery.id}
              onClick={() => setActiveDelivery(index)}
              style={{
                padding: "16px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                border:
                  activeDelivery === index
                    ? "2px solid #2563eb"
                    : "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "4px",
                    }}
                  >
                    {delivery.orderId}
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>
                    {delivery.driver}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  {delivery.status === "Delivered" ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <Truck size={20} color={getStatusColor(delivery.status)} />
                  )}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    {delivery.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
