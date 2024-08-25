import React, { useState, useEffect } from 'react';
import './App.css';
import StockChart from './StockChart';
import { companies } from './CompanyData';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState(companies[0].Symbol);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      const startTimeInMillis = new Date().getTime() - (24 * 60 * 60 * 1000 * 1825); // 1825 days ago
      const endTimeInMillis = new Date().getTime();
      const intervalInMinutes = 1440; // Daily data
    
      const url = `https://vigilant-space-spoon-579g544xqpvh4qr-5000.app.github.dev/api/stock/${selectedSymbol}?endTimeInMillis=${endTimeInMillis}&intervalInMinutes=${intervalInMinutes}&startTimeInMillis=${startTimeInMillis}`;
    
      try {
        const response = await fetch(url);
        const data = await response.json();
        const candles = data.candles.map(candle => ({
          time: candle[0],
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4],
          volume: candle[5]
        }));
        setStockData(candles);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [selectedSymbol]);

  const handleCompanyChange = (event) => {
    setSelectedSymbol(event.target.value);
  };

  return (
    <div className="App">
      <StockChart data={stockData} />
      <div style={{ marginLeft: '65%', padding: '20px', overflowY: 'auto', height: '100vh' }}>
        <header>
          <h1>Stock Chart with Price Scales</h1>
          <select value={selectedSymbol} onChange={handleCompanyChange}>
            {companies.map((company) => (
              <option key={company.Symbol} value={company.Symbol}>
                {company['Company Name']}
              </option>
            ))}
          </select>
        </header>
        <main>
          {/* Scrollable content will go here */}
        </main>
      </div>
    </div>
  );
}

export default App;
