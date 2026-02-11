import api from "./axios";

// Place order (from cart)
export const placeOrder = (data) =>
  api.post("/orders/place", data);

// User order history
export const getUserOrders = () => api.get("/orders");

// Admin
export const getAllOrders = () => api.get("/orders");

// Restaurant
export const getRestaurantOrders = () =>
  api.get("/orders/restaurant");