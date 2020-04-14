import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { AuthContext } from "../../context/auth-context";

const Navigation = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="navigation">
      <ul className="nav-links">
        <li>
          <NavLink to="/" exact>
            PRZEPISY
          </NavLink>
        </li>
        {auth.isLoggedIn && (
          <li>
            <NavLink to={`/${auth.userId}/recipes`}>MOJE PRZEPISY</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/recipes/favourite">ULUBIONE</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/recipes/new">DODAJ PRZEPIS</NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/auth">ZALOGUJ SIĘ</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button onClick={auth.logout} className="logout-btn">
              WYLOGUJ
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
