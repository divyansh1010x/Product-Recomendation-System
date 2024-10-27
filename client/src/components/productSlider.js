import React, { Component } from "react";
import Slider from "react-slick";
import ProductCard from "./productCardVertical";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class ProductSlider extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    this.fetchProductIds();
  }

  fetchProductIds = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/product-ids");
      const productIds = response.data;
      this.fetchProducts(productIds);
    } catch (error) {
      console.error("Error fetching product IDs:", error);
    }
  };

  fetchProducts = async (productIds) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?ids=${productIds.join(',')}`);
      this.setState({ products: response.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  render() {
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

    return (
      <div>
        <Slider {...settings}>
          {this.state.products.map((product) => (
            <div key={product.key}>
              <ProductCard
                imgSrc={product.image}
                name={product.name}
                price={product.price}
                description={product.description}
                rating={product.rating}
                reviews={product.reviews}
                model={product.model}
                brand={product.brand}
                category={product.category}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

export default ProductSlider;
