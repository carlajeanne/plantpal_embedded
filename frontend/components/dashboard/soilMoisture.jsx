import React, { useState, useEffect } from 'react';

const SoilMoisture = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [chartSize, setChartSize] = useState({ width: 400, height: 300 });

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

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [65, 59, 80, 81, 56, 55, 40],
  };

  const padding = isMobile
    ? { top: 20, right: 20, bottom: 40, left: 30 }
    : { top: 30, right: 40, bottom: 50, left: 50 };

  const innerWidth = chartSize.width - padding.left - padding.right;
  const innerHeight = chartSize.height - padding.top - padding.bottom;

  const xScale = (index) => (index / (data.labels.length - 1)) * innerWidth;
  const yScale = (value) => innerHeight - (value / 100) * innerHeight;

  const generateSmoothPath = () => {
    const points = data.values.map((val, i) => [xScale(i), yScale(val)]);
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      const midX = (x1 + x2) / 2;
      d += ` Q ${midX},${y1} ${x2},${y2}`;
    }
    return d;
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

  const handlePointLeave = () => setHoveredPoint(null);

  return (
    <div className="w-full h-full mt-2 sm:mt-2 bg-white rounded-lg shadow-md">
      <h2 className={`font-semibold text-gray-900 text-center mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
        🌱 Soil Moisture Trend
      </h2>

      <div className="relative w-full overflow-x-auto">
        <div className="w-fit mx-auto" style={{ height: `${chartSize.height}px` }}>
          <svg
            width={chartSize.width}
            height={chartSize.height}
            viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
            className="overflow-visible"
          >
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect
              x={padding.left}
              y={padding.top}
              width={innerWidth}
              height={innerHeight}
              fill="white"
              rx="8"
              ry="8"
            />

            {/* Grid */}
            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {generateGridLines()}
            </g>

            {/* Y-axis */}
            <g transform={`translate(${padding.left - 8}, ${padding.top})`}>
              {[0, 20, 40, 60, 80, 100].map((value) => (
                <text
                  key={value}
                  x={0}
                  y={yScale(value) + 4}
                  textAnchor="end"
                  className={`fill-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}
                >
                  {value}%
                </text>
              ))}
            </g>

            {/* X-axis */}
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

            {/* Line + Points */}
            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Smooth Curve */}
              <path
                d={generateSmoothPath()}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                className="animate-[dash_2s_ease-in-out]"
              />

              {/* Data points */}
              {data.values.map((value, index) => (
                <circle
                  key={index}
                  cx={xScale(index)}
                  cy={yScale(value)}
                  r={hoveredPoint === index ? 7 : 5}
                  fill="#3b82f6"
                  className={`transition-all duration-150 shadow-md ${
                    hoveredPoint === index ? 'shadow-blue-400' : ''
                  }`}
                  onMouseEnter={(e) => handlePointHover(index, e)}
                  onMouseLeave={handlePointLeave}
                />
              ))}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredPoint !== null && (
            <div
              className="absolute z-10 bg-white border border-gray-300 rounded-xl shadow-lg px-3 py-2 pointer-events-none transform -translate-x-1/2 -translate-y-full"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y - 12,
              }}
            >
              <div className="text-sm font-semibold text-gray-800">
                {data.labels[hoveredPoint]}
              </div>
              <div className="text-xs text-gray-500">
                Moisture: {data.values[hoveredPoint]}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilMoisture;
