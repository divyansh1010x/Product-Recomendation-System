const express = require("express");
const cors = require("cors");
const products = require("./dataset/MOCK_DATA.json"); // Update path if necessary
const { exec } = require("child_process");
const path = require('path');
const fs = require("fs"); 
const { stdout, stderr } = require("process");
const { log } = require("console");
const os = require("os");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const userDataPath = path.join(__dirname, 'dataset', 'users_data.json');
const transactionsFilePath = path.join(__dirname, 'dataset', 'dummy2.json');

function getExecutableFile(fileName) {
  const platform = os.platform();
  return platform === 'win32' ? `${fileName}.exe` : fileName;
}

// Endpoint to get product IDs (you can customize this as needed)
app.get("/api/product-ids", (req, res) => {
  // Return an array of product keys (or IDs)
  const productIds = [1, 2, 3, 4, 100];
  res.json(productIds);
});

// Endpoint to get products based on provided IDs
app.get("/api/products", (req, res) => {
  const ids = req.query.ids.split(",").map(Number); // Convert IDs from query string to an array of numbers
  const filteredProducts = ids
    .map(id => products.find(product => product.key === id)) // Find products in the same order as `ids`
    .filter(product => product !== undefined); // Filter out any undefined entries in case of missing ids
  
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
  const cppExecutable = path.join(__dirname, 'cpp_algorithms', getExecutableFile('user_recommend'));
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

// Endpoint to handle user-based recommendations (renamed)
app.post('/userby_recommendation', (req, res) => {
  const userId = req.body.user; // User ID received from the request body
  console.log(`Received User ID: ${userId}`);

  if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
  }

  // Path to the Python script that handles recommendations
  const pythonScriptPath = path.join(__dirname, 'recommendation.py');
  
  // Execute the Python script and pass the userId as argument
  exec(`python "${pythonScriptPath}" ${userId}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          return res.status(500).json({ error: 'Failed to get recommendations' });
      }
      
      if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).json({ error: 'Error in Python script' });
      }

      try {
          // Parse the JSON output from Python script and send it as the response
          const recommendations = JSON.parse(stdout);
          res.json(recommendations);
      } catch (parseError) {
          console.error(`Failed to parse JSON output: ${parseError.message}`);
          res.status(500).json({ error: 'Failed to parse recommendations' });
      }
  });
});

app.post('/trending', (req, res) => {
  console.log(req.body);

  const category = req.body.category || "toys";  // Only taking category now
  const cppExecutable = path.join(__dirname, `cpp_algorithms`, getExecutableFile(`trending`));
  console.log(`${cppExecutable} "${category}"`);  // Updated command to only use category
  
  // Execute the C++ program with just the category argument
  exec(`"${cppExecutable}" "${category}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing C++ program: ${error.message}`);
      return res.status(500).json({ error: 'Failed to get recommendations' });
    }
    console.log("executed");

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Error in C++ program' });
    }

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

app.post('/fav_category', (req, res) => {
  const userId = req.body.user;  // assuming req.body contains { user: "97" }

  const cppExecutable = path.join(__dirname, 'cpp_algorithms', getExecutableFile('fav_category'));
  const command = `"${cppExecutable}" ${userId}`;
  console.log(`Executing command: ${command}`); // Log command being executed

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error executing C++ program: ${error.message}`);
      return res.status(500).json({ error: 'Failed to get recommendations' });
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Error in C++ program' });
    }

    // Log the raw output to inspect the favorite category
    console.log(`Raw output (favorite category): ${stdout}`);

    try {
      const result = JSON.parse(stdout);
      console.log(result);  // Log parsed result
      res.json(result);
    } catch (parseError) {
      console.error(`Failed to parse JSON output: ${parseError.message}`);
      res.status(500).json({ error: 'Failed to parse recommendations' });
    }
  });
});


app.post('/search', (req, res) => {
  log(req.body);

  const searchTerm = req.body.searchTerm;
  console.log(searchTerm);
  
  const cppExecutable = path.join(__dirname, `cpp_algorithms`, getExecutableFile(`search`));
  console.log(`"${cppExecutable}" ${searchTerm}`);

  exec(`"${cppExecutable}" ${searchTerm}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing C++ program: ${error.message}`);
      return res.status(500).json({ error: 'Failed to get recommendations' });
    }
    console.log("executed");

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Error in C++ program' });
    }

    try {
      const result = JSON.parse(stdout);
      console.log(result);
      res.json(result);
    } catch (parseError) {
      console.error(`Failed to parse JSON output: ${parseError.message}`);
      res.status(500).json({ error: 'Failed to parse recommendations' });
    }
  })
  
});

app.post('/api/login', (req, res) => {
  const { name, userId } = req.body;
  fs.readFile(userDataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading user data' });
    
    const users = JSON.parse(data);
    const user = users.find(u => u.user_id.toString() === userId && u.name === name);
    
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  });
});
// Endpoint for user signup
app.post('/api/signup', (req, res) => {
  const { name, age, country, gender } = req.body;
  // Read the existing user data
  fs.readFile(userDataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading user data: ${err.message}`);
      return res.status(500).json({ error: 'Failed to read user data' });
    }
    let users = [];
    try {
      users = JSON.parse(data); // Parse the existing user data
    } catch (parseError) {
      console.error(`Error parsing user data: ${parseError.message}`);
      return res.status(500).json({ error: 'Failed to parse user data' });
    }
    // Generate the new user_id by getting the max user_id and adding 1
    const newUserId = Math.max(...users.map(user => user.user_id), 0) + 1;
    // Create the new user object
    const newUser = { user_id: newUserId, name, age, country, gender };
    // Add the new user to the users array
    users.push(newUser);
    // Write the updated users array back to users_data.json
    fs.writeFile(userDataPath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(`Error writing user data: ${writeErr.message}`);
        return res.status(500).json({ error: 'Failed to save user data' });
      }
      console.log('New user added:', newUser);
      // Respond with the new user's details, including the user_id
      res.status(201).json(newUser);
    });
  });
});

// Endpoint to handle multiple product purchases
app.post('/api/purchase', (req, res) => {
  const { user, products } = req.body; // 'products' is an array of product IDs
  
  // Validate request
  if (!user || !products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'User and an array of product IDs are required' });
  }
  
  // Format transaction data with only 'user' and 'product' fields
  const newTransaction = {
    user: user,
    product: products.join(",") // Join product IDs into a comma-separated string
  };

  // Read the existing transactions file
  fs.readFile(transactionsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading transactions file' });
    
    let transactions = [];
    try {
      transactions = JSON.parse(data);
    } catch (parseError) {
      console.error(`Error parsing transactions data: ${parseError.message}`);
      return res.status(500).json({ error: 'Failed to parse transactions data' });
    }

    // Add the new transaction to the transactions array
    transactions.push(newTransaction);

    // Save the updated transactions back to the file
    fs.writeFile(transactionsFilePath, JSON.stringify(transactions, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(`Error writing transactions file: ${writeErr.message}`);
        return res.status(500).json({ error: 'Failed to save transactions file' });
      }

      console.log('Transaction logged successfully!');
      res.status(200).json({ message: 'Purchase successful' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
