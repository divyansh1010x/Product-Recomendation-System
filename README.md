# E-Commerce Website with DSA Algorithms

This project is an e-commerce website built using **React**, **Node.js**, **Express.js**, and **C++** algorithms. It uses various **Data Structures and Algorithms (DSA)** to provide product recommendations, manage cart functionality, and enable product search. The site also includes a sample dataset of users, products, and transactions.

## Features

- **User Authentication**: 
  - Login and sign up functionality for users.
  
- **Product Recommendations**:
  - **Similarity Matrix (Python)**: Recommend products based on similar users.
  - **Favorite Category (Heaps)**: Recommend products from a user's favorite category.
  - **Similar Products (Bipartite Graphs in C++)**: Recommend products based on similar products purchased by users.
  - **Trending Products (Heaps)**: Recommend globally trending products.

- **Cart Functionality**:
  - Add products to the cart.
  - View frequently bought products while viewing the cart.
  - Simulated "Buy" button that registers transactions in the dataset.

- **Product Search**: 
  - Search for products from the dataset using a tree-based search algorithm in C++.

## Technologies Used

- **Frontend**: React
  
- **Backend**: Node.js, Express.js
  
- **Algorithms**: 
  - Python for **Similarity Matrix** based recommendations.
  - C++ for:
    - **Heaps** for category and trending product recommendations.
    - **Bipartite Graphs** for similar product recommendations.
    - **Trees** for product search.
  - **nlohmann JSON** for JSON processing in C++.

## Installation

To get started with this project, follow the steps below:

### 1. Clone the Repository

```bash
git clone https://github.com/divyansh1010x/Product-Recomendation-System.git
cd Product-Recomendation-System
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Run the Application

To run the backend server, navigate to the backend folder and run:
```bash
#Product-Recomendation-System/server
npm start
```

To run the frontend, navigate to the frontend folder and run:
```bash
#Product-Recomendation-System/client
npm start
```

The application should now be running, and you can access it in your browser.

## Usage

- **Sign Up / Log In**:
  - Use the sign-up page to create a new user or log in with existing credentials.

- **Recommendations**:
  - Product recommendations will be made automatically based on the user's preferences, favorite categories, trending products, and similar products.

- **Cart Functionality**:
  - Add products to your cart and receive suggestions for frequently bought products while viewing your cart.

- **Product Search**:
  - Use the search feature to search for products within the dataset.

- **Buy Products**:
  - Use the dummy "Buy" button to simulate a transaction, which will be logged in the dataset.

## Data Structures & Algorithms Used

- **Similarity Matrix (Python)**:
  - A recommendation engine that suggests products based on user similarities.

- **Heaps (C++)**:
  - Utilized for recommending products from a user’s favorite category and for showing trending products.
    
- **Bipartite Graphs (C++)**:
  - Used to recommend products based on the relationship between users and products, identifying which products are similar.

- **Trees (C++)**:
  - Enables fast searching of products using tree-based algorithms.

## Acknowledgments

- **nlohmann JSON**: Used for JSON parsing and handling in C++.
  
- **React**: Used for building the frontend.
  
- **Node.js and Express.js**: Used to build the backend services.

