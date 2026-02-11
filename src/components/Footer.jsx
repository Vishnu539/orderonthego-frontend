// components/Footer.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import "./Footer.css";

const Footer = () => {
  const { auth } = useContext(AuthContext);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <h3 className="footer-title">OrderOnTheGo</h3>
        <p className="footer-tagline">
          Fast, simple, and reliable food ordering.
        </p>

        {/* NOT LOGGED IN */}
        {!auth && (
          <div className="footer-links">
            <Link to="/login">User Login</Link>
            <Link to="/register">User Register</Link>
            <Link to="/restaurant/login">Restaurant Login</Link>
            <Link to="/restaurant/register">Restaurant Register</Link>
            <Link to="/admin/login">Admin Login</Link>
          </div>
        )}

        {/* LOGGED IN */}
        {auth && (
          <p className="footer-logged-in">
            You are logged in as <strong>{auth.role}</strong>.
            Use the Logout button above to switch accounts.
          </p>
        )}

        <p className="footer-copy">© 2026 OrderOnTheGo</p>
      </div>
    </footer>
  );
};

export default Footer;