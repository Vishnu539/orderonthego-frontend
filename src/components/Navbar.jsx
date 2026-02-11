// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import "./Navbar.css";

const Navbar = () => {
  const { auth, logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    // 🔴 later we’ll replace this with a styled confirmation modal
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          OrderOnTheGo
        </Link>

        {/* ACTIONS */}
        {auth && (
          <div className="navbar-actions">
            {auth.role === "user" && (
              <>
                <Link
                  to="/user/restaurants"
                  className={`navbar-btn ${
                    isActive("/user/restaurants") ? "primary" : ""
                  }`}
                >
                  Restaurants
                </Link>

                <Link
                  to="/user/cart"
                  className={`navbar-btn cart-link ${
                    isActive("/user/cart") ? "primary" : ""
                  }`}
                >
                  <span className="cart-text">Cart</span>

                  {cartCount > 0 && (
                    <span
                      className="cart-badge"
                      aria-label="Items in cart"
                    />
                  )}
                </Link>

                <Link
                  to="/user/orders"
                  className={`navbar-btn ${
                    isActive("/user/orders") ? "primary" : ""
                  }`}
                >
                  Orders
                </Link>
              </>
            )}

            <button onClick={handleLogout} className="navbar-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;