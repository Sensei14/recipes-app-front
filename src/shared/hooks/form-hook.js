import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        formIsValid
      };

    case "ARRAY_INPUT_CHANGE":
      let arrayFormValidity = true;
      const newInputs = [...state.inputs];
      newInputs[action.inputId] = {
        value: action.value,
        isValid: action.isValid,
        id: action.inputId
      };

      newInputs.forEach(input => {
        arrayFormValidity = arrayFormValidity && input.isValid;
      });

      return {
        ...state,
        inputs: newInputs,
        formIsValid: arrayFormValidity
      };

    case "SET_ARRAY_DATA":
      let arrayFormValiditycheck = true;
      const inputs = [...action.inputs];
      inputs.forEach(input => {
        arrayFormValiditycheck = arrayFormValiditycheck && input.isValid;
      });

      return {
        inputs: action.inputs,
        formIsValid: arrayFormValiditycheck
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        formIsValid: action.formValidity
      };

    default:
      return state;
  }
};

export const useForm = (inputs, formValidity, typeOfState) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs,
    formIsValid: formValidity
  });

  const inputHandler = useCallback(
    (id, value, isValid) => {
      if (typeOfState === "array") {
        dispatch({ type: "ARRAY_INPUT_CHANGE", inputId: id, value, isValid });
      } else {
        dispatch({ type: "INPUT_CHANGE", inputId: id, value, isValid });
      }
    },
    [typeOfState]
  );

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({ type: "SET_DATA", inputs: inputData, formValidity });
  }, []);

  const setArrayFormData = useCallback(inputData => {
    dispatch({ type: "SET_ARRAY_DATA", inputs: inputData });
  }, []);

  return [formState, inputHandler, setFormData, setArrayFormData];
};
