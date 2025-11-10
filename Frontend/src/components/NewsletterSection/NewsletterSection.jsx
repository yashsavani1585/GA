import React from 'react';

// Main component for the Newsletter Subscription section
const Newsletter = () => {
  return (

<section className="w-full bg-white mt-4 sm:mt-0 pt-0 sm:pt-2 pb-10 px-4 sm:px-6 md:px-12">

      <div className="max-w-2xl mx-auto text-center">

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl font-serif text-black"
          style={{ fontFamily: "'Garamond', 'Times New Roman', serif" }}
        >
          Subscribe to Our Newsletter
        </h2>

        {/* Subheading */}
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Sign up to our newsletter for information on sales, delightful content and new additions to the collection
        </p>

        {/* Form */}
        <form className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="w-full sm:w-auto flex-grow">
            <label htmlFor="email" className="sr-only">Enter your email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-5 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#CEBB98] text-white font-semibold px-8 py-3 rounded-md hover:bg-black transition-colors duration-300"
          >
            Subscribe
          </button>
        </form>

        {/* Privacy Policy Checkbox */}
        <div className="mt-4 flex items-center justify-start">
          <input
            type="checkbox"
            id="privacy"
            className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
          />
          <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
            I agree to the Privacy Policy.
          </label>
        </div>

      </div>
    </section>
  );
};

export default Newsletter;
