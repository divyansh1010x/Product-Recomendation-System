#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include "../include/nlohmann/json.hpp"

using json = nlohmann::json;

// Function to parse a comma-separated string of product IDs into a set
std::unordered_set<int> parseCartInput(const std::string& cartInput) {
    std::unordered_set<int> cart;
    std::stringstream ss(cartInput);
    std::string item;
    while (getline(ss, item, ',')) {
        cart.insert(std::stoi(item));
    }
    return cart;
}

// Function to parse a comma-separated string of product IDs into a vector
std::vector<int> parseProductString(const std::string& productString) {
    std::vector<int> products;
    std::stringstream ss(productString);
    std::string item;
    while (getline(ss, item, ',')) {
        products.push_back(std::stoi(item));
    }
    return products;
}

// Function to load transaction data from a JSON file
std::unordered_map<int, std::vector<int>> loadTransactionData(const std::string& filename) {
    std::ifstream file(filename);
    json transactionsJson;
    file >> transactionsJson;

    std::unordered_map<int, std::vector<int>> userPurchases;

    for (const auto& transaction : transactionsJson) {
        int userId;
        if (transaction["user"].is_string()) {
            userId = std::stoi(transaction["user"].get<std::string>());
        } else {
            userId = transaction["user"].get<int>();
        }

        // Parse the product field as a comma-separated string
        std::vector<int> products;
        if (transaction["product"].is_string()) {
            products = parseProductString(transaction["product"].get<std::string>());
        }

        userPurchases[userId] = products;
    }

    return userPurchases;
}

// Function to build a recommendation list based on all cart items combined
std::vector<int> getRecommendations(const std::unordered_set<int>& cart,
                                    const std::unordered_map<int, std::vector<int>>& userPurchases,
                                    int recommendationCount = 15) {
    // Map to store counts of each product purchased with any item in the cart
    std::unordered_map<int, int> productCounts;

    // Process each user transaction
    for (const auto& userPurchase : userPurchases) {
        const std::vector<int>& products = userPurchase.second;

        // Check if any product in the transaction matches the cart items
        bool hasCartProduct = std::any_of(products.begin(), products.end(),
                                          [&cart](int product) { return cart.count(product) > 0; });

        // If there is a match, count all co-purchased products excluding the cart items
        if (hasCartProduct) {
            for (const auto& product : products) {
                if (cart.find(product) == cart.end()) { // Exclude products in the cart
                    productCounts[product]++;
                }
            }
        }
    }

    // Convert map to a vector of pairs (product_id, count) for sorting
    std::vector<std::pair<int, int>> sortedRecommendations(productCounts.begin(), productCounts.end());

    // Sort the recommendations by count in descending order
    std::sort(sortedRecommendations.begin(), sortedRecommendations.end(),
              [](const std::pair<int, int>& a, const std::pair<int, int>& b) {
                  return a.second > b.second;
              });

    // Collect the top recommended product IDs
    std::vector<int> topRecommendations;
    for (const auto& rec : sortedRecommendations) {
        if (topRecommendations.size() < recommendationCount) {
            topRecommendations.push_back(rec.first);
        } else {
            break;
        }
    }

    return topRecommendations;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <cart_product_ids>" << std::endl;
        return 1;
    }

    std::string cartInput = argv[1];  // Take cart product IDs from the argument

    // Parse the cart input
    std::unordered_set<int> cart = parseCartInput(cartInput);

    // Load transaction data from JSON file
    auto userPurchases = loadTransactionData("dataset/dummy2.json");

    // Get top 15 recommended products
    int recommendationCount = 15;
    std::vector<int> recommendations = getRecommendations(cart, userPurchases, recommendationCount);

    // Prepare the recommendations as a comma-separated string
    std::string recommendationsStr;
    for (size_t i = 0; i < recommendations.size(); ++i) {
        recommendationsStr += std::to_string(recommendations[i]);
        if (i != recommendations.size() - 1) {
            recommendationsStr += ", ";
        }
    }

    // Prepare the output in JSON format
    json output;
    output["recommendations"] = recommendationsStr;

    // Output recommendations as JSON
    std::cout << output.dump(4) << std::endl;

    return 0;
}