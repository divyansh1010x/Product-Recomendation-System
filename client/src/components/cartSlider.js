import React, { Component } from "react";
import Slider from "react-slick";
import ProductCard from "./cartCard"; // Adjust import path if necessary
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class ProductSlider extends Component {
  state = {
    products: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    const { productIds } = this.props;
    if (productIds && productIds.length > 0) {
      this.fetchProducts(productIds);
    }
  }

  fetchProducts = async (productIds) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?ids=${productIds.join(',')}`);
      this.setState({ products: response.data, loading: false });
    } catch (error) {
      this.setState({ error: "Error fetching products.", loading: false });
    }
  };

  render() {
    const { loading, error, products } = this.state;
    const { onRemoveFromCart } = this.props; // Get the remove function passed from CartPage

    console.log("Products:", products); // Log fetched products
    console.log("onRemoveFromCart:", onRemoveFromCart); // Log the remove function

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard
              id={product.key}
              imgSrc={product.image}
              name={product.name}
              price={product.price}
              description={product.description}
              rating={product.rating}
              reviews={product.reviews}
              model={product.model}
              brand={product.brand}
              category={product.category}
              onRemoveFromCart={onRemoveFromCart} // Pass the remove function to ProductCard
            />
          </div>
        ))}
      </Slider>
    );
  }
}

ProductSlider.defaultProps = {
  productIds: [],
};

export default ProductSlider;
