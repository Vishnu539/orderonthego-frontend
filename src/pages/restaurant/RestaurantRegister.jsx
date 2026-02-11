import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./RestaurantRegister.css";

const RestaurantRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("address", form.address);
      data.append("image", image); // ✅ restaurant image

      await api.post("/restaurant-dashboard/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Restaurant registered. Await admin approval.");
      setTimeout(() => navigate("/restaurant/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="restaurant-register-page">
      <div className="register-card">
        <h2>Restaurant Registration</h2>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <input
            name="name"
            placeholder="Restaurant Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          {/* ✅ IMAGE UPLOAD */}
          <input type="file" accept="image/*" onChange={handleImageChange} required />

          <button type="submit" className="btn btn-primary full-width">
            Register Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegister;