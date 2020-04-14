import React, { useState, useEffect, useContext } from "react";
import "./RecipeDetails.css";
import { useParams, useHistory } from "react-router-dom";
import { useHttp } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { NavLink } from "react-router-dom";
import Comments from '../components/Comments';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import StarRatings from 'react-star-ratings';

const RecipeDetails = props => {
  const recipeId = useParams().id;
  const { sendRequest, error, clearError, isLoading } = useHttp();
  const [recipe, setRecipe] = useState();
  const [warning, setWarning] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [rating, setRating] = useState();

  const auth = useContext(AuthContext);

  const history = useHistory();

  const renderTooltip = (props) => {
    return (
      <Tooltip id="tooltip" {...props}>
        {isFavourite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      </Tooltip>
    )
  }

  const showWarning = () => {
    setWarning(true);
  };

  const closeWarning = () => {
    setWarning(false);
  };

  const deleteRecipe = () => {
    const deleteRecipeRequest = async () => {
      try {
        await sendRequest(
          `http://localhost:5000/api/recipes/${recipe.id}`,
          "DELETE",
          {},
          {
            Authorization: "Bearer " + auth.token
          }
        );
        history.push("/");
      } catch (error) { }
    };

    closeWarning();
    deleteRecipeRequest();
  };


  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/recipes/${recipeId}`
        );
        setRecipe(responseData);
        if (responseData.fans.findIndex(fan => fan === `${auth.userId}`) !== -1) {
          setIsFavourite(true)
        }
      } catch (error) { }
    };

    fetchRecipe();
  }, [sendRequest, recipeId]);

  const changeRatingHandler = (newRating) => {
    setRating(newRating);
  }

  const rateRecipeHandler = () => {
    if (!rating) {
      return;
    }
    const rateRecipe = async () => {
      const bodyRequest = {
        recipeId,
        rate: rating
      }
      console.log(JSON.stringify(bodyRequest))
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/recipes/rate`, 'POST',
          JSON.stringify(bodyRequest),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        )
      } catch (error) { }
    }

    rateRecipe();
  }

  const addToFavouritesHandler = () => {
    const addToFavouriteRequest = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/recipes/like/${recipeId}`,
          "PATCH",
          {},
          {
            Authorization: "Bearer " + auth.token
          }
        );

        if (res.status === "added") {
          setIsFavourite(true);
          auth.favouriteRecipes.push(recipeId);
          localStorage.setItem(
            "favouriteRecipes",
            JSON.stringify(auth.favouriteRecipes)
          );
        }
        if (res.status === "removed") {
          setIsFavourite(false);
          auth.favouriteRecipes.filter(fav => fav !== recipeId);
          localStorage.setItem(
            "favouriteRecipes",
            JSON.stringify(auth.favouriteRecipes)
          );
        }
      } catch (error) { }
    };

    addToFavouriteRequest();
  };

  if (!recipe) {
    return isLoading ? (
      <LoadingSpinner />
    ) : (
        <div className="recipe-details">
          <h2>Nie znaleziono takiego przepisu.</h2>
        </div>
      );
  } else {
    const recipeSteps = recipe.steps.map(step => (
      <li key={Math.random().toString()}>{step}</li>
    ));

    const recipeIngredients = recipe.ingredients.map(ingredient => (
      <li key={Math.random().toString()}>{ingredient}</li>
    ));

    console.log(rating)
    return (
      <>
        <ErrorModal
          show={!!error}
          handleClose={clearError}
          error={error}
          type="error"
        />
        <ErrorModal
          show={warning}
          handleClose={closeWarning}
          error="Czy na pewno chcesz usunąć ten przepis?"
          type="warning"
          onConfirm={deleteRecipe}
        />
        <div className="recipe-details">
          <div className="recipe-details-author">
            <span>
              Twórca przepisu: <span> {recipe.author.name}</span>
            </span>
            {auth.isLoggedIn && <OverlayTrigger
              placement="right"
              delay={{ show: 100, hide: 200 }}
              overlay={renderTooltip}
            >
              {isFavourite ? <i class="fas fa-star favourites-icon" onClick={addToFavouritesHandler}></i> : <i class="far fa-star favourites-icon" onClick={addToFavouritesHandler}></i>}
            </OverlayTrigger>}


            {recipe.author.id === auth.userId && (
              <div className="recipe-control-buttons">
                <NavLink to={`/recipe/edit/${recipeId}`}>
                  <button className="edit-btn">EDYTUJ</button>
                </NavLink>
                <button className="remove-btn" onClick={showWarning}>
                  USUŃ
                </button>
              </div>
            )}
          </div>

          <h1>{recipe.title}</h1>
          <div className="recipe-details__description">
            {recipe.image && <img src={`http://localhost:5000/${recipe.image}`} alt="preview" />}
            <p>{recipe.description}</p>
          </div>
          <hr />
          <h2>Potrzebne składniki:</h2>
          <ul className="recipe-details-ingredients">{recipeIngredients}</ul>
          <hr />
          <h2>Jak przyrządzić?</h2>
          <ul className="recipe-details-steps">{recipeSteps}</ul>
          <div className="recipe-details-rating">
            <div className="recipe-details-rating__stars">
              <span>Oceń przepis: </span>
              <StarRatings
                rating={rating}
                starRatedColor="gold"
                changeRating={changeRatingHandler}
                numberOfStars={5}
                name="rating"
                starSpacing="0"
              />
            </div>
            <button className="edit-btn" onClick={rateRecipeHandler}> Wyślij ocenę</button>
          </div>
        </div>
        <Comments recipeId={recipeId} comments={recipe.comments} />
      </>
    );
  }
};

export default RecipeDetails;
