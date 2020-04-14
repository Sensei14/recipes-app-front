import React from "react";
import RecipeItem from "./RecipeItem";
import "./RecipesList.css";

const RecipesList = props => {
  const recipes = props.recipes.map(recipe => (
    <RecipeItem key={recipe.id} data={recipe} />
  ));

  return <div className="recipes-list">{recipes}</div>;
};

export default RecipesList;
