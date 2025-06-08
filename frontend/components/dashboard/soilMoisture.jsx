import React, { useState, useEffect } from 'react';

const SoilMoisture = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [chartSize, setChartSize] = useState({ width: 400, height: 300 });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const width = screenWidth - 600; // Account for monitoring graph
      const height = screenHeight - 400; // Account for summary cards
      setChartSize({ width, height });
      setIsMobile(screenWidth < 640);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [65, 59, 80, 81, 56, 55, 40],
  };

  const padding = { top: 30, right: 40, bottom: 50, left: 50 };
  const innerWidth = chartSize.width - padding.left - padding.right;
  const innerHeight = chartSize.height - padding.top - padding.bottom;

  const xScale = (index) => (index / (data.labels.length - 1)) * innerWidth;
  const yScale = (value) => innerHeight - (value / 100) * innerHeight;

  const generatePath = () =>
    data.values
      .map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

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
          stroke="#e5e7eb"
          strokeWidth="1"
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

  return (
    <div className="w-full h-full">
      <h2 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
        Soil Moisture Trend
      </h2>

      <div
        className="relative w-full"
        style={{ height: `${chartSize.height}px` }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
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

              {/* Line path */}
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
