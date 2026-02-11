import { useEffect, useState } from "react";
import { getMyProducts, deleteProduct } from "../../api/restaurant.api";
import AddProduct from "./AddProduct";
import RestaurantOrders from "./RestaurantOrders";
import "./RestaurantDashboard.css";

const RestaurantDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await getMyProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return <p className="loading-text">Loading dashboard...</p>;
  }

  return (
    <div className="restaurant-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Restaurant Dashboard</h2>
        <p className="sub-text">Manage your menu and track incoming orders</p>
      </header>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Add Product */}
        <section className="card">
          <h3 className="card-title">Add New Item</h3>
          <AddProduct onSuccess={fetchProducts} />
        </section>

        {/* Products */}
        <section className="card">
          <h3 className="card-title">Your Products</h3>

          {products.length === 0 ? (
            <p className="empty-text">
              You haven’t added any products yet.
            </p>
          ) : (
            <div className="product-list">
              {products.map((p) => (
                <div key={p._id} className="product-card">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="product-image" />
                  )}
                  <div className="product-info">
                    <h4 className="product-name">{p.name}</h4>
                    <span className="category">{p.category}</span>
                  </div>

                  <div className="product-actions">
                    <span className="price">₹{p.price}</span>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Orders */}
      <section className="card orders-section">
        <RestaurantOrders />
      </section>
    </div>
  );
};

export default RestaurantDashboard;