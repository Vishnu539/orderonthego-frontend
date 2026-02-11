import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <p style={{ padding: "24px" }}>Loading restaurants...</p>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {restaurants.map((r) => (
            <div
              key={r._id}
              onClick={() =>
                navigate(`/user/products?restaurant=${r._id}`)
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(0,0,0,0.08)";
              }}
              style={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.25s ease",
              }}
            >
              {/* IMAGE */}
              <div style={{ height: "140px", overflow: "hidden" }}>
                <img
                  src={r.image}
                  alt={r.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* INFO */}
              <div style={{ padding: "16px" }}>
                <h3 style={{ marginBottom: "6px" }}>{r.name}</h3>
                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  {r.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;