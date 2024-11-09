import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import "./productCard.css";

const ProductCard = (props) => {
  // State to manage the button text (whether the product is added or not)
  const [isAdded, setIsAdded] = useState(false);

  // Function to handle adding the product ID to the cart
  const addToCart = () => {
    // Retrieve the cart from session storage (or initialize as an empty array if it doesn't exist)
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Check if the product ID is already in the cart to avoid duplicates
    if (!cart.includes(props.id)) {
      cart.push(props.id); // Add only the product ID
      sessionStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart array back to session storage
      setIsAdded(true); // Update the state to reflect that the item was added
    }
  };

  // Check if the product ID is already in the cart on component mount
  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    if (cart.includes(props.id)) {
      setIsAdded(true); // If product ID exists in the cart, set the button to "Added to Cart"
    }
  }, [props.id]); // Re-run this effect when the product ID changes

  return (
    <Card className="product-card text-center">
      <Card.Img variant="top" src={props.imgSrc} className="product-image" />
      <Card.Body>
        <Card.Title className="product-title">{props.name}</Card.Title>
        <Card.Text className="product-description">
          {props.description.length > 50
            ? `${props.description.substring(0, 50)}...`
            : props.description}
        </Card.Text>
        <Card.Text className="product-price"><strong>Rs. {props.price}</strong></Card.Text>
        <Card.Text className="product-brand"><strong>Brand:</strong> {props.brand}</Card.Text>
        <Card.Text className="product-model"><strong>Model:</strong> {props.model}</Card.Text>
        <Card.Text className="product-category">Category: {props.category}</Card.Text>
        <div className="product-rating">
          ⭐ <strong>{props.rating}</strong> ({props.reviews} reviews)
        </div>
        <div className="product-actions">
          <Button variant="primary" onClick={addToCart} disabled={isAdded}>
            {isAdded ? "Added to Cart" : "Add to Cart"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
