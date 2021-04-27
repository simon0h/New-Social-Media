import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import CreateAccount from './CreateAccount';
import Feed from './Feed';
import Search from './Search';
import './App.css';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    // const [token, setToken] = useState();
    //Backend: Send and recieve tokens
    // let goToLogin = false;
    // let goToCreateAccount = false;
    super(props);
    this.state = {goToLogin: false, goToCreateAccount: false, loggedIn: false, message: ""};
  }

  handleLoginClick = () => {
    this.setState({goToLogin: true});
  }

  handleCreateAcctClick = () => {
    this.setState({goToCreateAccount: true});
  }

  componentDidMount = () => {
    axios.get('http://localhost:5000/flask/hello')
      .then(response => {
        console.log("SUCCESS", response.data.message);
        this.setState({message: response});
      })
  }

  componentDidUpdate = () => {
    axios.get('http://localhost:5000/flask/hello')
      .then(response => {
        console.log("SUCCESS", response.data.message);
        this.setState({message: response});
      })
  }

  render() {
    if (!this.state.goToLogin && !this.state.goToCreateAccount && !this.state.loggedIn) {
      return (
        <React.Fragment>
          <title>Home</title>
          <body>
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

    if (this.state.goToCreateAccount && !this.loggedIn) {
      console.log("account");
      return<CreateAccount/>;
    }

    if (this.state.goToLogin && !this.loggedIn) {
      console.log("login");
      // return <Login setToken={setToken} />;
      return <Login/>;
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
        </body>
      </React.Fragment>
    );
  }
}
