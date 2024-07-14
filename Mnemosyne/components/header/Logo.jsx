import React from "react";
// import { GiFilmProjector } from "react-icons/gi";
import { Library } from "lucide-react";

import { Link } from "react-router-dom";
// import logo from "@/src/assets/CineMtrx_rmbg.png";

const Logo = () => {

  return (
    <Link to="/">
    <div className="flex  items-center cursor-pointer">
      {/* <img src={logo} alt="logo" /> */}
      <Library className="ytext-4xl" /> 
      <span className="ytext-4xl">Mnemosyne</span>
    </div>
    </Link>
  );
};

export default Logo;