import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ cartCount, foodItems }) => {
  const navigate = useNavigate();
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    if (foodItems?.length) {
      const low = foodItems.filter(item => item.quantity <= 5);
      setLowStock(low);
    }
  }, [foodItems]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Food Management Dashboard</h2>
        <p>User panel for monitoring inventory and food metrics</p>
      </header>

      <div className="dashboard-actions">
        <button className="action-btn primary" onClick={() => navigate("/food")}>
          Menu
        </button>
        <button className="action-btn secondary" onClick={() => navigate("/cart")}>
          Cart 
        </button>
        <button className="action-btn tertiary" onClick={() => navigate("/orders")}>
          Orders
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p>{foodItems.length}</p>
        </div>

        <div className="stat-card">
          <h3>Low Stock Alerts</h3>
          {lowStock.length ? (
            <ul>
              {lowStock.map(item => (
                <li key={item.id || item._id}>
                  {item.name} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No low stock items</p>
          )}
        </div>
      </div>

      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
