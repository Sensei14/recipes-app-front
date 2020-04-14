import React from "react";
import "./RecipeItem.css";
import { Link } from "react-router-dom";

const RecipeItem = props => {
  const { title, description, id, image, ratings } = props.data;

  console.log(ratings)
  let ratingsSum = 0;
  let avgRating;

  ratings.forEach(rate => {
    ratingsSum += rate.rate;
  })

  if (ratingsSum === 0) {
    avgRating = 'Brak ocen'
  } else {
    avgRating = ratingsSum / ratings.length;
  }


  return (
    <li className="recipe-item">
      <Link to={`/recipe/${id}`}>
        {image && <img src={`http://localhost:5000/${image}`} alt="avt" />}
        <h1>{title}</h1>
        <p>{description}</p>
        <span className="recipe-item__rating">Średnia ocena: {avgRating}</span>
      </Link>
    </li>
  );
};

export default RecipeItem;
