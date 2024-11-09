import React, { useState, useEffect } from "react";
import ProductSlider from "../components/cartSlider"; // Adjust import path if necessary
import Navbar from "../components/navBar";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Retrieve cart (product IDs) from session storage when the component mounts
    const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(cartItems); // Update the state with the cart items
  }, []);

  const handleRemoveFromCart = (productId) => {
    // Remove the product from the cart
    const updatedCart = cart.filter((id) => id !== productId);

    // Ensure the new cart array reference is different
    setCart([...updatedCart]);

    // Save the updated cart to sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    // Clear all items from the cart
    setCart([]);

    // Clear the cart from sessionStorage
    sessionStorage.removeItem("cart");
  };

  const handleBuy = () => {
    // Handle the buy action (e.g., proceed to checkout)
    console.log("Proceeding to checkout with cart:", cart);
    // You can add more logic for actual checkout here
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.heading}>Your Cart</h2>
        {/* Check if the cart is empty */}
        {cart.length === 0 ? (
          <p style={styles.emptyCart}>No items in the cart</p>
        ) : (
          <ProductSlider productIds={cart} onRemoveFromCart={handleRemoveFromCart} />
        )}
        
        {/* Clear Cart Button */}
        {cart.length > 0 && (
          <button style={styles.clearCartButton} onClick={handleClearCart}>
            Clear Cart
          </button>
        )}

        {/* Buy Button */}
        {cart.length > 0 && (
          <button style={styles.buyButton} onClick={handleBuy}>
            Buy
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    padding: "20px",
    textAlign: "center",
    marginTop: "30px",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "20px",
  },
  emptyCart: {
    fontSize: "1.5rem",
    color: "#ff4d4f",
    fontWeight: "bold",
    marginTop: "20px",
  },
  clearCartButton: {
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "20px",
    borderRadius: "5px",
  },
  buyButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "10px",
    borderRadius: "5px",
  },
};

export default CartPage;
