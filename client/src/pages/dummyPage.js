import React, { useState, useEffect } from 'react';
import ProductSlider from '../components/productSlider';
import Navbar from '../components/navBar';

function App() {
    const [user, setUserId] = useState('');
    const [favoriteCategory, setFavoriteCategory] = useState('');
    const [recommendations, setRecommendations] = useState({
        userRecommendations: [],
        global_trending: [],
        category_trending: []
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

    // Main function to fetch all recommendations
    const getAllRecommendations = async (userId) => {
        try {
            // Get user recommendations and trending data in parallel
            const [userRecs, trendingData] = await Promise.all([
                getUserRecommendations(userId),
                getTrendingRecommendations(userId)
            ]);

            setFavoriteCategory(trendingData.favorite_category);
            setRecommendations({
                userRecommendations: userRecs,
                global_trending: trendingData.global_trending,
                category_trending: trendingData.category_trending
            });
            setShowSliders(true);
        } catch (error) {
            console.error('Error fetching all recommendations:', error);
            setShowSliders(false);
        }
    };

    // Use useEffect to fetch recommendations on component mount
    useEffect(() => {
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
                            <h1>Trending in {favoriteCategory}</h1>
                            <ProductSlider 
                                productIds={recommendations.category_trending} 
                                title={`Trending in ${favoriteCategory}`} 
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