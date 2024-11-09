import React, { useState, useEffect } from "react";
import ProductSlider from "../components/cartSlider"; // Adjust import path if necessary
import Navbar from "../components/navBar";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false); // New state for purchase status

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
    // Retrieve 'user' and 'cart' from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user")); // Parse user as an object
    const cart = JSON.parse(sessionStorage.getItem("cart")); // Parse cart as an array
  
    // Check if user and cart data exist and are valid
    if (!user || !user.user_id || !cart || !Array.isArray(cart) || cart.length === 0) {
      console.log("User or cart data is missing or invalid.");
      alert("User or cart data is missing or invalid.");
      return;
    }
  
    // Prepare data in the required format with 'products' as an array
    const formattedData = {
      user: String(user.user_id),    // Convert user_id to a string
      products: cart                 // Send cart as an array, as expected by the API
    };
  
    // Display formatted data in console for debugging
    console.log("Proceeding to checkout with data:", formattedData);
  
    // Make API request to /api/purchase
    fetch('http://localhost:5001/api/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("Error:", data.error);
        alert("Failed to complete purchase: " + data.error);
      } else {
        console.log("Success:", data.message);
        alert("Purchase successful!");

        // Clear the cart from sessionStorage and update the state
        sessionStorage.removeItem("cart");
        setCart([]);
        
        // Display the thank you message by setting purchaseCompleted to true
        setPurchaseCompleted(true);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while processing your purchase.");
    });
  };
  
  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.heading}>Your Cart</h2>

        {/* Check if the purchase is completed and show thank you message */}
        {purchaseCompleted ? (
          <p style={styles.thankYouMessage}>Thank you for your purchase!</p>
        ) : (
          <>
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
          </>
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
  thankYouMessage: {
    fontSize: "1.8rem",
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: "30px",
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
