import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHttp } from "../../shared/hooks/http-hook";
import RecipesList from "../components/RecipesList";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import "./Recipes.css";

const Recipes = () => {
  const [loadedRecipes, setLoadedRecipes] = useState([]);

  const { sendRequest, isLoading } = useHttp();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const queryRef = useRef();
  const categoryRef = useRef();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/recipes"
        );

        setLoadedRecipes(responseData.recipes);
        setFirstRender(false);
      } catch (error) { }
    };

    fetchRecipes();
  }, [sendRequest]);

  const handleChange = event => {
    setQuery(event.target.value);
  };

  const handleSearch = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/recipes?search=${query}&category=${category}`
      );
      setLoadedRecipes(responseData.recipes);
    } catch (error) { }


  }, [query, sendRequest, category]);

  const handleSelectCategory = (e) => {
    setCategory(e.target.value);
  }

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (query === queryRef.current.value && category === categoryRef.current.value && !firstRender) {
        handleSearch();
      }
    }, 500);

    return () => {
      clearTimeout(searchTimer);
    };
  }, [handleSearch, query, setLoadedRecipes, category]);

  return (
    <>
      <div className="recipes-search">
        <input
          ref={queryRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Szukaj przepisu..."
        />
        <select onChange={handleSelectCategory} ref={categoryRef}>
          <option value="">Wszystkie</option>
          <option value="Dania głowne">Dania główne</option>
          <option value="Ciasta">Ciasta</option>
          <option value="Napoje">Napoje</option>
          <option value="Przekąski">Przekąski</option>
          <option value="Inne">Inne</option>
        </select>
        <button onClick={handleSearch}>SZUKAJ</button>
      </div>
      {loadedRecipes.length === 0 && !isLoading ? (
        <p className="no-recipes-found">Nie znaleziono żadnych przepisów.</p>
      ) : (
          <div className="recipes">
            {isLoading && <LoadingSpinner />}
            <RecipesList recipes={loadedRecipes} />
          </div>
        )}
    </>
  );
};

export default Recipes;
