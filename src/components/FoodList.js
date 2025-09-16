import React, { useState, useEffect } from "react";
import "./FoodList.css";

const FoodList = ({ onAddToCart }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://172.17.17.63:8080/api/food");
        if (!response.ok) throw new Error("Failed to fetch food items");
        const data = await response.json();
        console.log("Fetched food data:", data);

        let foodArray = [];
        if (Array.isArray(data)) {
          foodArray = data;
        } else if (Array.isArray(data.food)) {
          foodArray = data.food;
        } else if (Array.isArray(data.data?.content)) {
          foodArray = data.data.content;
        } else {
          foodArray = [data];
        }

        setFoodItems(foodArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const categories = ["All", ...new Set(foodItems.map((item) => item.category || item.categoryName))];

  const filteredItems = foodItems
    .filter(
      (item) =>
        (selectedCategory === "All" || item.category === selectedCategory || item.categoryName === selectedCategory) &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "expiry":
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        case "category":
          return (a.category || a.categoryName).localeCompare(b.category || b.categoryName);
        default:
          return 0;
      }
    });

  if (loading) return <p className="loading">Loading food items...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="food-list-container">
      <div className="food-list-header">
        <h2>My Food Inventory</h2>
        <p className="subtitle">Manage your food items and reduce waste</p>
      </div>

      <div className="food-list-controls">
        <div className="search-control">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-control">
            <label>Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-control">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="expiry">Expiry Date</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-info">
        <p>
          Showing {filteredItems.length} of {foodItems.length} items
          {selectedCategory !== "All" && ` in category "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      <div className="food-grid">
        {filteredItems.map((item) => (
          <div key={item.id || item._id} className="food-card">
            <h3>{item.name}</h3>
            <p>Category: {item.category || item.categoryName}</p>
            <p>Price: Rs{item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p className="desc">{item.description}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <h3>No food items found</h3>
          <p>Try changing your filters or adding new items</p>
        </div>
      )}
    </div>
  );
};

export default FoodList;
