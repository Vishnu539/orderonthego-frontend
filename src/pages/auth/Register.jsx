import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginCTA, setShowLoginCTA] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setShowLoginCTA(false);
    setLoading(true);

    try {
      await api.post("/users/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      const normalized = message.toLowerCase();

      if (
        normalized.includes("exists") ||
        normalized.includes("already") ||
        normalized.includes("registered")
      ) {
        setError("An account with this email already exists.");
        setShowLoginCTA(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleRegister} style={cardStyle}>
        <h2>Create an account</h2>
        <p style={subtitle}>Join OrderOnTheGo to start ordering food.</p>

        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

        {error && <p style={errorStyle}>{error}</p>}

        {showLoginCTA && (
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: "100%", marginBottom: "12px" }}
            onClick={() => navigate("/login")}
          >
            Login Instead
          </button>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Registering..." : "Register"}
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

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const errorStyle = { color: "#dc2626", fontSize: "14px" };

export default Register;