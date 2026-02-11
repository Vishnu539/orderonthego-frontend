import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/product.api";
import { addToCart } from "../../api/cart.api";
import axios from "../../api/axios";

import fallbackImg from "../../assets/hero/hero2.jpg";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [activeRestaurantName, setActiveRestaurantName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* READ QUERY PARAM */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("restaurant");
    setActiveRestaurant(restaurantId);
  }, []);

  /* FETCH RESTAURANTS */
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Restaurant fetch failed", err);
      }
    };
    fetchRestaurants();
  }, []);

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getAllProducts();
        const allProducts = res?.data || [];

        const filtered = activeRestaurant
          ? allProducts.filter(
              (p) =>
                p.restaurantId === activeRestaurant ||
                p.restaurantId?._id === activeRestaurant
            )
          : allProducts;

        setProducts(filtered);

        const selectedRestaurant = restaurants.find(
          (r) => r._id === activeRestaurant
        );
        setActiveRestaurantName(selectedRestaurant?.name || "");
      } catch (err) {
        console.error("Product fetch failed", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeRestaurant, restaurants]);

  /* ADD TO CART */
  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      // 🔴 notify app
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: "Item added to cart!",
        })
      );
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  if (loading) return <p style={{ padding: "24px" }}>Loading products...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "8px" }}>
          {activeRestaurantName || "All Products"}
        </h2>

        <select
          value={activeRestaurant || ""}
          onChange={(e) => setActiveRestaurant(e.target.value || null)}
        >
          <option value="">All Restaurants</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCT GRID */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* IMAGE */}
              <img
                src={product.image || fallbackImg}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.src = fallbackImg;
                }}
              />

              {/* CONTENT */}
              <div style={{ padding: "16px" }}>
                <h4 style={{ marginBottom: "8px" }}>{product.name}</h4>
                <p style={{ fontWeight: "600", marginBottom: "12px" }}>
                  ₹{product.price}
                </p>

                <button
                  className="btn btn-primary small"
                  style={{ width: "100%" }}
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;