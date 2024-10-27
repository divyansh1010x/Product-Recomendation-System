const express = require("express");
const cors = require("cors");
const products = require("./MOCK_DATA.json"); // Update path if necessary

const app = express();
const PORT = 5000;

app.use(cors());

// Endpoint to get product IDs (you can customize this as needed)
app.get("/api/product-ids", (req, res) => {
  // Return an array of product keys (or IDs)
  const productIds = [1, 2, 3, 4, 5];
  res.json(productIds);
});

// Endpoint to get products based on provided IDs
app.get("/api/products", (req, res) => {
  const ids = req.query.ids.split(",").map(Number); // Convert IDs from query string to an array of numbers
  const filteredProducts = products.filter((product) => ids.includes(product.key));
  res.json(filteredProducts);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
