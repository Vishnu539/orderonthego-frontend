import api from "./axios";

/* =========================
   RESTAURANT DASHBOARD APIs
   ========================= */

// Products
export const getMyProducts = () => {
  return api.get("/restaurant-dashboard/menu");
};

export const addProduct = (data) =>
  api.post("/restaurant-dashboard/menu/add", data);

export const deleteProduct = (id) => {
  return api.delete(`/restaurant-dashboard/menu/${id}`);
};

// Orders
export const getRestaurantOrders = () => {
  return api.get("/restaurant-dashboard/orders");
};

// ✅ Update order status (restaurant action)
export const updateOrderStatus = (orderId, status) => {
  return api.patch(`/orders/${orderId}/status`, { status });
};