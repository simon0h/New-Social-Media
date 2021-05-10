import React, {useState} from "react";
import PropTypes from "prop-types";
import "./AccountManagement.css";
import axios from "axios";

export default function CreateAccount({setToken}) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [uniqueUsername, setUniqueUsername] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState();
  const [submitted, setSubmit] = useState(false);
  let invalidUsername;
  let invalidPassword;
  let takenUsername;
  let passwordsDoNotMatch;
  let submitAgain;

  const handleSubmit = e => {
    e.preventDefault();
    var m = username.indexOf(".");
    let username;
    let payload = "";
    if (m === -1) {
      setValidUsername(true);
      axios.post("http://localhost:5000/flask/hello", {type: "checkUniqueUsername", message: username})
        .then(response => {
          console.log("Backend: username is ", response.data.message);
          if (response.data.message === "unique") {
            setUniqueUsername(true);
            username = response.data.message;
          }
          setSubmit(true);
        })
    }
    var n = password.indexOf(".");
    if (n === -1) {
      setValidPassword(true);
      payload = password + "." + confirmPassword;
      axios.post("http://localhost:5000/flask/hello", {type: "checkValidPassword", message: payload})
        .then(response => {
          console.log("Backend: passwords ", response.data.message);
          if (response.data.message === "match") {
            setPasswordsMatch(true);
          }
          setSubmit(true);
        }
      )
    }
    // console.log(uniqueUsername);
    // console.log(passwordsMatch);
    if (uniqueUsername && passwordsMatch) {
      axios.post("http://localhost:5000/flask/hello", {type: "newAccountCreated", message: payload})
        .then(response => {
          console.log("Backend: ", response.data.message);
        }
      )}
      setToken(username, true);
  }

  if (submitted) {
    if (!validUsername) {
      invalidUsername = "Invalid username";
    }
    else {
      invalidUsername = "";
    }
    if (!validPassword) {
      invalidPassword = "Invalid password";
    }
    else {
      invalidPassword = "";
    }
    if (!uniqueUsername) {
      takenUsername = "Username taken";
    }
    else {
      takenUsername = "";
    }
    if (!passwordsMatch && validPassword) {
      passwordsDoNotMatch = "Passwords do not match";
    }
    else {
      passwordsDoNotMatch = "";
    }
    if (uniqueUsername && passwordsMatch) {
      submitAgain = "Click submit again to confirm";
    }
    else {
      submitAgain = "";
    }
  }

  return (
    <React.Fragment>
      <div className="accountWrapper">
        <div className="login">Create Account</div>
        <div style={{color: "white"}}>{invalidUsername}</div>
        <div style={{color: "white"}}>{invalidPassword}</div>
        <div style={{color: "white"}}>{takenUsername}</div>
        <div style={{color: "white"}}>{passwordsDoNotMatch}</div>
        <div style={{color: "white"}}>{submitAgain}</div>
        <form onSubmit={handleSubmit}>
          <label>
            <div className="prompt">Username (No periods allowed)</div>
            <input type="text" onChange={e => setUserName(e.target.value)}/>
          </label>
          <label>
            <div className="prompt">Password (No periods allowed)</div>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <label>
            <div className="prompt">Enter password again</div>
            <input type="password" onChange={e => setConfirmPassword(e.target.value)}/>
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

CreateAccount.propTypes = {
  setToken: PropTypes.func.isRequired
}
