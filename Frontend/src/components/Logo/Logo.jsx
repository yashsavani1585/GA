import React from "react";
import logo from "../../assets/EVERGLOWLOGO.png";

const Logo = () => {
  return (
    <div className="h-25 w-auto flex items-center">
      <img
        src={logo}
        alt="Everglow Logo"
        className="h-16 object-contain"
      />
    </div>
  );
};

export default Logo;
