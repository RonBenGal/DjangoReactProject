import api from "../api";
import { useEffect, useState } from 'react';
import "../styles/Counter.css";

const Counter = () => {
  const [count, setCount] = useState(null);

  // Fetch the counter data (GET request)
  useEffect(() => {
    api.get('api/counter/')
      .then(response => {
        setCount(response.data.count);  // Set the counter's value
      })
      .catch(error => {
        console.error('Error fetching counter:', error.response ? error.response.data : error.message);
      });
  }, []);

  // Function to handle counter updates based on action
  const updateCounter = (action) => {
    api.post('api/counter/', { action })  // Send the action in the request body
      .then(response => {
        setCount(response.data.count);  // Update the count in the state
      })
      .catch(error => {
        console.error('Error updating counter:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="counter-container">
      <h1>Counter: {count !== null ? count : 'Loading...'}</h1>

      <button onClick={() => updateCounter('increment')}>Increment</button>
      <button onClick={() => updateCounter('decrement')}>Decrement</button>
      <button onClick={() => updateCounter('reset')}>Reset</button>
    </div>
  );
};

export default Counter;
