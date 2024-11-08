import React, { useState } from 'react';
import ProductSlider from '../components/productSlider';

function App() {
    const [inputValue, setInputValue] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSearch = async () => {
        if (inputValue.trim() === '') {
            setRecommendations([]);
            setError(null); // Reset error if input is empty
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchTerm: inputValue }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            console.log('Fetched recommendations:', data.recommendations);
            setRecommendations(data.recommendations);  // Set the recommendation IDs

            // If recommendations are empty, show an error
            if (data.recommendations.length === 0) {
                setError(`There is no product as "${inputValue}"`);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Search for products..."
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>

            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && !error && recommendations.length > 0 && (
                <ProductSlider productIds={recommendations} />  // Pass the IDs to ProductSlider
            )}
        </div>
    );
}

export default App;
