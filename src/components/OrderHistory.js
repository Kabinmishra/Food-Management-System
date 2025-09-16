import React, { useState, useEffect } from "react";
import instance from "../instance/axiosinstance"; 
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await instance.get("http://172.17.17.63:8080/api/order/myOrder"); 

        
        console.log("Full response:", response.data);

        
        const data = response.data?.data?.items || [];

        setOrders(data);

      } catch (err) {
        console.error("Error loading order history:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch order history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const total = (item) => (item.unitPrice * item.quantity).toFixed(2);

  if (loading) return <p className="loading">Loading order history...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="order-history-container">
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((item, index) => (
            <li key={item.id || item._id || index} className="order-item">
              <p><strong>{item.foodName}</strong></p>
              <p>
                Rs{item.unitPrice} × {item.quantity} = Rs{total(item)}
              </p>
              <p>Date: {item.orderDate || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
