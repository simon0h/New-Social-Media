import React, {useState} from 'react';
import logo from './logo.svg';
import PropTypes from 'prop-types';
import './Login.css';

async function createAccount(credentials) {
  return (
    <React.Fragment>
      <div className="loginWrapper">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" onChange={e => setUserName(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default createAccount;