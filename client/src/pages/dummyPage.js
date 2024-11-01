import React, { useState } from 'react';

function App() {
    const [user, setUserId] = useState('');
    const [recommendations, setRecommendations] = useState([]);

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
        } catch (error) {
            console.error(error);
            setRecommendations([]);
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

            {recommendations.length > 0 && (
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
