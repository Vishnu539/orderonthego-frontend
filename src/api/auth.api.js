import api from "./axios";

// USER LOGIN
export const loginUser = (data) => {
  return api.post("/users/login", data);
};