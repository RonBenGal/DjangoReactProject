import api from "../api";
import { useEffect, useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  // Function to create the counter if it doesn't exist
  const createCounter = () => {
    api.post('api/counter/')
      .then(response => {
        console.log('Counter created:', response.data);
        setCount(response.data.count);  // Set the count once the counter is created
      })
      .catch(error => {
        console.log('Counter already exists or error:', error.response ? error.response.data : error.message);
      });
  };

  // Fetch the counter data (GET request)
  useEffect(() => {
    api.get('api/counter/')
      .then(response => {
        setCount(response.data.count);  // Get the global counter's value
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          // If counter does not exist, create it
          createCounter();
        } else {
          console.error('Error fetching counter:', error.response.data);
          setError('Could not fetch counter data.');
        }
      });
  }, []);

  // Function to increment the counter
  const incrementCounter = () => {
    api.patch('api/counter/', { action: 'increment' })
      .then(response => {
        setCount(response.data.count);  // Update count in state
      })
      .catch(err => {
        setError('Failed to increment the counter.');
      });
  };

  // Function to decrement the counter
  const decrementCounter = () => {
    api.patch('api/counter/', { action: 'decrement' })
      .then(response => {
        setCount(response.data.count);  // Update count in state
      })
      .catch(err => {
        setError('Failed to decrement the counter.');
      });
  };

  return (
    <div>
      {error ? <p>{error}</p> : <h1>Counter: {count}</h1>}
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
    </div>
  );
};

export default Counter;
