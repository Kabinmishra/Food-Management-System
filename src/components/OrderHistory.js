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

        const data = response.data.data || [];
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading order history:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch order history"
        );
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading order history...</p></div>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="order-history-container">
      <div className="order-header">
        <h2>Order History</h2>
        <p>Your recent orders and purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-pizza-slice"></i>
          </div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Start ordering now!</p>
          <button className="order-now-btn">Order Now</button>
        </div>
      ) : (
        <div className="orders-content">
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Total Orders</span>
              <span className="summary-value">{orders.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Spent</span>
              <span className="summary-value">
                Rs
                {orders
                  .reduce((sum, order) => sum + order.totalPrice, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>

          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-item-header">
                  <h3>Order #{order.id}</h3>
                  <span className="order-status">{order.status}</span>
                </div>

                <div className="order-details">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="detail-row">
                      <span>
                        {item.foodName} (x{item.quantity})
                      </span>
                      <span>Rs{item.lineTotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="detail-row total-row">
                    <span>Total</span>
                    <span>Rs{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-footer">
                  <span className="order-date">
                    {formatDate(order.createdAt)}
                  </span>
                  <button className="reorder-btn">Reorder</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
