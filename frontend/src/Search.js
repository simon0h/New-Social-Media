import React, {Component} from "react";
import ReactSearchBox from "react-search-box";
import "./App.css";
import axios from "axios";

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  setKeys(item) {
    var ar = {"key": item, "value": item};
    return ar;
  }

  follow(user) {
    console.log("User: ", user.key);
    axios.post("http://localhost:5000/flask/hello", {type: "follow", message: user.key})
      .then(response => {
        console.log("Search - Backend: now following - ", response.data.message);
      })
  }

  componentDidMount = () => { //When the page is first loaded, this function is called
    axios.post("http://localhost:5000/flask/hello", {type: "getUsers"}) //Sends a post request to backend requesting for array of all users
      .then(response => {
        console.log("Backend: users - ", response.data.message);
        const users = response.data.users; //Recieves an array of all users from the backend
        const usersWithKey = users.map(this.setKeys);
        this.setState({data: usersWithKey});
        console.log("Search - Backend: users - ", users);
      })
  }

  render () {
    return (
      <React.Fragment>
        <title>Search</title>
        <div className="searchBox">
          <ReactSearchBox
            placeholder="Search for users"
            data={this.state.data}
            callback={record => console.log(record)}
            onSelect={record => this.follow(record)}
            width="400px"
          />
        </div>
      </React.Fragment>
    );
  }
}
