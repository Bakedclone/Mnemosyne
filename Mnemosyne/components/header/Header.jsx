import React from "react";
import Logo from "./Logo";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div className=" z-40 py-1 flex justify-between items-center px-2 sm:px-16 border-b fixed w-full  bg-transparent backdrop-blur">
      <Logo />
      <Navbar />
    </div>
  );
};

export default Header;
