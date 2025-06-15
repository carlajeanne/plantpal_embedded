import React from 'react';


const about = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About PlatPal</h1>
        
        <p className="text-lg mb-6">
          <strong>PlatPal</strong> is your reliable companion for understanding and visualizing environmental data in real time.
          Designed with farmers, researchers, urban planners, and environmental enthusiasts in mind, PlatPal makes complex data intuitive and accessible.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-8 mb-2">What PlatPal Does</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Displays key environmental metrics such as <strong>soil moisture</strong>, <strong>solar radiation</strong>, <strong>temperature</strong>, and <strong>humidity</strong>.
          </li>
          <li>
            Provides interactive visualizations for smarter decision-making in agriculture and sustainability planning.
          </li>
          <li>
            Supports location-specific insights by integrating data from various environmental and population sources.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-600 mt-8 mb-2">Our Mission</h2>
        <p className="text-lg mb-6">
          We aim to empower communities and professionals with transparent, data-driven insights to support environmental resilience, smart agriculture, and sustainable development.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-8 mb-2">Who We Are</h2>
        <p className="text-lg mb-6">
          PlatPal was built by a team of passionate engineers, analysts, and designers who believe in using technology to bridge the gap between data and action.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-8 mb-2">Get Involved</h2>
        <p className="text-lg">
          We’re constantly improving. If you have feedback, want to collaborate, or are interested in how PlatPal can support your work, we’d love to hear from you!
        </p>
      </div>
    </div>
  );
};

export default about;
