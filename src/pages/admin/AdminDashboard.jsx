import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllRestaurants,
  approveRestaurant,
  getAllOrders,
  deleteUser,
} from "../../api/admin.api";
import api from "../../api/axios";
import "./AdminDashboard.css";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN");

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState(null); // "user" | "restaurant"
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");

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

  const openDeleteModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setConfirmEmail("");
    setError("");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
    setConfirmEmail("");
    setError("");
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    if (confirmEmail !== selectedItem.email) {
      setError("Email does not match.");
      return;
    }

    try {
      if (modalType === "restaurant") {
        await api.delete(`/admin/restaurants/${selectedItem._id}`, {
          data: { email: confirmEmail },
        });
      } else {
        await deleteUser(selectedItem._id, confirmEmail);
      }

      closeModal();
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Delete failed"
      );
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <div className="admin-dashboard">
        <h2 className="admin-title">Admin Dashboard</h2>

        <div className="admin-grid">
          {/* USERS */}
          <div className="admin-card">
            <h3>Users ({users.length})</h3>

            {users.map((u) => (
              <div key={u._id} className="admin-user-row">
                <div>
                  <strong>{u.username}</strong>
                  <p>{u.email}</p>
                  <small>Joined: {formatDate(u.createdAt)}</small>
                </div>

                <button
                  className="danger-btn"
                  onClick={() => openDeleteModal("user", u)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* RESTAURANTS */}
          <div className="admin-card">
            <h3>Restaurants ({restaurants.length})</h3>

            {restaurants.map((r) => (
              <div key={r._id} className="restaurant-row">
                <div>
                  <strong>{r.name}</strong>
                  <p>{r.email}</p>
                  <small>
                    Joined: {formatDate(r.createdAt)}
                  </small>
                </div>

                <span
                  className={`status-badge ${
                    r.isApproved ? "approved" : "pending"
                  }`}
                >
                  {r.isApproved ? "Approved" : "Pending"}
                </span>

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
                    onClick={() =>
                      openDeleteModal("restaurant", r)
                    }
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ORDERS */}
          <div className="admin-card full-width">
            <h3>Orders ({orders.length})</h3>

            {orders.map((o) => (
              <div key={o._id} className="admin-order-row detailed">
                <div>
                  <strong>#{o._id.slice(-6)}</strong>
                  <p>
                    User: {o.userId?.username} (
                    {o.userId?.email})
                  </p>
                  <p>Items: {o.items?.length || 0}</p>
                  <p>Payment: {o.paymentMethod}</p>
                  <small>
                    {formatDate(o.createdAt)}
                  </small>
                </div>

                <div>
                  <span
                    className={`status-badge ${o.status}`}
                  >
                    {o.status}
                  </span>
                  <p className="order-amount">
                    ₹{o.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalType && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              Delete {modalType === "user" ? "User" : "Restaurant"}
            </h3>

            <p>
              Type the email to confirm permanent deletion:
            </p>

            <input
              type="email"
              value={confirmEmail}
              onChange={(e) =>
                setConfirmEmail(e.target.value)
              }
            />

            {error && (
              <p className="error-text">{error}</p>
            )}

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={closeModal}
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
