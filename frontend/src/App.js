import React, {PureComponent} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import CreateAccount from "./CreateAccount";
import Feed from "./Feed";
import Search from "./Search";
import "./App.css";
import axios from "axios";

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {goToLogin: false, goToCreateAccount: false, loggedIn: false, username: "", message: ""};
  }

  handleLoginClick = () => {
    this.setState({goToLogin: true});
  }

  handleCreateAcctClick = () => {
    this.setState({goToCreateAccount: true});
  }

  componentDidMount = () => {
    axios.get("http://localhost:5000/flask/hello")
      .then(response => {
      if (response.data.loginStatus === true) {
        console.log("Backend: loggedIn is true");
        this.setState({loggedIn: true});
      }
    }).catch(error => {
      console.log(error)
    })
  }

  logout = () => {
    this.setState({loggedIn: false});
    this.forceUpdate();
  }

  setToken = (currUsername, status) => {
    this.setState({username: currUsername, loggedIn: status});
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <React.Fragment>
          {/* <Feed username={this.state.username} /> */}
          {/* <Search username={this.state.username} /> */}
          {/* <Profile username={this.state.username} /> */}
          <body>
            <title>Home</title>
            <header className="newSocialMedia">New Social Media</header>
            <p className="navigation">
              <li><a href="/feed">Feed</a></li>
              <li><a href="/search">Search</a></li>
              <li><a href="/profile">Profile</a></li>
            </p>
            <BrowserRouter>
              <Switch>
                <Route path="/Feed">
                  <Feed username={this.state.username} />
                </Route>
                <Route path="/Search">
                  <Search username={this.state.username} />
                </Route>
                <Route path="/Profile">
                  <Profile username={this.state.username} loggedIn={this.state.loggedIn} logout={this.logout} />
                </Route>
              </Switch>
            </BrowserRouter>
          </body>
        </React.Fragment>
      );
    }

    if (!this.state.goToLogin && !this.state.goToCreateAccount && !this.state.loggedIn) {
      // Show login button and create account button
      return (
        <React.Fragment>
          <body>
            <title>Home</title>
            <header className="newSocialMedia">New Social Media</header>
            <div>
              <button type = "accountManagement" onClick={this.handleLoginClick}>Log in</button>
            </div>
            <div>
              <button type = "accountManagement" onClick={this.handleCreateAcctClick}>Create an account</button>
            </div>
          </body>
        </React.Fragment>
      )
    }

    if (this.state.goToCreateAccount && !this.state.loggedIn) {
      // Show create account
      return <CreateAccount setToken={this.setToken} />
    }

    if (this.state.goToLogin && !this.state.loggedIn) {
      // Show login screen
      if(!this.state.loggedIn) {
        //console.log(4);
        return <Login setToken={this.setToken} />
      }
    }
  }
}
