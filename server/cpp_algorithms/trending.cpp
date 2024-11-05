#include <iostream>
#include <fstream>
#include <queue>
#include <vector>
#include <unordered_map>
#include <string>
#include "../include/nlohmann/json.hpp"

using json = nlohmann::json;

// Structure to store product information
struct Product {
    int key;
    std::string name;
    std::string model;
    std::string description;
    int mrp;
    int price;
    std::string image;
    std::string brand;
    std::string category;
    int reviews;
    int rating;
    int purchase_count = 0;  // New field to track purchase count

    // Overload the less-than operator to use purchase count for max-heap ordering
    bool operator<(const Product& other) const {
        // Priority by purchase count first, then by rating
        if (purchase_count == other.purchase_count) {
            return rating < other.rating;
        }
        return purchase_count < other.purchase_count;
    }

    // Convert Product to JSON
    json toJson() const {
        return {
            {"key", key},
            {"name", name},
            {"model", model},
            {"description", description},
            {"mrp", mrp},
            {"price", price},
            {"image", image},
            {"brand", brand},
            {"category", category},
            {"reviews", reviews},
            {"rating", rating},
            {"purchase_count", purchase_count}
        };
    }
};

// Structure to store user information
struct User {
    int user_id;
    std::string name;
    int age;
    std::string country;
    std::string gender;
};

// Function to recommend top products
std::vector<Product> recommendTopProducts(std::priority_queue<Product> maxHeap, int topN) {
    std::vector<Product> topProducts;
    for (int i = 0; i < topN && !maxHeap.empty(); ++i) {
        topProducts.push_back(maxHeap.top());
        maxHeap.pop();
    }
    return topProducts;
}

// Function to load products from a JSON file
std::vector<Product> loadProductsFromFile(const std::string& filename) {
    std::ifstream file(filename);
    json productsJson;
    file >> productsJson;

    std::vector<Product> products;
    for (const auto& item : productsJson) {
        Product product = {
            item["key"],
            item["name"],
            item["model"],
            item["description"],
            item["mrp"],
            item["price"],
            item["image"],
            item["brand"],
            item["category"],
            item["reviews"],
            item["rating"]
        };
        products.push_back(product);
    }
    return products;
}

// Function to load transaction data from a JSON file
std::unordered_map<int, int> loadTransactionData(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Error opening transactions file: " << filename << std::endl;
        return {};
    }

    json transactionsJson;
    file >> transactionsJson;
    file.close();

    // Dictionary to hold purchase counts for each product
    std::unordered_map<int, int> purchaseCount;

    for (const auto& transaction : transactionsJson) {
        // Parse user ID as string, then convert to int
        int userId;
        if (transaction["user"].is_number()) {
            userId = transaction["user"];
        } else if (transaction["user"].is_string()) {
            userId = std::stoi(transaction["user"].get<std::string>());
        } else {
            std::cerr << "Invalid user ID format in transactions." << std::endl;
            continue;  // Skip this transaction if user ID is invalid
        }

        // Parse each product ID, handling both int and string formats
        for (const auto& product : transaction["product"]) {
            int productId;
            if (product.is_number()) {
                productId = product;
            } else if (product.is_string()) {
                productId = std::stoi(product.get<std::string>());
            } else {
                std::cerr << "Invalid product ID format in transactions." << std::endl;
                continue;  // Skip this product if product ID is invalid
            }
            purchaseCount[productId]++; // Increment the count for each product purchased
        }
    }

    return purchaseCount;
}

// Function to build a max-heap per category
std::unordered_map<std::string, std::priority_queue<Product>> buildHeapPerCategory(const std::vector<Product>& products) {
    std::unordered_map<std::string, std::priority_queue<Product>> categoryHeaps;

    for (const auto& product : products) {
        categoryHeaps[product.category].push(product);
    }

    return categoryHeaps;
}

// Function to save recommendations to a JSON file
void saveRecommendationsToJson(const std::vector<Product>& topProducts, 
                               const std::vector<Product>& topCategoryProducts, 
                               const std::string& targetCategory, 
                               const std::string& filename) {
    json outputJson;
    
    // Add global trending products
    outputJson["global_trending"] = json::array();
    for (const auto& product : topProducts) {
        outputJson["global_trending"].push_back(product.toJson());
    }

    // Add category-specific trending products
    outputJson["category_trending"][targetCategory] = json::array();
    for (const auto& product : topCategoryProducts) {
        outputJson["category_trending"][targetCategory].push_back(product.toJson());
    }

    // Write JSON to file
    std::ofstream outputFile(filename);
    outputFile << outputJson.dump(4); // Pretty-print with 4-space indentation
    outputFile.close();
}

// Function to output recommendations in JSON format to stdout
void outputRecommendationsToJson(const std::vector<Product>& topProducts, 
                                 const std::vector<Product>& topCategoryProducts, 
                                 const std::string& targetCategory) {
    json outputJson;
    
    // Add global trending products
    outputJson["global_trending"] = json::array();
    for (const auto& product : topProducts) {
        outputJson["global_trending"].push_back(product.toJson());
    }

    // Add category-specific trending products
    outputJson["category_trending"][targetCategory] = json::array();
    for (const auto& product : topCategoryProducts) {
        outputJson["category_trending"][targetCategory].push_back(product.toJson());
    }

    // Output JSON to stdout
    std::cout << outputJson.dump(4) << std::endl; // Pretty-print with 4-space indentation
}


int main(int argc, char* argv[]) {
    // Command-line argument parsing and validation...
    
    int targetUserId;
    try {
        targetUserId = std::stoi(argv[2]);
    } catch (const std::invalid_argument& e) {
        std::cerr << "Invalid user ID: " << argv[2] << " - it must be a number." << std::endl;
        return 1;
    } catch (const std::out_of_range& e) {
        std::cerr << "User ID is out of range: " << argv[2] << std::endl;
        return 1;
    }

    std::string targetCategory = argv[3]; // Get category from command line

    // Load product and user data from JSON files
    std::vector<Product> products = loadProductsFromFile("../dataset/MOCK_DATA.json");

    // Load the new transaction data
    auto transactionCount = loadTransactionData("../dataset/transactions.json");

    // Update products with purchase counts
    for (auto& product : products) {
        if (transactionCount.find(product.key) != transactionCount.end()) {
            product.purchase_count = transactionCount[product.key];
        }
    }

    // Global max-heap for all products
    std::priority_queue<Product> globalHeap;
    for (const auto& product : products) {
        globalHeap.push(product);
    }

    // Get top 15 trending products
    int globalTopN = 15;
    std::vector<Product> topProducts = recommendTopProducts(globalHeap, globalTopN);

    // Build max-heaps per category
    auto categoryHeaps = buildHeapPerCategory(products);

    // Get top 10 products in the specified category
    int categoryTopN = 10;
    std::vector<Product> topCategoryProducts;
    if (categoryHeaps.find(targetCategory) != categoryHeaps.end()) {
        topCategoryProducts = recommendTopProducts(categoryHeaps[targetCategory], categoryTopN);
    }

    // Prepare output JSON with only product keys
    json outputJson;
    
    // Add global trending product keys
    outputJson["global_trending"] = json::array();
    for (const auto& product : topProducts) {
        outputJson["global_trending"].push_back(product.key); // Only push the product key
    }

    // Add category trending product keys as an array directly
    outputJson["category_trending"] = json::array();
    for (const auto& product : topCategoryProducts) {
        outputJson["category_trending"].push_back(product.key); // Only push the product key
    }

    // Output JSON to stdout
    std::cout << outputJson.dump(4) << std::endl; // Pretty-print with 4-space indentation

    return 0;
}