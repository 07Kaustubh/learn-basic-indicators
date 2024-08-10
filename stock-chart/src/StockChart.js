import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const StockChart = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#ffffff',
        textColor: 'black',
      },
      grid: {
        vertLines: {
          color: '#e1e3eb',
        },
        horzLines: {
          color: '#e1e3eb',
        },
      },
      leftPriceScale: {
        visible: true,
        borderVisible: true,
      },
      rightPriceScale: {
        visible: true,
        borderVisible: true,
      },
    });

    // Candlestick Series on Right Price Scale
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceScaleId: 'right',
    });
    candlestickSeries.setData([
      { time: '2024-08-01', open: 100, high: 105, low: 95, close: 102 },
      { time: '2024-08-02', open: 102, high: 108, low: 101, close: 107 },
      { time: '2024-08-03', open: 107, high: 109, low: 106, close: 108 },
      { time: '2024-08-04', open: 108, high: 110, low: 107, close: 109 },
      { time: '2024-08-05', open: 109, high: 111, low: 108, close: 110 },
    ]);

    // Line Series on Left Price Scale
    const lineSeries = chart.addLineSeries({
      color: '#2962FF',
      lineWidth: 2,
      priceScaleId: 'left',
    });
    lineSeries.setData([
      { time: '2024-08-01', value: 50 },
      { time: '2024-08-02', value: 55 },
      { time: '2024-08-03', value: 53 },
      { time: '2024-08-04', value: 54 },
      { time: '2024-08-05', value: 57 },
    ]);

    // Overlay Price Scale
    const overlaySeries = chart.addHistogramSeries({
      color: '#ff9800',
      priceScaleId: 'overlay',
    });
    overlaySeries.setData([
      { time: '2024-08-01', value: 20 },
      { time: '2024-08-02', value: 25 },
      { time: '2024-08-03', value: 23 },
      { time: '2024-08-04', value: 24 },
      { time: '2024-08-05', value: 27 },
    ]);

    // Adjust price scales
    chart.priceScale('left').applyOptions({ borderColor: '#2962FF' });
    chart.priceScale('right').applyOptions({ borderColor: '#26a69a' });
    chart.priceScale('overlay').applyOptions({ visible: false });

    // Fit the data to the visible area
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, []);

  return <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '400px' }} />;
};

export default StockChart;
