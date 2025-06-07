import React, { useState, useEffect } from 'react';

const SoilMoisture = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data - replace with real data from your backend
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [65, 59, 80, 81, 56, 55, 40],
  };

  // Chart dimensions
  const chartWidth = 320;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index) => (index / (data.labels.length - 1)) * innerWidth;
  const yScale = (value) => innerHeight - (value / 100) * innerHeight;

  // Generate path for the line
  const generatePath = () => {
    return data.values
      .map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    // Horizontal grid lines (for y-axis)
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * innerHeight;
      lines.push(
        <line
          key={`grid-h-${i}`}
          x1={0}
          y1={y}
          x2={innerWidth}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      );
    }
    return lines;
  };

  // Handle point hover
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

  return (
    <div className="w-full h-full">
      <h2 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg mb-1' : 'text-xl mb-2'}`}>
        Soil Moisture Trend
      </h2>
      
      <div className="relative w-full" style={{ height: isMobile ? 'calc(100% - 40px)' : 'calc(100% - 48px)' }}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            <svg
              width={chartWidth}
              height={chartHeight}
              className="overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            >
              {/* Chart area background */}
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
                {[0, 20, 40, 60, 80, 100].map((value, index) => (
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
              <g transform={`translate(${padding.left}, ${chartHeight - padding.bottom + 16})`}>
                {data.labels.map((label, index) => (
                  <text
                    key={label}
                    x={xScale(index)}
                    y={0}
                    textAnchor="middle"
                    className={`fill-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
                  >
                    {label}
                  </text>
                ))}
              </g>
              
              {/* Main line */}
              <g transform={`translate(${padding.left}, ${padding.top})`}>
                <path
                  d={generatePath()}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
                
                {/* Data points */}
                {data.values.map((value, index) => (
                  <circle
                    key={index}
                    cx={xScale(index)}
                    cy={yScale(value)}
                    r={hoveredPoint === index ? 6 : 4}
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200 hover:r-6"
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
                  {data.labels[hoveredPoint]}
                </div>
                <div className="text-sm text-gray-600">
                  Moisture: {data.values[hoveredPoint]}%
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="border-4 border-transparent border-t-white"></div>
                  <div className="border-4 border-transparent border-t-gray-200 -mt-1"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilMoisture;