import { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Home.css";

import { AuthContext } from "../auth/AuthProvider";
import { addToCart } from "../api/cart.api";

const Home = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);

  const restaurantRef = useRef(null);
  const productRef = useRef(null);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  /* FETCH DATA */
  useEffect(() => {
    if (auth && auth.role !== "user") return;

    const fetchData = async () => {
      try {
        const resRestaurants = await axios.get("/restaurants");
        const resProducts = await axios.get("/products");

        const productImages = (resProducts.data || [])
          .filter((p) => p.image)
          .slice(0, 5)
          .map((p) => p.image);

        setHeroImages(productImages);
        setRestaurants(resRestaurants.data || []);
        setProducts(resProducts.data || []);
      } catch (err) {
        console.error("Homepage fetch error", err);
      }
    };

    fetchData();
  }, [auth]);

  /* HERO SLIDER */
  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

  const horizontalScroll = (ref, direction) => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const handleOrderClick = async (productId) => {
    if (!auth) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId, quantity: 1 });
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: "Item added to cart!",
        })
      );
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  /* BLOCK NON-USER ROLES */
  if (auth && auth.role !== "user") {
    return (
      <div style={{ padding: "48px", textAlign: "center" }}>
        <h2>You are logged in as {auth.role}</h2>
        <p>Please use your dashboard.</p>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(auth.role === "restaurant" ? "/restaurant" : "/admin")
          }
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-slider">
          {heroImages.map((img, i) => (
            <img
              key={i}
              src={img}
              className={`hero-image ${i === current ? "active" : ""}`}
              alt="Food"
            />
          ))}
        </div>

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Delicious food, delivered instantly</h1>
          <p id="hero-text">
            Order from verified restaurants, track your orders, and enjoy fast,
            reliable delivery — all in one place.
          </p>

          <div className="hero-actions">
            {!auth && (
              <>
                <Link to="/register" className="hero-btn primary">
                  Get Started
                </Link>
                <Link to="/login" className="hero-btn secondary">
                  Login
                </Link>
              </>
            )}

            {auth && (
              <>
                <button
                  className="hero-btn primary"
                  onClick={() => navigate("/user/restaurants")}
                >
                  Browse Restaurants
                </button>
                <button
                  className="hero-btn secondary"
                  onClick={() => navigate("/user/cart")}
                >
                  View Cart
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* RESTAURANTS */}
      <section className="scroll-section" ref={restaurantRef}>
        <div className="section-header">
          <h2>Restaurants</h2>
          <div className="scroll-buttons">
            <button onClick={() => horizontalScroll(restaurantRef, "left")}>
              ‹
            </button>
            <button onClick={() => horizontalScroll(restaurantRef, "right")}>
              ›
            </button>
          </div>
        </div>

        <div className="horizontal-scroll">
          {restaurants.map((r) => (
            <div
              key={r._id}
              className="scroll-card clickable"
              onClick={() =>
                navigate(`/user/products?restaurant=${r._id}`)
              }
            >
              <div className="card-image">
                <img src={r.image} alt={r.name} />
              </div>
              <p>{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR ITEMS */}
      <section className="scroll-section light">
        <div className="section-header">
          <h2>Popular Items</h2>
          <div className="scroll-buttons">
            <button onClick={() => horizontalScroll(productRef, "left")}>
              ‹
            </button>
            <button onClick={() => horizontalScroll(productRef, "right")}>
              ›
            </button>
          </div>
        </div>

        <div className="horizontal-scroll" ref={productRef}>
          {products.slice(0, 10).map((p) => (
            <div key={p._id} className="scroll-card">
              <div className="card-image">
                <img src={p.image} alt={p.name} />
              </div>

              <p>{p.name}</p>
              <span>₹{p.price}</span>

              <button
                className="btn btn-primary small"
                onClick={() => handleOrderClick(p._id)}
              >
                Order
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;