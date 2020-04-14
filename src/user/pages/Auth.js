import React, { useState, useContext } from "react";
import "./auth.css";
import Input from "../../shared/components/Form/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttp } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./auth.css";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

const Auth = () => {
  const initialInputs = {
    name: {
      value: "",
      isValid: false
    },
    password: {
      value: "",
      isValid: false
    }
  };

  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(initialInputs, false);
  const { sendRequest, error, clearError, isLoading } = useHttp();

  const switchAuthMode = event => {
    event.preventDefault();
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          email: undefined
        },
        formState.inputs.name.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          email: { value: "", isValid: false }
        },
        false
      );
    }

    setIsLoginMode(!isLoginMode);
  };

  const submitHandler = async event => {
    event.preventDefault();

    let bodyRequest;
    if (isLoginMode) {
      bodyRequest = {
        name: formState.inputs.name.value,
        password: formState.inputs.password.value
      };

      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify(bodyRequest),
          { "Content-Type": "application/json" }
        );

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.favouriteRecipes
        );
      } catch (error) {}
    } else {
      bodyRequest = {
        name: formState.inputs.name.value,
        password: formState.inputs.password.value,
        email: formState.inputs.email.value
      };

      try {
        await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify(bodyRequest),
          { "Content-Type": "application/json" }
        );
      } catch (error) {}
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        show={!!error}
        handleClose={clearError}
        error={error}
        type="error"
      />
      <form className="auth-form" onSubmit={submitHandler}>
        <Input
          id="name"
          element="input"
          type="text"
          validators={[VALIDATOR_MINLENGTH(3)]}
          onInput={inputHandler}
          label="Nazwa użytkownika"
          errorText="Nazwa użytkownika musi zawierać co najmniej 3 znaki"
        />
        {!isLoginMode && (
          <Input
            id="email"
            element="input"
            type="email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
            label="Email"
            errorText="Wprowadzony email jest niepoprawny."
          />
        )}

        <Input
          id="password"
          element="input"
          type="password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
          label="Hasło"
          errorText="Hasło musi zawierać co najmniej 5 znaków."
        />

        <button type="submit" disabled={!formState.formIsValid}>
          {isLoginMode ? "ZALOGUJ" : "ZAREJESTRUJ"}
        </button>
        <button onClick={switchAuthMode} className="switch-btn">
          {isLoginMode ? "Przejdź do rejestracji" : "Przejdź do logowania"}
        </button>
      </form>
    </>
  );
};

export default Auth;
