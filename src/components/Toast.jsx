import { useEffect, useState } from "react";
import "./Toast.css";

const Toast = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail);
      setTimeout(() => setMessage(""), 2500);
    };

    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  if (!message) return null;

  return <div className="toast">{message}</div>;
};

export default Toast;