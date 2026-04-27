export const DELIVERIES = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

export const DELIVERY_STATUS_STYLES = {
  "In Transit": {
    color: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  "Out for Delivery": {
    color: "#f59e0b",
    backgroundColor: "#fffbf0",
  },
  Delivered: {
    color: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  default: {
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
  },
};

