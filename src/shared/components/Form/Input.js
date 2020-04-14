import React, { useReducer, useEffect } from "react";
import "./Input.css";
import { validate } from "../../util/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE": {
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators)
      };
    }

    case "TOUCH": {
      return {
        ...state,
        isTouched: true
      };
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isValid: props.valid || false,
    isTouched: false
  });

  const { onInput, id } = props;
  const { isValid, value } = inputState;

  const changeHandler = event => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      />
    ) : (
        <textarea
          id={props.id}
          rows={props.rows || 3}
          value={inputState.value}
          onBlur={touchHandler}
          onChange={changeHandler}
          placeholder={props.placeholder}
        />
      );

  return (
    <div
      className={`form ${!inputState.isValid &&
        inputState.isTouched &&
        "form-invalid"}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p className="form-invalid">{props.errorText}</p>
      )}
    </div>
  );
};

export default Input;
