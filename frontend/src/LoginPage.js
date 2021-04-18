import React, {useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import LandingPage from './LandingPage';
import Login from './Login';
import Profile from './Profile';

function LoginPage() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <React.Fragment>
      <h1>
        Login to Proceed 
      </h1>
      <div className="wrapper">
        <BrowserRouter>
          <Switch>
            <Route path="/Profile">
              <Profile />
            </Route>
            <Route path="/LandingPage">
              <LandingPage />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </React.Fragment>
  );
}

export default LoginPage;
