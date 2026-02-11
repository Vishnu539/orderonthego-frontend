import api from "./axios";

// User – browse products
export const getAllProducts = () => api.get("/products");

// Restaurant – manage own products
export const addProduct = (data) => api.post("/products", data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);