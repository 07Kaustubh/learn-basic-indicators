import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';

const StockChart = ({ data }) => {
  const chartContainerRef = useRef();
  const [ohlcv, setOhlcv] = useState({ open: null, high: null, low: null, close: null });

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 0,
      height: 0,
      autoSize: true,
      layout: {
        backgroundColor: '#222',
        textColor: '#DDD',
      },
      grid: {
        vertLines: {
          color: '#444',
        },
        horzLines: {
          color: '#444',
        },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          width: 8,
          color: '#C3BCDB44',
          style: LineStyle.Solid,
          labelBackgroundColor: '#9B7DFF',
        },
        horzLine: {
          color: '#9B7DFF',
          labelBackgroundColor: '#9B7DFF',
        },
      },
      leftPriceScale: {
        borderColor: '#71649C',
      },
      rightPriceScale: {
        borderColor: '#71649C',
      },
      timeScale: {
        borderColor: '#71649C',
        barSpacing: 10,
      },
    });

    // Add Area Series
    const areaSeries = chart.addAreaSeries({
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      lineColor: 'transparent',
      topColor: 'rgba(56, 33, 110, 0.6)',
      bottomColor: 'rgba(56, 33, 110, 0.1)',
    });

    const lineData = data.map(datapoint => ({
      time: datapoint.time,
      value: (datapoint.close + datapoint.open) / 2,
    }));

    areaSeries.setData(lineData);

    // Add Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: 'rgb(54, 116, 217)',
      downColor: 'rgb(225, 50, 85)',
      borderVisible: false,
      wickUpColor: 'rgb(54, 116, 217)',
      wickDownColor: 'rgb(225, 50, 85)',
      priceScaleId: 'right',
    });

    candlestickSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.4,
      },
    });

    candlestickSeries.setData(data.map(datapoint => ({
      time: datapoint.time,
      open: datapoint.open,
      high: datapoint.high,
      low: datapoint.low,
      close: datapoint.close,
    })));

    // Add Volume Series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      lineWidth: 2,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    volumeSeries.setData(data.map(datapoint => ({
      time: datapoint.time,
      value: datapoint.volume,
      color: datapoint.close > datapoint.open ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255, 82, 82, 0.8)',
    })));

    chart.timeScale().fitContent();

    // Crosshair movement subscription
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || param.seriesData.size === 0) {
        setOhlcv({ open: null, high: null, low: null, close: null, volume: null });
        return;
      }

      const candleData = param.seriesData.get(candlestickSeries);
      if (candleData) {
        setOhlcv({
          open: candleData.open,
          high: candleData.high,
          low: candleData.low,
          close: candleData.close,
        });
      }
    });

    window.addEventListener('resize', () => {
      chart.resize(chartContainerRef.current.clientWidth, window.innerHeight - 50);
    });

    return () => chart.remove();
  }, [data]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '65%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div ref={chartContainerRef} style={{ width: '100%', height: 'calc(100vh - 50px)' }} />
      <div style={{
        padding: '10px',
        backgroundColor: '#333',
        color: '#DDD',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '10px',
      }}>
        {ohlcv.open !== null ? (
          <>
            <p><strong>Open:</strong> {ohlcv.open}</p>
            <p><strong>High:</strong> {ohlcv.high}</p>
            <p><strong>Low:</strong> {ohlcv.low}</p>
            <p><strong>Close:</strong> {ohlcv.close}</p>
          </>
        ) : (
          <p>Hover over the chart to see OHLCV data</p>
        )}
      </div>
    </div>
  );
};

export default StockChart;
