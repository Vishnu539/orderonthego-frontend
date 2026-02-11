import { useEffect, useState } from "react";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../api/restaurant.api";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await getRestaurantOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderActions = (order) => {
    if (order.status === "pending") {
      return (
        <>
          <button
            className="action-btn primary"
            disabled={updatingId === order._id}
            onClick={() => handleStatusUpdate(order._id, "accepted")}
          >
            Accept
          </button>
          <button
            className="action-btn danger"
            disabled={updatingId === order._id}
            onClick={() => handleStatusUpdate(order._id, "cancelled")}
          >
            Cancel
          </button>
        </>
      );
    }

    if (order.status === "accepted") {
      return (
        <>
          <button
            className="action-btn primary"
            disabled={updatingId === order._id}
            onClick={() => handleStatusUpdate(order._id, "preparing")}
          >
            Preparing
          </button>
          <button
            className="action-btn danger"
            disabled={updatingId === order._id}
            onClick={() => handleStatusUpdate(order._id, "cancelled")}
          >
            Cancel
          </button>
        </>
      );
    }

    if (order.status === "preparing") {
      return (
        <button
          className="action-btn success"
          disabled={updatingId === order._id}
          onClick={() => handleStatusUpdate(order._id, "delivered")}
        >
          Delivered
        </button>
      );
    }

    return null;
  };

  if (loading) {
    return <p className="loading-text">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="empty-text">No orders yet</p>;
  }

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          {/* Header */}
          <div className="order-header">
            <div>
              <h4 className="order-id">Order #{order._id.slice(-6)}</h4>
              <span className={`status-badge ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-total">₹{order.totalAmount}</div>
          </div>

          {/* Items */}
          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span className="item-name">
                  {item.productId?.name || "Item"}
                </span>
                <span className="item-qty">× {item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="order-actions">
            {renderActions(order)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantOrders;