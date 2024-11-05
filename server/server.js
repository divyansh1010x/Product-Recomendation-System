const express = require("express");
const cors = require("cors");
const products = require("./dataset/MOCK_DATA.json"); // Update path if necessary
const { exec } = require("child_process");
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to get product IDs (you can customize this as needed)
app.get("/api/product-ids", (req, res) => {
  // Return an array of product keys (or IDs)
  const productIds = [1, 2, 3, 4, 100];
  res.json(productIds);
});

// Endpoint to get products based on provided IDs
app.get("/api/products", (req, res) => {
  const ids = req.query.ids.split(",").map(Number); // Convert IDs from query string to an array of numbers
  const filteredProducts = products.filter((product) => ids.includes(product.key));
  res.json(filteredProducts);
});

app.post('/recommend', (req, res) => {
  console.log("Received request body:", req.body); // Log the entire request body

  const user = req.body.user; // Access userId
  console.log(`User ID: ${user}`); // Log the user ID received

  if (!user) {
      return res.status(400).json({ error: 'userId is required' });
  }

  // Execute the C++ program with the user ID as an argument
  const cppExecutable = path.join(__dirname, 'cpp_algorithms', 'user_recommend.exe');
  console.log(`"${cppExecutable}" ${user}`);
  
  exec(`"${cppExecutable}" ${user}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error executing C++ program: ${error.message}`);
          return res.status(500).json({ error: 'Failed to get recommendations' });
      }
      console.log("executed");
      
      if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).json({ error: 'Error in C++ program' });
      }

      // Parse the JSON output from C++ and send it as the response
      try {
          const result = JSON.parse(stdout);
          console.log(result);
          res.json(result);
      } catch (parseError) {
          console.error(`Failed to parse JSON output: ${parseError.message}`);
          res.status(500).json({ error: 'Failed to parse recommendations' });
      }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
