import React from "react";
import { Card, Button } from "react-bootstrap";
import "./productCard.css";

const ProductCard = (props) => {
  // Function to handle adding the product key to the cart
  const addToCart = () => {
    // Retrieve the cart from session storage (or initialize as an empty array if it doesn't exist)
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    
    // Check if the product ID is already in the cart to avoid duplicates
    if (!cart.includes(props.id)) {
      cart.push(props.id); // Add only the product ID
      sessionStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart array back to session storage
    }
  };

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
          <Button variant="primary" onClick={addToCart}>Add to Cart</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
