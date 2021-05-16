import React, {useState} from "react";
import PropTypes from "prop-types";
import "./AccountManagement.css";
import axios from "axios";

export default function Login({setToken}) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    let payload = username + "." + password;

    axios.post("http://localhost:5000/flask/hello", {type: "checkLogin", message: payload})
      .then(response => {
        console.log("Login - Backend: ", response.data.message);
        if (response.data.message === "ValidCombo") {
          setLoggedIn(true);
          setToken(username, true);
        }
    }).catch(error => {
      console.log(error.response)
    })
  }

  return (
    <React.Fragment>
      <div className="accountWrapper">
        <div className="login">Log In</div>
        <form onSubmit={handleSubmit}>
          <label>
            <div className="prompt">Username</div>
            <input type="text" onChange={e => setUserName(e.target.value)}/>
          </label>
          <label>
            <div className="prompt">Password</div>
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

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
