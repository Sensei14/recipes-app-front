import React, { useState, useContext } from "react";
import "./NewRecipe.css";
import Input from "../../shared/components/Form/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttp } from "../../shared/hooks/http-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ImageUpload from '../../shared/components/Form/ImageUpload';

const NewRecipe = props => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [category, setCategory] = useState()
  const { sendRequest, error, clearError, isLoading } = useHttp();
  const [showSteps, setShowSteps] = useState(true);
  const [showIngredients, setShowIngredients] = useState(true);
  const [steps, setSteps] = useState([{ value: "", isValid: false, id: 0 }]);
  const [ingredients, setIngredients] = useState([
    { value: "", isValid: false, id: 0 }
  ]);

  const initialInputs = {
    title: {
      value: "",
      isValid: false
    },
    description: {
      value: "",
      isValid: false
    },
    image: {
      value: null,
      isValid: true
    }
  };
  const [formState, inputHandler] = useForm(initialInputs, false);
  const [stepsFormState, stepsInputHandler, , setStepsArrayFormData] = useForm(
    steps,
    false,
    "array"
  );
  const [
    ingredientsFormState,
    ingredientsInputHandler,
    ,
    setIngredientsArrayFormData
  ] = useForm(ingredients, false, "array");

  const stepsInputs = steps.map(step => (
    <Input
      key={step.id}
      id={step.id}
      rows={2}
      label={`Krok ${step.id + 1}`}
      validators={[VALIDATOR_REQUIRE()]}
      onInput={stepsInputHandler}
      errorText="To pole nie może być puste."
    />
  ));

  const ingredientsInputs = ingredients.map(ingredient => (
    <Input
      key={ingredient.id}
      id={ingredient.id}
      element="input"
      type="text"
      label={`Składnik ${ingredient.id + 1}`}
      validators={[VALIDATOR_REQUIRE()]}
      onInput={ingredientsInputHandler}
      errorText="To pole nie może być puste."
    />
  ));

  const addStep = () => {
    setSteps([...steps, { value: "", isValid: false, id: steps.length }]);
  };

  const removeStep = () => {
    steps.pop();
    stepsFormState.inputs.pop();
    setStepsArrayFormData(stepsFormState.inputs);
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
    setIngredientsArrayFormData(ingredientsFormState.inputs);
    setIngredients([...ingredients]);
  };

  const hideIngredients = () => {
    setShowIngredients(!showIngredients);
  };

  const addRecipeHandler = async event => {
    event.preventDefault();

    const reqSteps = [];
    stepsFormState.inputs.forEach(step => reqSteps.push(step.value));
    const reqIng = [];
    ingredientsFormState.inputs.forEach(ing => reqIng.push(ing.value));

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('steps', JSON.stringify(reqSteps));
      formData.append('ingredients', JSON.stringify(reqIng));
      formData.append('category', category);
      formData.append('image', formState.inputs.image.value);

      const responseData = await sendRequest(
        "http://localhost:5000/api/recipes",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token
        }
      );

      if (responseData) {
        history.push("/");

      }
    } catch (error) { }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        show={!!error}
        handleClose={clearError}
        error={error}
        type="error"
      />
      <form className="new-recipe-form" onSubmit={addRecipeHandler}>
        <h2>Nowy przepis</h2>
        <Input
          id="title"
          element="input"
          type="text"
          label="Tytuł"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Wprowadź tytuł."
        />
        <Input
          id="description"
          label="Opis"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Wprowadź opis przepisu."
          rows={5}
        />
        <ImageUpload id="image" onInput={inputHandler} />
        <div className="form-group__select-input">
          <label>Wybierz kategorię: </label>
          <select id="category" onChange={handleCategoryChange}>
            <option value="Dania głowne">Dania główne</option>
            <option value="Przekąski">Przekąski</option>
            <option value="Ciasta">Ciasta</option>
            <option value="Napoje">Napoje</option>
            <option value="Inne">Inne</option>
          </select>
        </div>
        <hr />
        <h3>Wprowadź składniki Twojego przepisu</h3>
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

        <h3>Jak wykonać Twój przepis?</h3>
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
          disabled={
            !formState.formIsValid ||
            !stepsFormState.formIsValid ||
            !ingredientsFormState.formIsValid
          }
        >
          DODAJ PRZEPIS
        </button>
      </form>
    </>
  );
};

export default NewRecipe;
