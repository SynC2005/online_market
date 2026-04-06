"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/utils/supabase";

// Sample order data (fallback)
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
    totalAmount: "$32.40",
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
    totalAmount: "$18.90",
    action: "Reorder",
  },
  {
    id: "#ORD-8810",
    date: "Oct 19, 2023 • 15:45 PM",
    status: "COMPLETED",
    items: [
      { emoji: "🧜", color: "#fce7f3", name: "Hand Soap" },
      { emoji: "🧽", color: "#dbeafe", name: "Sponges" },
    ],
    itemsTotal: 5,
    totalAmount: "$15.60",
    action: "Reorder",
  },
  {
    id: "#ORD-8702",
    date: "Oct 18, 2023 • 18:45 PM",
    status: "CANCELLED",
    items: [{ emoji: "🍫", color: "#e5e7eb", name: "Dark Artisan Chocolates" }],
    itemsTotal: 1,
    totalAmount: "$12.00",
    action: "View Details",
  },
  {
    id: "#ORD-8601",
    date: "Oct 15, 2023 • 11:20 AM",
    status: "COMPLETED",
    items: [
      { emoji: "🥬", color: "#d1fae5", name: "Fresh Spinach" },
      { emoji: "🍅", color: "#fee2e2", name: "Tomatoes" },
    ],
    itemsTotal: 3,
    totalAmount: "$24.50",
    action: "Reorder",
  },
];

export default function OrderList() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("ongoing");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist or other error, silently use sample data
        if (!error.message.includes("Could not find the table")) {
          console.error("Error fetching orders:", error.message);
        }
        setOrders(sampleOrdersData);
      } else if (data && data.length > 0) {
        setOrders(data);
      } else {
        // No orders in database, use sample data
        setOrders(sampleOrdersData);
      }
    } catch (error) {
      // Silently fail and use sample data
      setOrders(sampleOrdersData);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIconColor = (status) => {
    switch (status) {
      case "IN_DELIVERY":
        return "#0b57cf";
      case "COMPLETED":
        return "#22c55e";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "IN_DELIVERY":
        return <Truck size={18} />;
      case "COMPLETED":
        return <CheckCircle size={18} />;
      case "CANCELLED":
        return <XCircle size={18} />;
      default:
        return null;
    }
  };

  // Filter orders by tab
  const ongoingOrders = orders.filter(
    (order) => order.status === "IN_DELIVERY",
  );
  const historyOrders = orders.filter((order) =>
    ["COMPLETED", "CANCELLED"].includes(order.status),
  );
  const displayOrders = activeTab === "ongoing" ? ongoingOrders : historyOrders;

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ padding: "16px 16px 0", paddingTop: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Menu size={24} style={{ cursor: "pointer", color: "#333" }} />
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
            My Orders
          </h1>
          <ShoppingBag size={24} style={{ cursor: "pointer", color: "#333" }} />
        </div>
      </header>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          padding: "0 16px",
          marginBottom: "16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <button
          onClick={() => setActiveTab("ongoing")}
          style={{
            flex: 1,
            padding: "12px 0",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeTab === "ongoing" ? "600" : "400",
            color: activeTab === "ongoing" ? "#0b57cf" : "#999",
            borderBottom:
              activeTab === "ongoing" ? "3px solid #0b57cf" : "none",
            transition: "all 0.3s ease",
          }}
        >
          Ongoing ({ongoingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          style={{
            flex: 1,
            padding: "12px 0",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: activeTab === "history" ? "600" : "400",
            color: activeTab === "history" ? "#0b57cf" : "#999",
            borderBottom:
              activeTab === "history" ? "3px solid #0b57cf" : "none",
            transition: "all 0.3s ease",
          }}
        >
          History ({historyOrders.length})
        </button>
      </div>

      {/* Order List */}
      <div style={{ padding: "0 16px", marginBottom: "80px" }}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 16px",
              color: "#999",
            }}
          >
            <p style={{ fontSize: "14px", margin: "0" }}>Loading orders...</p>
          </div>
        ) : displayOrders.length > 0 ? (
          displayOrders.map((order, index) => (
            <div
              key={index}
              style={{
                backgroundColor:
                  order.status === "CANCELLED" ? "#f9f9f9" : "white",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                opacity: order.status === "CANCELLED" ? 0.7 : 1,
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      margin: "0 0 4px 0",
                      fontWeight: "500",
                    }}
                  >
                    ORDER ID{" "}
                    <span style={{ color: "#333", fontWeight: "bold" }}>
                      {order.id}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      margin: "0",
                    }}
                  >
                    {order.date}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor:
                      order.status === "IN_DELIVERY"
                        ? "#e3f2fd"
                        : order.status === "COMPLETED"
                          ? "#f0fdf4"
                          : "#fef2f2",
                    color: getStatusIconColor(order.status),
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {getStatusIcon(order.status)}
                  {order.status === "IN_DELIVERY"
                    ? "IN DELIVERY"
                    : order.status === "COMPLETED"
                      ? "COMPLETED"
                      : "CANCELLED"}
                </div>
              </div>

              {/* Order Items */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  padding: "12px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex" }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        marginLeft: idx > 0 ? "-10px" : "0",
                        border: "2px solid white",
                        zIndex: order.items.length - idx,
                      }}
                    >
                      {item.emoji}
                    </div>
                  ))}
                  {order.itemsTotal > order.items.length && (
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#666",
                        marginLeft: "-10px",
                        border: "2px solid white",
                      }}
                    >
                      +{order.itemsTotal - order.items.length}
                    </div>
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#333",
                      margin: "0",
                    }}
                  >
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {order.itemsTotal} items total
                  </p>
                </div>
              </div>

              {/* Order Footer */}
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
                      fontSize: "11px",
                      color: "#999",
                      margin: "0 0 4px 0",
                      fontWeight: "500",
                    }}
                  >
                    TOTAL AMOUNT
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                      margin: "0",
                    }}
                  >
                    {order.totalAmount}
                  </p>
                </div>
                <button
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    backgroundColor:
                      order.status === "COMPLETED"
                        ? "#0b57cf"
                        : order.status === "CANCELLED"
                          ? "#f0f0f0"
                          : "#0b57cf",
                    color: order.status === "CANCELLED" ? "#666" : "white",
                    transition: "all 0.3s ease",
                  }}
                >
                  {order.action}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 16px",
              color: "#999",
            }}
          >
            <p style={{ fontSize: "16px", margin: "0" }}>
              {activeTab === "ongoing"
                ? "You don't have any ongoing orders"
                : "No order history yet"}
            </p>
          </div>
        )}
      </div>

      {/* Restock Banner */}
      <section
        style={{
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "24px 16px",
          margin: "0 16px 80px 16px",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Sparkles size={16} />
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            WEEKLY ROUTINE
          </span>
        </div>
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 8px 0" }}
        >
          Restock your
          <br />
          favorites?
        </h2>
        <p style={{ fontSize: "14px", opacity: 0.9, margin: "0 0 12px 0" }}>
          Your frequent items are ready for a quick checkout.
        </p>

        <button
          style={{
            backgroundColor: "white",
            color: "#667eea",
            border: "none",
            padding: "10px 24px",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        >
          Order Fresh Milk & Bread
        </button>

        <div style={{ fontSize: "32px", marginTop: "12px" }}>🥖🥛</div>
      </section>

      <BottomNav />
    </div>
  );
}
