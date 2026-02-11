import api from "./axios";

export const addToCart = (data) => api.post("/cart/add", data);
export const getCart = () => api.get("/cart");

// NOTE: remove uses cartItem._id, NOT productId
export const removeFromCart = (cartItemId) =>
  api.delete(`/cart/remove/${cartItemId}`);

export const decrementCartItem = (productId) =>
  api.post("/cart/decrement", { productId });