import React from "react";
import { Card, Button } from "react-bootstrap";
import "./productCard.css"; // Styling for the product card

const ProductCard = ({
  id,
  imgSrc,
  name,
  description,
  price,
  brand,
  model,
  category,
  rating,
  reviews,
  onRemoveFromCart,
}) => {
  const handleRemoveFromCart = () => {
    console.log("Removing product with ID:", id); // Log ID when remove button is clicked
    onRemoveFromCart(id); // Call the remove function passed from the parent (CartPage)
  };

  return (
    <Card className="product-card text-center">
      <Card.Img variant="top" src={imgSrc} className="product-image" />
      <Card.Body>
        <Card.Title className="product-title">{name}</Card.Title>
        <Card.Text className="product-description">
          {description.length > 50 ? `${description.substring(0, 50)}...` : description}
        </Card.Text>
        <Card.Text className="product-price">
          <strong>Rs. {price}</strong>
        </Card.Text>
        <Card.Text className="product-brand"><strong>Brand:</strong> {brand}</Card.Text>
        <Card.Text className="product-model"><strong>Model:</strong> {model}</Card.Text>
        <Card.Text className="product-category">Category: {category}</Card.Text>
        <div className="product-rating">
          ⭐ <strong>{rating}</strong> ({reviews} reviews)
        </div>
        <div className="product-actions">
          <Button 
            variant="danger" 
            className="remove-from-cart-btn" 
            onClick={handleRemoveFromCart}
          >
            Remove from Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
