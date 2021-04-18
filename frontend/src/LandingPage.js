import React, {useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Profile from './Profile';

function LandingPage() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <React.Fragment>
      <body>
        <header className="newSocialMedia">
          <div className="sameLineLeft">
            <h1>
              New Social Media 
            </h1>
          </div>
          <div className="wrapper">
            <BrowserRouter>
              <Switch>
                <Route path="/Profile">
                  <Profile />
                </Route>
              </Switch>
            </BrowserRouter>
          </div>
        </header>
        <div className = "welcomeMessage">
          <p> Create an account to start </p>
        </div>
        {/* <form name="accoountCreationEmail" data-name="AccountEmail" data-redirect="/success" class="w-clearfix"> */}
        {/*   <input type="email" name="email" data-name="Email" placeholder="Enter your email address" maxlength="256" required="" class="field w-input"/> */}
        {/*   <input type="submit" value="Create an account" data-wait="Please wait..." class="button w-button"/> */}
        {/* </form> */}
        <div className = "emailForm">
          <form name="accountCreationEmail">
            <label for="email">Email</label>
            <input type="text" id="email" name="email" placeholder=" Your email"></input>
            <input type="submit" value="Submit"></input>
          </form>
        </div>
        <form action = "./LoginPage">
          <input type="submit" value="Log in with account"></input>
        </form>
      </body>
    </React.Fragment>
  );
}

export default LandingPage;
