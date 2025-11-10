import React from "react";
import personalizedImage from "../../assets/Personalize.png";

const PersonalizedImage = () => {
  return (
    <div className="w-full flex justify-center items-center px-4 py-6">
      <img
        src={personalizedImage}
        alt="Personalized Jewelry"
        className="
          w-full max-w-6xl 
          h-auto 
          object-contain  
          rounded-2xl 
          shadow-lg
        "
      />
    </div>
  );
};

export default PersonalizedImage;
