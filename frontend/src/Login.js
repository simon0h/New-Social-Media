import React, {useState} from "react";
import PropTypes from "prop-types";
import "./AccountManagement.css";

async function loginUser(credentials) {
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
 })
  .then(data => data.json())
}

export default function Login({setToken}) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
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
