import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from '../../shared/form-hook'
import { useHttpClient } from '../../shared/http-hook'
import './ActivateAccount.css'

const ActivateAccount = () => {
    const { sendRequest } = useHttpClient();
    const history = useHistory()
    const userId = useParams().id

    /* --------- USE useForm CUSTOM HOOK TO SET INITIAL VALUES -------- */
    useForm(
        {
          activate: {
            value: false
          }
        },
        false
      );

    /* --------- ACTIVATE ACCOUNT SUBMIT FUNCTION -------- */
    const submitActivate = async event => {
        event.preventDefault();

        await sendRequest(
          `http://localhost:5000/users/${userId}`,
          'PATCH',
          JSON.stringify({
            activate: true
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        history.push('/auth')
    }

    return (
        <div className="activation-container">
            <h3>Signing up successful!</h3>
            <h4>Click on the button to login</h4>
            <div className="activation-btn-container">
                <button type="submit" onClick={submitActivate}>Go to login page</button>
            </div>
        </div>
    )
}

export default ActivateAccount