import React, { useState, useEffect } from 'react';
import ProductSlider from '../components/productSlider';
import Navbar from '../components/navBar';

function App() {
    const [user, setUserId] = useState('');
    const [favoriteCategory, setFavoriteCategory] = useState('');
    const [recommendations, setRecommendations] = useState({
        userRecommendations: [],
        global_trending: [],
        category_trending: [],
        recommendationApiProducts: [] // New state for the fourth slider
    });
    const [showSliders, setShowSliders] = useState(false);

    // Function to fetch user-specific recommendations
    const getUserRecommendations = async (userId) => {
        try {
            const response = await fetch('http://localhost:5001/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: userId }),
            });

            if (!response.ok) throw new Error('Failed to fetch user recommendations');
            
            const data = await response.json();
            return data.recommendations || [];
        } catch (error) {
            console.error('Error fetching user recommendations:', error);
            return [];
        }
    };

    // Combined function to fetch favorite category and trending recommendations
    const getTrendingRecommendations = async (userId) => {
        try {
            // First get the user's favorite category
            const favResponse = await fetch('http://localhost:5001/fav_category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: userId }),
            });
            
            if (!favResponse.ok) throw new Error('Failed to fetch favorite category');
            const favData = await favResponse.json();
            setFavoriteCategory(favData.favorite_category);

            // Then get the trending items using the favorite category
            const trendingResponse = await fetch('http://localhost:5001/trending', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: favData.favorite_category }),
            });

            if (!trendingResponse.ok) throw new Error('Failed to fetch trending items');
            const trendingData = await trendingResponse.json();
            
            return {
                favorite_category: favData.favorite_category,
                global_trending: trendingData.global_trending || [],
                category_trending: trendingData.category_trending || []
            };
        } catch (error) {
            console.error('Error fetching trending recommendations:', error);
            return {
                favorite_category: '',
                global_trending: [],
                category_trending: []
            };
        }
    };

    // Function to fetch products for the fourth slider using /userby_recommendation API
    const getRecommendationApiProducts = async (userId) => {
        try {
            const response = await fetch('http://localhost:5001/userby_recommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: userId }),
            });

            if (!response.ok) throw new Error('Failed to fetch products from recommendation API');
            const data = await response.json();

            // Directly return the array of product IDs
            return data; // Since the API returns the array directly
        } catch (error) {
            console.error('Error fetching products from recommendation API:', error);
            return [];
        }
    };

    // Main function to fetch all recommendations
    const getAllRecommendations = async (userId) => {
        try {
            // Get user recommendations, trending data, and recommendation API products in parallel
            const [userRecs, trendingData, recommendationApiProducts] = await Promise.all([
                getUserRecommendations(userId),
                getTrendingRecommendations(userId),
                getRecommendationApiProducts(userId) // Fetch for the new slider
            ]);

            setFavoriteCategory(trendingData.favorite_category);
            setRecommendations({
                userRecommendations: userRecs,
                global_trending: trendingData.global_trending,
                category_trending: trendingData.category_trending,
                recommendationApiProducts: recommendationApiProducts // Set the fetched product IDs
            });
            setShowSliders(true);
        } catch (error) {
            console.error('Error fetching all recommendations:', error);
            setShowSliders(false);
        }
    };

    // Use useEffect to fetch recommendations on component mount
    useEffect(() => {
        // Retrieve user ID from session storage
        const userData = sessionStorage.getItem('user');
        
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserId(parsedUser.user_id);
            getAllRecommendations(parsedUser.user_id);
        }
    }, []);

    return (
        <div className="App">
            <Navbar />
            {showSliders ? (
                <>
                    {/* User-specific recommendations */}
                    {recommendations.userRecommendations.length > 0 && (
                        <div>
                            <h1>You may like</h1>
                            <ProductSlider 
                                productIds={recommendations.userRecommendations} 
                                title="Recommended for You" 
                            />
                        </div>
                    )}

                    {/* Global Trending Products */}
                    {recommendations.global_trending.length > 0 && (
                        <div>
                            <h1>Trending Products</h1>
                            <ProductSlider 
                                productIds={recommendations.global_trending} 
                                title="Global Trending" 
                            />
                        </div>
                    )}

                    {/* Category-specific Trending Products */}
                    {recommendations.category_trending.length > 0 && (
                        <div>
                            <h1>Cause you like {favoriteCategory}</h1>
                            <ProductSlider 
                                productIds={recommendations.category_trending} 
                                title={`Trending in ${favoriteCategory}`} 
                            />
                        </div>
                    )}

                    {/* Fourth Slider for /userby_recommendation API */}
                    {recommendations.recommendationApiProducts.length > 0 && (
                        <div>
                            <h1>More Recommendations</h1>
                            <ProductSlider 
                                productIds={recommendations.recommendationApiProducts} 
                                title="Recommended from API" 
                            />
                        </div>
                    )}
                </>
            ) : (
                <div>Loading recommendations...</div>
            )}
        </div>
    );
}

export default App;
