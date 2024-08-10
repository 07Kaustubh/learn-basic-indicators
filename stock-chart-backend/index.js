const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const { intervalInMinutes, startTimeInMillis, endTimeInMillis } = req.query;

  const url = `https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/${symbol}?endTimeInMillis=${endTimeInMillis}&intervalInMinutes=${intervalInMinutes}&startTimeInMillis=${startTimeInMillis}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
