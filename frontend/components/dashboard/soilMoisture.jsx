import React, { useState, useEffect } from 'react';

const SoilMoisture = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [chartSize, setChartSize] = useState({ width: 400, height: 300 });
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
    loading: true,
    error: null
  });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const isMobileView = screenWidth < 640;
      setIsMobile(isMobileView);

      const width = isMobileView ? screenWidth - 40 : screenWidth - 600;
      const height = isMobileView ? 240 : screenHeight - 400;

      setChartSize({
        width: Math.max(width, 200),
        height: Math.max(height, 200),
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Fetch soil moisture readings from backend
  const fetchSoilMoistureData = async () => {
    try {
      setChartData(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch recent readings (last 24 hours, limit 50)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/readings?hours=24&limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.readings && data.readings.length > 0) {
        // Process the data for chart display
        const processedData = processChartData(data.readings);
        
        setChartData({
          labels: processedData.labels,
          values: processedData.values,
          loading: false,
          error: null
        });
      } else {
        // Fallback to dummy data if no readings found
        setChartData({
          labels: ['No Data'],
          values: [0],
          loading: false,
          error: 'No soil moisture readings found'
        });
      }
    } catch (error) {
      console.error('Error fetching soil moisture data:', error);
      setChartData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Process raw readings data for chart display
  const processChartData = (readings) => {
    // Sort readings by timestamp (oldest first)
    const sortedReadings = readings.sort((a, b) => 
      new Date(a.reading_timestamp) - new Date(b.reading_timestamp)
    );

    if (sortedReadings.length === 0) {
      return { labels: [], values: [] };
    }

    // Group readings by hour
    const groupedByHour = {};
    
    sortedReadings.forEach(reading => {
      const date = new Date(reading.reading_timestamp);
      // Create hour key: YYYY-MM-DD-HH
      const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}`;
      
      if (!groupedByHour[hourKey]) {
        groupedByHour[hourKey] = {
          readings: [],
          date: date,
          hour: date.getHours()
        };
      }
      
      groupedByHour[hourKey].readings.push(parseFloat(reading.moisture_level));
    });

    // Calculate hourly averages
    const hourlyAverages = Object.entries(groupedByHour)
      .map(([hourKey, data]) => ({
        date: data.date,
        hour: data.hour,
        avgMoisture: data.readings.reduce((sum, val) => sum + val, 0) / data.readings.length
      }))
      .sort((a, b) => a.date - b.date);

    // Take last 24 hours or all available hours
    const displayData = hourlyAverages.slice(-24);

    return {
      labels: displayData.map(item => {
        const now = new Date();
        const itemDate = new Date(item.date);
        const isToday = itemDate.toDateString() === now.toDateString();
        const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === itemDate.toDateString();
        
        if (isToday) {
          return `${String(item.hour).padStart(2, '0')}:00`;
        } else if (isYesterday) {
          return `Y-${String(item.hour).padStart(2, '0')}:00`;
        } else {
          return `${itemDate.getMonth() + 1}/${itemDate.getDate()}-${String(item.hour).padStart(2, '0')}`;
        }
      }),
      values: displayData.map(item => Math.round(item.avgMoisture * 10) / 10)
    };
  };

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    fetchSoilMoistureData();
    
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchSoilMoistureData, 50000);
    
    return () => clearInterval(interval);
  }, []);

  const padding = { top: 30, right: 40, bottom: 50, left: 50 };
  const innerWidth = chartSize.width - padding.left - padding.right;
  const innerHeight = chartSize.height - padding.top - padding.bottom;

  const xScale = (index) => {
    if (chartData.values.length <= 1) return innerWidth / 2;
    return (index / (chartData.labels.length - 1)) * innerWidth;
  };
  
  const yScale = (value) => innerHeight - (value / 100) * innerHeight;

  const generatePath = () => {
    if (chartData.values.length === 0) return '';
    
    return chartData.values
      .map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const generateGridLines = () => {
    const lines = [];
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * innerHeight;
      lines.push(
        <line
          key={`grid-h-${i}`}
          x1={0}
          y1={y}
          x2={innerWidth}
          y2={y}
          stroke="#f3f4f6"
          strokeDasharray="4"
        />
      );
    }
    return lines;
  };

  const handlePointHover = (index, event) => {
    const rect = event.currentTarget.closest('svg').getBoundingClientRect();
    setHoveredPoint(index);
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handlePointLeave = () => {
    setHoveredPoint(null);
  };

  const handleRefresh = () => {
    fetchSoilMoistureData();
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Soil Moisture Trend
        </h2>
        
        <button
          onClick={handleRefresh}
          disabled={chartData.loading}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {chartData.loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Error Display */}
      {chartData.error && (
        <div className="w-full p-3 bg-red-100 border border-red-300 rounded-md mb-4">
          <p className="text-red-700 text-sm">
            Error: {chartData.error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {chartData.loading && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="text-gray-500">Loading soil moisture data...</div>
        </div>
      )}

      {/* Chart */}
      {!chartData.loading && chartData.values.length > 0 && (
        <div
          className="relative w-full"
          style={{ height: `${chartSize.height}px` }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              {/* Chart Title */}
              <div className="text-center mb-2">
                <span className="text-sm text-gray-600">
                  Hourly Average ({chartData.values.length} hours)
                </span>
              </div>
              
              <svg
                width={chartSize.width}
                height={chartSize.height}
                className="overflow-visible"
                viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
              >
                {/* Background */}
                <rect
                  x={padding.left}
                  y={padding.top}
                  width={innerWidth}
                  height={innerHeight}
                  fill="transparent"
                />

                {/* Grid lines */}
                <g transform={`translate(${padding.left}, ${padding.top})`}>
                  {generateGridLines()}
                </g>

                {/* Y-axis labels */}
                <g transform={`translate(${padding.left - 8}, ${padding.top})`}>
                  {[0, 20, 40, 60, 80, 100].map((value) => (
                    <text
                      key={value}
                      x={0}
                      y={yScale(value) + 4}
                      textAnchor="end"
                      className={`fill-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
                    >
                      {value}%
                    </text>
                  ))}
                </g>

                {/* X-axis labels */}
                <g transform={`translate(${padding.left}, ${chartSize.height - padding.bottom + 16})`}>
                  {chartData.labels.map((label, index) => (
                    <text
                      key={`${label}-${index}`}
                      x={xScale(index)}
                      y={0}
                      textAnchor="middle"
                      className={`fill-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
                    >
                      {label}
                    </text>
                  ))}
                </g>

                {/* Line path - only show if more than 1 point */}
                {chartData.values.length > 1 && (
                  <g transform={`translate(${padding.left}, ${padding.top})`}>
                    <path
                      d={generatePath()}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                  </g>
                )}

                {/* Data points */}
                <g transform={`translate(${padding.left}, ${padding.top})`}>
                  {chartData.values.map((value, index) => (
                    <circle
                      key={`point-${index}`}
                      cx={xScale(index)}
                      cy={yScale(value)}
                      r={hoveredPoint === index ? 6 : 4}
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={(e) => handlePointHover(index, e)}
                      onMouseLeave={handlePointLeave}
                    />
                  ))}
                </g>
              </svg>

              {/* Tooltip */}
              {hoveredPoint !== null && (
                <div
                  className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: tooltipPosition.x,
                    top: tooltipPosition.y - 10,
                  }}
                >
                  <div className="text-sm text-gray-900 font-medium">
                    {chartData.labels[hoveredPoint]}
                  </div>
                  <div className="text-sm text-gray-600">
                    Moisture: {chartData.values[hoveredPoint]}%
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-white"></div>
                    <div className="border-4 border-transparent border-t-gray-200 -mt-1"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!chartData.loading && chartData.values.length === 0 && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 mb-2">No soil moisture data available</div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilMoisture;