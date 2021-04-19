import React, { useReducer, useEffect } from 'react';
import { validate } from '../../../util/Validators/Validators';
import './Input.css';

// Use reducer to handle different states
const inputReducer = (state, action) => {

  // Change between different actions
  switch (action.type) {
    case 'CHANGE':
      return {

        // Copying old state object and update/overwrite with new values
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      };
    }

    // Return the default, unchanged state
    default:
      return state;
  }
};

const Input = props => {

  // Using reducer in component and first setting initial values and states which will be updated
  const [inputState, dispatch] = useReducer(inputReducer, {
    // Initial states
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  // Object destructuring -> getting id and onInput from props and value and isValid from inputState
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  // Updating state when changes in these values
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);


  //Change handler function to change value in input and to validate input
  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  // Touch handler function to validate an input, which user already clicked but did not insert anything
  // Used as onBlur
  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  // Input can be used as normal input or textarea element
  const element =
    props.element === 'input' ? (
      <input
        className={props.className}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        className={props.className}
        rows={props.rows || 10}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    // Changing between isValid and invalid classes for form validation and rendering the element
    <div
      className={`form-control ${!inputState.isValid &&
        inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
