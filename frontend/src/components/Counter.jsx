import api from "../api";
import { useEffect, useState } from 'react';
import "../styles/Counter.css";

const Counter = () => {
  const [count, setCount] = useState(null);

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
          alert(error.response.data.detail);
        }
      });
  }, []);

  // Function to increment the counter
  const incrementCounter = () => {
    api.patch('api/counter/', { action: 'increment' })
      .then(response => {
        setCount(response.data.count);  // Update count in state
      })
      .catch(error => {
        alert(error.response.data.detail);
      });
  };

  // Function to decrement the counter
  const decrementCounter = () => {
    api.patch('api/counter/', { action: 'decrement' })
      .then(response => {
        setCount(response.data.count);  // Update count in state
      })
      .catch(error => {
        alert(error.response.data.detail);
      });
  };

  return (
    <div className="counter-container">
      <h1> Counter: {count}</h1>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
    </div>
  );
};

export default Counter;
