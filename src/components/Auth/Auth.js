import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Input from '../shared/Input/Input'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorMsg from '../shared/Error/ErrorMsg'
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_PASSWORD } from '../../util/Validators/Validators'

import { useForm } from '../shared/form-hook'
import { useHttpClient } from '../shared/http-hook'
import AuthContext from '../shared/auth-context'

import './Auth.css'

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [confirmEmail, setConfirmEmail] = useState('')
  const { isLoading, error, sendRequest } = useHttpClient();
  const history = useHistory()


  // Setting basic values in login mode
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  // If changed to sign up mode, then set the basic values for firstname and lastname 
  // Use setFormData custom function to validate form
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          firstname: undefined,
          lastname: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          firstname: {
            value: null,
            isValid: false
          },
          lastname: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

// Sending form to the server and validating. If success -> login user
  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token, responseData.firstname, responseData.role, responseData.image)
        history.push('/dashboard')

      } catch (err) {}
    } else {
      // Sign up for the user to be saved in the db
      try {
        await sendRequest(
          'http://localhost:5000/users/signup',
          'POST',
          JSON.stringify({
            firstname: formState.inputs.firstname.value,
            lastname: formState.inputs.lastname.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
      } catch (err) {}
      setConfirmEmail('Check your email to complete registration')
    }
  };

  return (
     
      <div className="authentication">
        
        <form method="POST" onSubmit={authSubmitHandler}>  
        
        {!isLoginMode && (
           <React.Fragment >
             {isLoading && <LoadingSpinner asOverlay />}
             <ErrorMsg error={error} />
             <h2 className="auth-header">Sign up</h2>
             <p className="confirmation">{confirmEmail}</p>
            <Input 
                element="input"
                id="firstname"
                label="Firtname"
                type="text"
                placeholder="Your Firstname"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid firstname"
                onInput={inputHandler}/>
           
            <Input 
                element="input"
                id="lastname"
                label="Lastname"
                type="text"
                placeholder="Your Lastame"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid lastname"
                onInput={inputHandler}/>

            <Input 
                element="input"
                id="email"
                label="Email"
                type="text"
                placeholder="Your Email"
                errorText="Please enter a valid email"
                validators={[VALIDATOR_EMAIL()]}
                onInput={inputHandler}/>

            <Input 
                element="input"
                id="password"
                label="Password"
                type="password"
                placeholder="Your Password"
                errorText="Password needs to contain min. 8 characters, 1 capital letter and 1 number"
                validators={[VALIDATOR_PASSWORD()]}
                onInput={inputHandler}/>

            </ React.Fragment >
            )}

        {isLoginMode && (
            <React.Fragment>
              {isLoading && <LoadingSpinner asOverlay />}
              <ErrorMsg error={error} />
              <h2 className="auth-header">Log in</h2>
            <Input 
                element="input"
                id="email"
                label="Email"
                type="text"
                placeholder="Your Email"
                errorText="Please enter a valid email"
                validators={[VALIDATOR_EMAIL()]}
                onInput={inputHandler}/>
            <Input 
                element="input"
                id="password"
                label="Password"
                type="password"
                placeholder="Your Password"
                errorText="Please enter a valid password"
                validators={[VALIDATOR_PASSWORD()]}
                onInput={inputHandler}/>
            </React.Fragment>
            )}
            <div className="login-submit-btn-container">
              <button className="submit-btn" type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGN UP'}
              </button>
            </div>
          </form>

          <div className="switch-btn-container">
            <button className="switch-btn" onClick={switchModeHandler}>
            SWITCH TO {isLoginMode ? 'SIGN UP' : 'LOGIN'}
            </button>
        </div> 
      </div>
  );
};

export default Auth;
