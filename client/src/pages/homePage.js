// src/HomePage.js
import React from 'react';
import ProductSliderBasic from '../components/productSlider';

export default function HomePage() {
  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="header py-4 text-center">
        <h1 className="text-3xl font-bold">Welcome to Our Store</h1>
        <p className="text-lg text-gray-600 mt-2">
          Explore our exclusive collection of products
        </p>
      </header>

      {/* Product Slider Section */}
      <section className="product-slider-section mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <ProductSliderBasic />
      </section>

      {/* Footer Section */}
      <footer className="footer py-4 text-center mt-8 border-t">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Our Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
