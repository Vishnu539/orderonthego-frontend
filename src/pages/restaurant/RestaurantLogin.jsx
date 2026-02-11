import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../auth/AuthProvider";

const RestaurantLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/restaurants/login", {
        email,
        password,
      });

      login(`Bearer ${res.data.token}`, "restaurant");
      navigate("/restaurant");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleLogin} style={cardStyle}>
        <h2>Restaurant Login</h2>
        <p style={{ color: "#6b7280" }}>
          Login to manage your restaurant
        </p>

        <input
          type="email"
          placeholder="Restaurant Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

const pageStyle = {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  background: "white",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

export default RestaurantLogin;