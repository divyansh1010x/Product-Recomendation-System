import React, { Component } from "react";
import Slider from "react-slick";
import ProductCard from "./productCardVertical"; // Adjust the import if necessary
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class ProductSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    const { productIds } = this.props; // Get productIds from props
    if (productIds && productIds.length > 0) {
      this.fetchProducts(productIds); // Fetch products if productIds are provided
    }
  }

  fetchProducts = async (productIds) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/products?ids=${productIds.join(',')}`);
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
            <div key={product.key}> {/* Use product.id for the key */}
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
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

// PropTypes can be added to ensure that productIds are passed correctly
ProductSlider.defaultProps = {
  productIds: [], // Default to an empty array if no productIds are provided
};

export default ProductSlider;
