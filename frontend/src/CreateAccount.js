import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './AccountManagement.css';

export default class CreateAccount extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="accountWrapper">
          <div className="login">Create Account</div>
          <form>
            <label>
              <div className="prompt">Username</div>
              <input type="text"/>
              {/* <input type="text" onChange={e => setUserName(e.target.value)}/> */}
            </label>
            <label>
              <div className="prompt">Password</div>
              <input type="text"/>
              {/* <input type="password" onChange={e => setPassword(e.target.value)}/> */}
            </label>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}