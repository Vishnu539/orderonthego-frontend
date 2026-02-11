import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

// PUBLIC
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// USER
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";

// RESTAURANT
import Restaurants from "./pages/user/Restaurants";
import RestaurantLogin from "./pages/restaurant/RestaurantLogin";
import RestaurantRegister from "./pages/restaurant/RestaurantRegister";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";

// ADMIN
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// AUTH
import ProtectedRoute from "./auth/ProtectedRoute";

/* pages imports unchanged */

const App = () => {
  return (
    <div className="app-root">
      <Navbar />
      <Toast />

      {/* Main content must expand */}
      <main style={{ flex: 1 }}>
        <div className="container">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* USER */}
            <Route
              path="/user/products"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/cart"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/orders"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/restaurants"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Restaurants />
                </ProtectedRoute>
              }
            />

            {/* RESTAURANT */}
            <Route path="/restaurant/login" element={<RestaurantLogin />} />
            <Route
              path="/restaurant"
              element={
                <ProtectedRoute allowedRoles={["restaurant"]}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/register"
              element={<RestaurantRegister />}
            />

            {/* ADMIN */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;