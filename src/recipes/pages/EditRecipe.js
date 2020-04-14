import React, { useState, useContext, useEffect } from "react";
import "./EditRecipe.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttp } from "../../shared/hooks/http-hook";
import { useParams, useHistory } from "react-router-dom";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/Form/Input";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

const EditRecipe = () => {
  const recipeId = useParams().id;
  const { sendRequest, error, clearError, isLoading } = useHttp();
  const [recipe, setRecipe] = useState();
  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showSteps, setShowSteps] = useState(true);
  const [showIngredients, setShowIngredients] = useState(true);
  const history = useHistory();

  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const [stepsFormState, stepsInputHandler, , setStepsFormData] = useForm(
    [{ value: "", isValid: false, id: 0 }],
    false,
    "array"
  );

  const [
    ingredientsFormState,
    ingredientsInputHandler,
    ,
    setIngredientsFormData
  ] = useForm([{ value: "", isValid: false, id: 0 }], false, "array");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/recipes/${recipeId}`
        );

        setRecipe(responseData);
        setFormData(
          {
            title: {
              value: responseData.title,
              isValid: true
            },
            description: {
              value: responseData.description,
              isValid: true
            }
          },
          true
        );

        for (let i = 0; i < responseData.steps.length; i++) {
          responseData.steps[i] = {
            value: responseData.steps[i],
            id: i,
            isValid: true
          };
        }
        for (let i = 0; i < responseData.ingredients.length; i++) {
          responseData.ingredients[i] = {
            value: responseData.ingredients[i],
            id: i,
            isValid: true
          };
        }

        setSteps(responseData.steps);
        setStepsFormData(responseData.steps);
        setIngredients(responseData.ingredients);
        setIngredientsFormData(responseData.ingredients);
      } catch (error) { }
    };

    fetchRecipe();
  }, [
    sendRequest,
    recipeId,
    setFormData,
    setStepsFormData,
    setIngredientsFormData
  ]);

  if (!recipe) {
    return <div>Nie znaleziono przepisu</div>;
  }

  const stepsInputs = steps.map(step => (
    <Input
      key={step.id}
      id={step.id}
      element="input"
      type="text"
      label={`Krok ${step.id + 1}`}
      value={step.value}
      valid={step.isValid}
      onInput={stepsInputHandler}
      validators={[VALIDATOR_REQUIRE()]}
    />
  ));

  const ingredientsInputs = ingredients.map(ing => (
    <Input
      key={ing.id}
      id={ing.id}
      element="input"
      type="text"
      label={`Składnik ${ing.id + 1}`}
      value={ing.value}
      valid={ing.isValid}
      onInput={ingredientsInputHandler}
      validators={[VALIDATOR_REQUIRE()]}
    />
  ));

  const addStep = () => {
    setSteps([...steps, { value: "", isValid: false, id: steps.length }]);
  };

  const removeStep = () => {
    steps.pop();
    stepsFormState.inputs.pop();
    setStepsFormData(stepsFormState.inputs);
    setSteps([...steps]);
  };

  const hideSteps = () => {
    setShowSteps(!showSteps);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { value: "", isValid: false, id: ingredients.length }
    ]);
  };

  const removeIngredient = () => {
    ingredients.pop();
    ingredientsFormState.inputs.pop();
    setIngredientsFormData(ingredientsFormState.inputs);
    setIngredients([...ingredients]);
  };

  const hideIngredients = () => {
    setShowIngredients(!showIngredients);
  };

  const editRecipeSubmitHandler = async event => {
    event.preventDefault();

    const reqSteps = [];
    stepsFormState.inputs.forEach(step => reqSteps.push(step.value));
    const reqIng = [];
    ingredientsFormState.inputs.forEach(ing => reqIng.push(ing.value));
    const bodyRequest = {
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      steps: reqSteps,
      ingredients: reqIng
    };

    await sendRequest(
      `http://localhost:5000/api/recipes/${recipeId}`,
      "PATCH",
      JSON.stringify(bodyRequest),
      {
        Authorization: "Bearer " + auth.token,
        "Content-Type": "application/json"
      }
    );

    history.push(`/${auth.userId}/recipes`);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        show={!!error}
        handleClose={clearError}
        type="error"
        error={error}
      />

      {recipe && (
        <form className="edit-recipe-form">
          <h2>Edycja przepisu</h2>
          <Input
            element="input"
            id="title"
            type="text"
            label="Tytuł"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Wprowadź tytuł."
            value={recipe.title}
            valid={true}
          />
          <Input
            id="description"
            label="Opis"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Wprowadź opis przepisu."
            value={recipe.description}
            valid={true}
            rows={5}
          />
          <hr />
          {ingredients.length > 2 && (
            <button onClick={hideIngredients} type="button">
              {showIngredients ? "Ukryj" : "Pokaż"} składniki
            </button>
          )}
          {showIngredients && ingredientsInputs}
          {showIngredients && (
            <button onClick={addIngredient} type="button">
              Dodaj składnik
            </button>
          )}
          {showIngredients && ingredients.length > 1 && (
            <button type="button" onClick={removeIngredient}>
              Usuń składnik
            </button>
          )}
          <hr />
          {steps.length > 2 && (
            <button onClick={hideSteps} type="button">
              {showSteps ? "Ukryj" : "Pokaż"} kroki
            </button>
          )}
          {showSteps && stepsInputs}
          {showSteps && (
            <button onClick={addStep} type="button">
              Dodaj krok
            </button>
          )}
          {showSteps && steps.length > 1 && (
            <button type="button" onClick={removeStep}>
              Usuń krok
            </button>
          )}
          <button
            type="submit"
            onClick={editRecipeSubmitHandler}
            disabled={
              !formState.formIsValid ||
              !stepsFormState.formIsValid ||
              !ingredientsFormState.formIsValid
            }
          >
            EDYTUJ PRZEPIS
          </button>
        </form>
      )}
    </>
  );
};

export default EditRecipe;
