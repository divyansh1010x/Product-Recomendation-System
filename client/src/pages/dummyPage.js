import React, { useState, useEffect } from 'react';
import ProductSlider from '../components/productSlider'; // Adjust the import path if necessary

function App() {
    const [user, setUserId] = useState('');
    const [category, setCategory] = useState('toys'); // Default category for trending
    const [recommendations, setRecommendations] = useState([]);
    const [trendingRecommendations, setTrendingRecommendations] = useState([]);
    const [showUserSlider, setShowUserSlider] = useState(false);
    const [showTrendingSlider, setShowTrendingSlider] = useState(false);

    // Function to fetch user-based recommendations
    const getUserRecommendations = async (userId) => {
        try {
            const response = await fetch('http://localhost:5000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: userId }),
            });

            if (!response.ok) throw new Error('Failed to fetch recommendations');
            
            const data = await response.json();
            setRecommendations(data.recommendations || []);
            setShowUserSlider(true);
        } catch (error) {
            console.error(error);
            setRecommendations([]);
            setShowUserSlider(false);
        }
    };

    // Function to fetch trending recommendations
    const getTrendingRecommendations = async () => {
        try {
            const response = await fetch('http://localhost:5000/trending', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category }),
            });

            if (!response.ok) throw new Error('Failed to fetch trending recommendations');
            
            const data = await response.json();
            setTrendingRecommendations(data.category_trending || []);
            setShowTrendingSlider(true);
        } catch (error) {
            console.error(error);
            setTrendingRecommendations([]);
            setShowTrendingSlider(false);
        }
    };

    // Use useEffect to fetch recommendations on component mount
    useEffect(() => {
        // Get user data from session storage
        const userData = sessionStorage.getItem('user');
        
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserId(parsedUser.user_id);
            getUserRecommendations(parsedUser.user_id);
        }

        // Fetch trending recommendations for the default category
        getTrendingRecommendations();
    }, []); // Empty dependency array ensures this runs only on mount

    return (
        <div className="App">
            {showUserSlider && recommendations.length > 0 && (
                <div>
                    <h1>You may like</h1>
                    <ProductSlider productIds={recommendations} title="User Recommendations" />
                </div>
            )}

            {showTrendingSlider && trendingRecommendations.length > 0 && (
                <div>
                    <h1>Trending in {sessionStorage.getItem('favorite_category')}</h1> {/* Dynamically use favorite category */}
                    <ProductSlider productIds={trendingRecommendations} title="Trending Recommendations" />
                </div>
            )}

            {recommendations.length > 0 && !showUserSlider && (
                <ul>
                    {recommendations.map((product, index) => (
                        <li key={index}>{product}</li>
                    ))}
                </ul>
            )}

            {trendingRecommendations.length > 0 && !showTrendingSlider && (
                <ul>
                    {trendingRecommendations.map((product, index) => (
                        <li key={index}>{product}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
