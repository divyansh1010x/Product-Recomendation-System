import React, { useState } from 'react';
import ProductSlider from '../components/productSlider';
import Navbar from '../components/navBar';

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
            setRecommendations(data.recommendations);

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
            <Navbar />
            <div style={styles.container}>
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Search for products..."
                        style={styles.input}
                    />
                    <button onClick={handleSearch} disabled={loading} style={styles.button}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {loading && <p style={styles.loading}>Loading...</p>}
            {!loading && !error && recommendations.length > 0 && (
                <ProductSlider productIds={recommendations} />
            )}
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f4f6f8',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px',
        gap: '10px',
    },
    input: {
        width: '300px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    error: {
        color: '#ff4d4f',
        fontSize: '20px',            
        fontWeight: 'bold',          
        textAlign: 'center',          
        marginTop: '20px',           
        padding: '10px 20px',
        borderRadius: '5px',        
    },
    loading: {
        color: '#007bff',
        marginTop: '10px',
        fontSize: '16px',
    },
};


export default App;
