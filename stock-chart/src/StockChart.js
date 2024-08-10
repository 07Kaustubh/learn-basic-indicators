import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const StockChart = ({ data }) => {
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

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceScaleId: 'right',
    });

    if (data.length > 0) {
      candlestickSeries.setData(data);
      chart.timeScale().fitContent();
    }

    return () => chart.remove();
  }, [data]);

  return <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '400px' }} />;
};

export default StockChart;
