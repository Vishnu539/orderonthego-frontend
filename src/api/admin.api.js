import api from "./axios";

// Users
export const getAllUsers = () =>
  api.get("/admin/users");

// Restaurants
export const getAllRestaurants = () =>
  api.get("/admin/restaurants");

export const approveRestaurant = (id) =>
  api.put(`/admin/restaurants/${id}/approve`);

// Orders
export const getAllOrders = () =>
  api.get("/admin/orders");

export const loginAdmin = (data) =>
  api.post("/admin/login", data);