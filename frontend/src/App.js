import React, {useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Feed from './Feed';
import Search from './Search';
import Profile from './Profile';

function App() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <React.Fragment>
      <title>Home</title>
      <body>
        <header className="newSocialMedia">New Social Media</header>
        <div className="navigation">
          <li><a href="/feed">Feed</a></li>
          <li><a href="/search">Search</a></li>
          <li><a href="/profile">Profile</a></li>
        </div>
        <div className="wrapper">
          <BrowserRouter>
            <Switch>
              <Route path="/Feed">
                <Feed />
              </Route>
              <Route path="/Search">
                <Search />
              </Route>
              <Route path="/Profile">
                <Profile />
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
        <div className = "welcomeMessage">
          <p> Create an account to start </p>
        </div>
        {/* <form name="accoountCreationEmail" data-name="AccountEmail" data-redirect="/success" class="w-clearfix"> */}
        {/*   <input type="email" name="email" data-name="Email" placeholder="Enter your email address" maxlength="256" required="" class="field w-input"/> */}
        {/*   <input type="submit" value="Create an account" data-wait="Please wait..." class="button w-button"/> */}
        {/* </form> */}
        {/* <div className = "emailForm"> */}
        {/*   <form name="accountCreationEmail"> */}
        {/*     <label for="email">Email</label> */}
        {/*     <input type="text" id="email" name="email" placeholder=" Your email"></input> */}
        {/*     <input type="submit" value="Submit"></input> */}
        {/*   </form> */}
        {/* </div> */}
        {/* <form action = "./LoginPage"> */}
        {/*   <input type="submit" value="Log in with account"></input> */}
        {/* </form> */}
      </body>
    </React.Fragment>
  );
}

export default App;

