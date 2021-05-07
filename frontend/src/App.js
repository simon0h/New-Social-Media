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
    //const [token, setToken] = useState();
    super(props);
    this.state = {goToLogin: false, goToCreateAccount: false, loggedIn: false, message: "", token: false};
    //this.checkIfLoggedin();
  }

  // if(!token) {
  //   return <Login setToken={setToken} />
  // }

  handleLoginClick = () => {
    this.setState({goToLogin: true});
  }

  handleCreateAcctClick = () => {
    this.setState({goToCreateAccount: true});
  }

  setToken(status) {
    this.setState({token: status});
  }

  // componentDidMount = () => {
  //   axios.get("http://localhost:5000/flask/hello")
  //     .then(response => {
  //       //console.log("GET SUCCESS", response.data.message);
  //       this.setState({message: response});
  //     }
  //   )
  // }

  // componentDidUpdate = () => {
  //   axios.get("http://localhost:5000/flask/hello")
  //     .then(response => {
  //       //console.log("GET SUCCESS", response.data.message);
  //       this.setState({message: response});
  //     }
  //   )
  //   axios.post("http://localhost:5000/flask/hello", {type: "Hello", message: "Test"})
  //     .then(response => {
  //       //console.log("POST", response.data.message);
  //       // this.setState({message: "hello"});
  //     }
  //   )
  // }

  componentDidMount = () => {
    //e.preventDefault();
    axios.get("http://localhost:5000/flask/hello")
      .then(response => {
      if (response.data.loginStatus === true) {
        //console.log("Get request true");
        this.setState({loggedIn: true});
      }
    }).catch(error => {
      console.log(error)
    })
  }

  // setToken = (status) => {
  //   this.setState({loggedIn: status});
  // }

  render() {
    //let token = this.state.token;

    // if(!this.state.loggedIn) {
    //   return <Login setToken={this.setToken} />
    // }

    // axios.post("http://localhost:5000/flask/hello", {type: "CheckLogin"})
    //   .then(response => {
    //   if (response.data.message === "ValidCombo") {
    //       this.setState({loggedIn: true});
    //     }
    // })

    // const checkIfLoggedin = async () => {
    //   await axios.post("http://localhost:5000/flask/hello", {type: "CheckLogin"})
    //     .then(response => {
    //     if (response.data.message === "ValidCombo") {
    //         this.setState({loggedIn: true});
    //       }
    //   })
    //}

    if (!this.state.goToLogin && !this.state.goToCreateAccount && !this.state.loggedIn) {
      //console.log(1);
      // Show login button and create account button
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

    if (this.state.goToCreateAccount && !this.state.loggedIn) {
      // Show create account
      //console.log(2);
      return <CreateAccount/>;
    }

    if (this.state.goToLogin && !this.state.loggedIn) {
      // Show login screen
      //console.log(3);
      // return <Login setToken={setToken} />;
      if(!this.state.loggedIn) {
        //console.log(4);
        return <Login setToken={this.setToken} />
      }
      //return <Login/>;
    }

    //console.log(this.state.loggedIn);    

    return (
      <React.Fragment>
        <title>Home</title>
        <body>
          <header className="newSocialMedia">New Social Media</header>
          <p className="navigation">
            <li><a href="/feed">Feed</a></li>
            <li><a href="/search">Search</a></li>
            <li><a href="/profile">Profile</a></li>
          </p>
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
        </body>
      </React.Fragment>
    );
  }
}

// const checkIfLoggedin = async () => {
//   axios.post("http://localhost:5000/flask/hello", {type: "CheckLogin"})
//     .then(response => {
//     if (response.data.message === "ValidCombo") {
//         this.setState({loggedIn: true});
//       }
//   })
// }
