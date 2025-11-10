// src/pages/AboutUs.jsx
import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#CEBB40] to-[#CEBB80] text-white py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-pulse">
          SPARKLE & SHINE
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto">
          Welcome to our final year project! Explore modern web development, clean code, and professional design.
        </p>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-4xl font-bold mb-6 text-center">About This Project</h2>
        <p className="max-w-3xl mx-auto text-center text-gray-700 text-lg leading-relaxed">
          This project is developed as a college final year project demonstrating the full-stack web development skills. It highlights responsive design, smooth navigation, and user-friendly interfaces. The goal is to build a professional, scalable, and visually appealing web application.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 md:px-20 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-gray-700 text-lg">
            To create a high-quality, fully functional web application showcasing modern technologies, attention to detail, and professional coding standards.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-gray-700 text-lg">
            To develop a project that demonstrates creativity, innovation, and practical implementation skills suitable for real-world applications.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-4xl font-bold mb-10 text-center">Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Quality</h3>
            <p className="text-gray-600">
              Clean, efficient, and maintainable code adhering to professional standards.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">
              Creative problem-solving and modern design patterns to deliver standout features.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
            <p className="text-gray-600">
              Effective teamwork and communication to successfully execute the project vision.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-[#CEBB98] text-white">
        <h2 className="text-4xl font-bold mb-4">Explore the Project</h2>
        <p className="mb-6 max-w-2xl mx-auto text-lg">
          Navigate through the project to see all implemented features and experience SPARKLE & SHINE with every interaction!
        </p>
        <a
          href="/"
          className="bg-white text-[#CEBB98] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-300"
        >
          View Project
        </a>
      </section>
    </div>
  );
};

export default AboutUs;
