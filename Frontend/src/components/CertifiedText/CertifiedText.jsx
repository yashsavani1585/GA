import React from 'react';

const CertifiedText = () => {
  return (
    <section className="w-full bg-[#CEBB98] py-10 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
        Certificate of Authenticity
      </h1>
      <p className="text-white text-sm sm:text-base md:text-lg max-w-3xl">
        Every piece of jewellery that we make is certified for authenticity by third-party international laboratories like{' '}
        <span className="text-gray-800 font-semibold">SGL</span> and{' '}
        <span className="text-gray-800 font-semibold">IGI</span>.
      </p>
    </section>
  );
};

export default CertifiedText;
