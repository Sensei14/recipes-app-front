import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);

  const login = useCallback(
    (userId, token, favouriteRecipes, expirationDate) => {
      setToken(token);
      setUserId(userId);
      setFavouriteRecipes(favouriteRecipes);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId,
          token,
          expiration: tokenExpirationDate.toISOString()
        })
      );
      localStorage.setItem(
        "favouriteRecipes",
        JSON.stringify({
          favouriteRecipes
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    setFavouriteRecipes([]);
    localStorage.removeItem("userData");
    localStorage.removeItem("favouriteRecipes");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const favRecipes = JSON.parse(localStorage.getItem("favouriteRecipes"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        favRecipes.favouriteRecipes,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { login, logout, token, userId, favouriteRecipes };
};
