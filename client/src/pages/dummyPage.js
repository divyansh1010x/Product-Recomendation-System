import React, { useState, useEffect } from 'react';
import ProductSlider from '../components/productSlider';
import Navbar from '../components/navBar';

function App() {
    const [user, setUserId] = useState('');
    const [category, setCategory] = useState('toys'); // Default category
    const [recommendations, setRecommendations] = useState({
        user_recommendations: [],
        global_trending: [],
        category_trending: [],
    });
    const [favoriteCategory, setFavoriteCategory] = useState('');
    const [showUserSlider, setShowUserSlider] = useState(false);
    const [showTrendingSlider, setShowTrendingSlider] = useState(false);

    // Function to fetch user-based recommendations and favorite category
    const getUserRecommendations = async (userId) => {
        try {
            const favResponse = await fetch('http://localhost:5001/fav_category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: userId }),
            });
            if (!favResponse.ok) throw new Error('Failed to fetch favorite category');
            const favData = await favResponse.json();
            setFavoriteCategory(favData.favorite_category);

            const userResponse = await fetch('http://localhost:5001/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: userId }),
            });
            if (!userResponse.ok) throw new Error('Failed to fetch user recommendations');
            const userData = await userResponse.json();
            setRecommendations((prev) => ({
                ...prev,
                user_recommendations: userData.recommendations || [],
            }));
            setShowUserSlider(true);
        } catch (error) {
            console.error(error);
            setShowUserSlider(false);
        }
    };

    // Function to fetch global and category-based trending recommendations
    const getTrendingRecommendations = async () => {
        try {
            const globalTrendingResponse = await fetch('http://localhost:5001/trending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category }),
            });
            if (!globalTrendingResponse.ok) throw new Error('Failed to fetch trending items');
            const trendingData = await globalTrendingResponse.json();
            setRecommendations((prev) => ({
                ...prev,
                global_trending: trendingData.global_trending || [],
                category_trending: trendingData.category_trending || [],
            }));
            setShowTrendingSlider(true);
        } catch (error) {
            console.error(error);
            setShowTrendingSlider(false);
        }
    };

    // Fetch recommendations on component mount
    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserId(parsedUser.user_id);
            getUserRecommendations(parsedUser.user_id);
        }
        getTrendingRecommendations();
    }, []);

    return (
        <div className="App">
            <Navbar />

            {/* User-based recommendations slider */}
            {showUserSlider && recommendations.user_recommendations.length > 0 && (
                <div>
                    <h1>You may like</h1>
                    <ProductSlider 
                        productIds={recommendations.user_recommendations} 
                        title="User Recommendations" 
                    />
                </div>
            )}

            {/* Global trending slider */}
            {showTrendingSlider && recommendations.global_trending.length > 0 && (
                <div>
                    <h1>Trending Products</h1>
                    <ProductSlider 
                        productIds={recommendations.global_trending} 
                        title="Global Trending" 
                    />
                </div>
            )}

            {/* Category-specific trending slider */}
            {showTrendingSlider && recommendations.category_trending.length > 0 && (
                <div>
                    <h1>Trending in {favoriteCategory}</h1>
                    <ProductSlider 
                        productIds={recommendations.category_trending} 
                        title={`Trending in ${favoriteCategory}`} 
                    />
                </div>
            )}

            {/* Fallback if sliders aren’t shown */}
            {!showUserSlider && !showTrendingSlider && <div>Loading recommendations...</div>}
        </div>
    );
}

export default App;