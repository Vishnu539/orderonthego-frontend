import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllRestaurants,
  approveRestaurant,
  getAllOrders,
} from "../../api/admin.api";
import api from "../../api/axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔴 DELETE MODAL STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const fetchData = async () => {
    try {
      const [u, r, o] = await Promise.all([
        getAllUsers(),
        getAllRestaurants(),
        getAllOrders(),
      ]);

      setUsers(u.data || []);
      setRestaurants(r.data || []);
      setOrders(o.data || []);
    } catch {
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await approveRestaurant(id);
    fetchData();
  };

  /* ---------------- DELETE FLOW ---------------- */

  const openDeleteModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setConfirmEmail("");
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRestaurant(null);
    setConfirmEmail("");
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!selectedRestaurant) return;

    if (confirmEmail !== selectedRestaurant.email) {
      setDeleteError("Email does not match. Please type the exact email.");
      return;
    }

    try {
      await api.delete(
        `/admin/restaurants/${selectedRestaurant._id}`,
        {
          data: { email: confirmEmail },
        }
      );

      closeDeleteModal();
      fetchData();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete restaurant"
      );
    }
  };

  if (loading) return <p className="loading">Loading admin dashboard...</p>;

  return (
    <>
      <div className="admin-dashboard">
        <h2 className="admin-title">Admin Dashboard</h2>

        <div className="admin-grid">
          {/* USERS */}
          <div className="admin-card users-list">
            <h3>Users ({users.length})</h3>
            <ul>
              {users.map((u) => (
                <li key={u._id}>{u.email}</li>
              ))}
            </ul>
          </div>

          {/* RESTAURANTS */}
          <div className="admin-card">
            <h3>Restaurants</h3>

            <ul>
              {restaurants.map((r) => (
                <li key={r._id} className="restaurant-row restaurants-list">
                  {/* LEFT: NAME */}
                  <span className="restaurant-name">
                    {r.name || r.email}
                  </span>

                  {/* MIDDLE: STATUS */}
                  <span
                    className={`status-badge ${
                      r.isApproved ? "approved" : "pending"
                    }`}
                  >
                    {r.isApproved ? "Approved" : "Pending"}
                  </span>

                  {/* RIGHT: ACTION */}
                  {!r.isApproved ? (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(r._id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      className="danger-btn"
                      onClick={() => openDeleteModal(r)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ORDERS */}
          <div className="admin-card full-width orders-list">
            <h3>All Orders</h3>

            {orders.length === 0 ? (
              <p className="empty-text">No orders yet</p>
            ) : (
              <div className="admin-orders">
                {orders.map((o) => (
                  <div key={o._id} className="admin-order-row">
                    <div className="order-left">
                      <span className="order-id">#{o._id.slice(-6)}</span>
                      <span className={`status-badge ${o.status}`}>
                        {o.status}
                      </span>
                    </div>

                    <div className="order-right">
                      <span className="order-amount">₹{o.totalAmount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Restaurant</h3>

            <p className="modal-warning">
              This will permanently delete the restaurant and all its products.
              <br />
              This action <strong>cannot</strong> be undone.
            </p>

            <p className="modal-hint">
              Type the restaurant email to confirm:
            </p>

            <input
              type="email"
              placeholder={selectedRestaurant.email}
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />

            {deleteError && (
              <p className="error-text">{deleteError}</p>
            )}

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;