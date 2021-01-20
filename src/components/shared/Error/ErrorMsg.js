import React from 'react';
import './ErrorMsg.css'

const ErrorMsg = props => {
  return (
    <div className="ErrorText">
      <p>{props.error}</p>
    </div>
  );
};

export default ErrorMsg;
