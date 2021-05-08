import React, {Component} from "react";
import ReactSearchBox from "react-search-box";
import "./App.css";
import axios from "axios";

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {data: []};
  }
  // data = [
  //   {
  //     key: "john",
  //     value: "John Doe",
  //   },
  //   {
  //     key: "jane",
  //     value: "Jane Doe",
  //   },
  //   {
  //     key: "mary",
  //     value: "Mary Phillips",
  //   },
  //   {
  //     key: "robert",
  //     value: "Robert",
  //   },
  //   {
  //     key: "karius",
  //     value: "Karius",
  //   },
  // ]

  setKeys(item) {
    var ar = {"key": item, "value": item};
    return ar;
  }

  follow(user) {
    //console.log("User: ", user.key);
    axios.post("http://localhost:5000/flask/hello", {type: "follow", message: user.key})
      .then(response => {
        console.log("Following ", response.data.message);
      })
  }

  componentDidMount = () => {
    // event.preventDefault();
    // let users = [];
    //let usersWithKey;
    axios.post("http://localhost:5000/flask/hello", {type: "getUsers"})
      .then(response => {
        const users = response.data.users
        //console.log(users);
        const usersWithKey = users.map(this.setKeys);
        //console.log(usersWithKey);
        this.setState({data: usersWithKey});
      })
    // const usersWithKey = users.map(this.setKeys);
    // console.log("Key: ", usersWithKey);
  }

  render () {
    return (
      <React.Fragment>
        <title>Search</title>
        <h2>Search</h2>
        <ReactSearchBox
          data={this.state.data}
          callback={record => console.log(record)}
          //onChange={value => console.log(value)}
          onSelect={record => this.follow(record)}

        />
      </React.Fragment>
    );
  }
}
