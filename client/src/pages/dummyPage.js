import React, { useState } from 'react';
import ProductSlider from '../components/productSlider'; // Adjust the import path if necessary

function App() {
    const [user, setUserId] = useState('');
    const [category, setCategory] = useState('toys'); // Default category for trending
    const [recommendations, setRecommendations] = useState([]);
    const [trendingRecommendations, setTrendingRecommendations] = useState([]); // New state for trending recommendations
    const [showUserSlider, setShowUserSlider] = useState(false); // State to control user slider visibility
    const [showTrendingSlider, setShowTrendingSlider] = useState(false); // State to control trending slider visibility

    // Function to fetch user-based recommendations
    const getUserRecommendations = async () => {
        try {
            const response = await fetch('http://localhost:5000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user }),
            });

            if (!response.ok) throw new Error('Failed to fetch recommendations');
            
            const data = await response.json();
            
            setRecommendations(data.recommendations || []);
            setShowUserSlider(true); // Show the user slider after fetching recommendations
        } catch (error) {
            console.error(error);
            setRecommendations([]);
            setShowUserSlider(false); // Hide the user slider if there's an error
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
            setShowTrendingSlider(true); // Show the trending slider after fetching recommendations
        } catch (error) {
            console.error(error);
            setTrendingRecommendations([]);
            setShowTrendingSlider(false); // Hide the trending slider if there's an error
        }
    };

    return (
        <div className="App">
            <h1>Product Recommendations</h1>

            <div>
                <input
                    type="text"
                    placeholder="Enter user ID"
                    value={user}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={getUserRecommendations}>Get User Recommendations</button>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button onClick={getTrendingRecommendations}>Get Trending Recommendations</button>
            </div>

            {showUserSlider && recommendations.length > 0 && (
                <ProductSlider productIds={recommendations} title="User Recommendations" />
            )}

            {showTrendingSlider && trendingRecommendations.length > 0 && (
                <ProductSlider productIds={trendingRecommendations} title="Trending Recommendations" />
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
