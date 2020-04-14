import React, { useState, useEffect } from "react";
import "./UserRecipes.css";
import { useHttp } from "../../shared/hooks/http-hook";
import { useParams } from "react-router-dom";
import RecipesList from "../../recipes/components/RecipesList";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

const UserRecipes = props => {
  const [userRecipes, setUserRecipes] = useState([]);
  const userId = useParams().id;
  const { sendRequest, isLoading } = useHttp();

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/recipes/user/${userId}`
        );

        setUserRecipes(responseData.recipes);
      } catch (error) {}
    };

    fetchUserRecipes();
  }, [userId, sendRequest]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (userRecipes.length === 0) {
    return (
      <div className="user-recipes-error">
        <h1>Nie masz jeszcze żadnego przepisu.</h1>
      </div>
    );
  } else {
    return <RecipesList recipes={userRecipes} />;
  }
};

export default UserRecipes;
