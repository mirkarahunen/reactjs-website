import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Input from '../shared/Input/Input'
import ImageUpload from './ImageUpload'

import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorMsg from '../shared/Error/ErrorMsg'
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_PASSWORD } from '../../util/Validators/Validators'
import { useForm } from '../shared/form-hook';
import { useHttpClient } from '../shared/http-hook';
import AuthContext from '../shared/auth-context';
import './UpdateUser.css';

const UpdateUser = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest } = useHttpClient()
  const [loadedUser, setLoadedUser] = useState()
  const userId = auth.userId
  const history = useHistory()
// Set initial form values
  const [formState, inputHandler, setFormData] = useForm(
    {
      image: {
        value: null,
        isValid: false
      },
      firstname: {
        value: '',
        isValid: false
      },
      lastname: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      },
      activate: {
        value: true,
        isValid: true
      },
      matches: {
        value: true,
        isValid: true
      }
    },
    false
  );

  useEffect(() => {
    // Fetch current user information from the db
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/users/${userId}`
        );
        setLoadedUser(responseData.user);
        // set form data with new inputs
        setFormData(
          {
            image: {
              value:responseData.user.image,
              isValid: true
            },
            firstname: {
              value: responseData.user.firstname,
              isValid: true
            },
            lastname: {
                value: responseData.user.lastname,
                isValid: true
              },
            email: {
              value: responseData.user.email,
              isValid: true
            },  
            password: {
              value: responseData.user.password,
              isValid: true
            },
            activate: {
              value: responseData.user.activate,
              isValid: true
            },
            matches: {
              value: responseData.user.matches,
              isValid: true
            }
          },
          true
        );
        
      } catch (err) {}
    };
    fetchUser();
    
  }, [sendRequest, userId, setFormData]);

  const userUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      
      formData.append('firstname', formState.inputs.firstname.value);
      formData.append('lastname', formState.inputs.lastname.value);
      formData.append('email', formState.inputs.email.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('activate', formState.inputs.activate.value)
      
      // Update user in the db with new information
      await sendRequest(
        `http://localhost:5000/users/${userId}`,
        'PATCH',
        formData,
          {
            Authorization: 'Bearer ' + auth.token
          }
      );
      
      history.push('/profile');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay/>
      </div>
    );
  }

  if (!loadedUser) {
    return (
      <div className="center">
        <h3>Could not find user info!</h3>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorMsg error={error} />
      {!isLoading && loadedUser && ( 
        <form className="place-form" onSubmit={userUpdateSubmitHandler}>
          <ImageUpload id="image"  
            onInput={inputHandler}/>
          
          <Input
            id="firstname"
            element="input"
            type="text"
            label="Firstname"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid firstname"
            onInput={inputHandler}
            initialValue={loadedUser.firstname}
            initialValid={true}
          />
          <Input
            id="lastname"
            element="input"
            type="text"
            label="Lastname"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid lastname"
            onInput={inputHandler}
            initialValue={loadedUser.lastname}
            initialValid={true}
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
            initialValue={loadedUser.email}
            initialValid={true}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Email"
            validators={[VALIDATOR_PASSWORD()]}
            errorText="Please enter a valid password"
            onInput={inputHandler}
            initialValue={loadedUser.password}
            initialValid={true}
          />
          <button type="submit" className="Update-profile" disabled={!formState.isValid}>
            Update user
          </button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;
