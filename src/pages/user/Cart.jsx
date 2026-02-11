import { useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  decrementCartItem,
} from "../../api/cart.api";
import { placeOrder } from "../../api/order.api";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const navigate = useNavigate();

  const fetchCart = async () => {
    const res = await getCart();
    setCartItems(res.data || []);
    setLoading(false);
    window.dispatchEvent(new Event("cart-updated"));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increment = async (productId) => {
    await addToCart({ productId, quantity: 1 });
    fetchCart();
  };

  const decrement = async (productId) => {
    await decrementCartItem(productId);
    fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await removeFromCart(cartItemId);
    fetchCart();
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);

      await placeOrder({
        address: "Test Street, Test City, Test State - 600001",
        paymentMethod: "COD",
      });

      setCartItems([]);
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/user/orders");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  const total = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 && <p>Your cart is empty</p>}

      {cartItems.map((item) => (
        <div
          key={item._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
            border: "1px solid #e5e7eb",
            marginBottom: "12px",
            borderRadius: "12px",
          }}
        >
          <div>
            <strong>{item.productId.name}</strong>
            <p>₹{item.productId.price}</p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              className="qty-btn"
              onClick={() => decrement(item.productId._id)}
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              className="qty-btn"
              onClick={() => increment(item.productId._id)}
            >
              +
            </button>

            <button
              className="btn btn-outline"
              onClick={() => removeItem(item._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {cartItems.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Total: ₹{total}</h3>

          <button
            className="btn btn-primary"
            style={{ marginTop: "12px" }}
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;