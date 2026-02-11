import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { AuthContext } from "../../auth/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showRegisterCTA, setShowRegisterCTA] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowRegisterCTA(false);

    try {
      const res = await loginUser({ email, password });

      login(`Bearer ${res.data.token}`, "user");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please try again.";

      const normalized = message.toLowerCase();

      if (
        normalized.includes("invalid") ||
        normalized.includes("not") ||
        normalized.includes("credentials") ||
        normalized.includes("user")
      ) {
        setError("No account found with this email.");
        setShowRegisterCTA(true);
      } else {
        setError(message);
      }
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleLogin} style={cardStyle}>
        <h2>User Login</h2>
        <p style={subtitle}>Welcome back! Please sign in.</p>

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

        {error && <p style={errorStyle}>{error}</p>}

        {showRegisterCTA && (
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: "100%", marginBottom: "12px" }}
            onClick={() => navigate("/register")}
          >
            Register Now
          </button>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
};

/* styles */
const pageStyle = {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "white",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const subtitle = { color: "#6b7280", marginBottom: "12px" };
const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb" };
const errorStyle = { color: "#dc2626", fontSize: "14px" };

export default Login;