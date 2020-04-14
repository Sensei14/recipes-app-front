import React from "react";
import Navigation from "./Navigation";
import "./Header.css";
import brandLogo from "../../media/icons/cutting-board.png";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <NavLink to="/">
        <div className="brand">
          <img src={brandLogo} alt="Logo" /> <span>BAZA PRZEPISÓW</span>
        </div>
      </NavLink>
      <Navigation />
    </div>
  );
};

export default Header;
