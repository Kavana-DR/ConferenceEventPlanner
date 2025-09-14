import React from 'react';
import './Home.css';

const Home = ({ onStart }) => {
  return (
    <div className="home-container">
      <h1>Welcome to Conference Expense Planner</h1>
      <p>Plan your next major event with ease and confidence.</p>
      <button className="start-button" onClick={onStart}>Get Started</button>
    </div>
  );
};

export default Home;
