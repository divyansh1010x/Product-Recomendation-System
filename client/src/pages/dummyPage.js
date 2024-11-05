import React, { useState } from 'react';
import ProductSlider from '../components/productSlider'; // Adjust the import path if necessary

function App() {
    const [user, setUserId] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [showSlider, setShowSlider] = useState(false); // State to control the slider visibility

    const getRecommendations = async () => {
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
            console.log(recommendations);
            setShowSlider(true); // Show the slider after fetching recommendations
        } catch (error) {
            console.error(error);
            setRecommendations([]);
            setShowSlider(false); // Hide the slider if there's an error
        }
    };

    return (
        <div className="App">
            <h1>Product Recommendations</h1>
            <input
                type="text"
                placeholder="Enter user ID"
                value={user}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={getRecommendations}>Get Recommendations</button>

            {showSlider && recommendations.length > 0 && (
                <ProductSlider productIds={recommendations} />
            )}

            {recommendations.length > 0 && !showSlider && (
                <ul>
                    {recommendations.map((product, index) => (
                        <li key={index}>{product}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
