import React from 'react';
import './App.css';
import StockChart from './StockChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Chart with Price Scales</h1>
        <StockChart />
      </header>
    </div>
  );
}

export default App;
