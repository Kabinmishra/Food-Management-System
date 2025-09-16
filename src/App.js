import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import FoodList from "./components/FoodList";
import Cart from "./components/Cart";
import OrderHistory from "./components/OrderHistory";
import { getFoodItems } from "./services/api";
import { CartProvider, useCart } from "./context/CartContext";
import "./App.css";
import LogIn from "./components/Login";

function AppContent() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { orders } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foods = await getFoodItems();
        setFoodItems(foods.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/Dashboard" element={<Dashboard foodItems={foodItems} />} />
      <Route path="/food" element={<FoodList foodItems={foodItems} />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<OrderHistory orders={orders} />} />
    </Routes>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <header className="header">
            <h1>Food Management System</h1>
          </header>
          <AppContent />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
