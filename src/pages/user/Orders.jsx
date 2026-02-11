import { useEffect, useState } from "react";
import { getUserOrders } from "../../api/order.api";

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return { background: "#FEF3C7", color: "#92400E" };
    case "accepted":
      return { background: "#DBEAFE", color: "#1E40AF" };
    case "completed":
      return { background: "#DCFCE7", color: "#166534" };
    case "cancelled":
      return { background: "#FEE2E2", color: "#991B1B" };
    default:
      return { background: "#E5E7EB", color: "#374151" };
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p style={{ padding: "24px" }}>Loading your orders...</p>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>Your Orders</h2>

      {orders.length === 0 && (
        <p>You haven’t placed any orders yet.</p>
      )}

      {orders.map((order) => {
        const calculatedTotal =
          order.totalAmount ??
          order.items.reduce(
            (sum, item) =>
              sum +
              (item.productId?.price || 0) * item.quantity,
            0
          );

        return (
          <div
            key={order._id}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <strong>Order #{order._id.slice(-6)}</strong>

              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  ...getStatusStyle(order.status),
                }}
              >
                {order.status}
              </span>
            </div>

            {/* DATE */}
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* ITEMS */}
            <div style={{ marginTop: "12px" }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    padding: "6px 0",
                  }}
                >
                  <span>
                    {item.productId?.name} × {item.quantity}
                  </span>
                  <span>
                    ₹
                    {(item.productId?.price || 0) *
                      item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "600",
              }}
            >
              <span>Total</span>
              <span>₹{calculatedTotal}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;