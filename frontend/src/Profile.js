import React, {Component} from "react";
import {SketchPicker} from "react-color";
import "./App.css";
import axios from "axios"

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {backgroundColor: "white", customize: false, font: "Poppins", textPosts: [], imgPosts: []};
    this.handleFontChange = this.handleFontChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.allImgPosts = this.allImgPosts.bind(this);
  }

  componentDidMount = () => {
    axios.post("http://localhost:5000/flask/hello", {type: "getMyTextPosts"}) //Sends a post request to backend requesting for array of all text posts by me
      .then(response => {
        this.setState({textPosts: response.data.arr})
        console.log("Profile - Backend: my text posts - ", this.state.textPosts);
        let newTextPosts = [];
        let size = this.state.textPosts.length;
        for (var i = 0; i < size; i++) {
          if (this.state.textPosts[i] !== null) {
            newTextPosts.push(this.state.textPosts[i]);
          }
        }
        this.setState({textPosts: newTextPosts});
      })
    axios.post("http://localhost:5000/flask/hello", {type: "getMyImagePosts", message: this.props.username}) //Sends a post request to backend requesting for array of all image posts by me
        .then(response => {
          this.setState({imgPosts: response.data.arr})
          console.log("Profile - Backend: my image posts - ", this.state.imgPosts);
        })
    axios.post("http://localhost:5000/flask/hello", {type: "getMyColor"}) //Sends a post request to backend requesting for my color
      .then(response => {
        if (response.data.message !== null) {
          this.setState({backgroundColor: response.data.message})
          console.log("Profile - Backend: my color - ", this.state.backgroundColor);
        }
      })
    axios.post("http://localhost:5000/flask/hello", {type: "getMyFont"}) //Sends a post request to backend requesting for my font
      .then(response => {
        if (response.data.message !== "No message") {
          this.setState({font: response.data.message})
          console.log("Profile - Backend: my font - ", this.state.font);
        }
      })
  }

  logOut = () => {
    axios.post("http://localhost:5000/flask/hello", {type: "logOut"})
      .then(response => {
        this.props.logout();
        console.log("Profile - Backend: logout - ", this.props.loggedIn);
      })
  }

  CustomizeOn = () => {
    this.setState({customize: true});
  }

  CustomizeOff = () => {
    this.setState({customize: false});
  }

  CustomizeButton(click) {
    <button onClick="click" type="customize">
      Customize
    </button> 
  }

  handleChangeComplete = (color) => {
    this.setState({backgroundColor: color.hex});
    axios.post("http://localhost:5000/flask/hello", {type: "setMyColor", message: this.state.backgroundColor})
      .then(response => {
        this.setState({color: response.data.message})
        console.log("Profile - Backend: my font color to - ", this.state.color);
      })
  };

  handleFontChange(event) {
    this.setState({font: event.target.value});
    axios.post("http://localhost:5000/flask/hello", {type: "setMyFont", message: event.target.value})
      .then(response => {
        this.setState({font: response.data.message})
        console.log("Profile - Backend: my font set to - ", this.state.font);
      })
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  allImgPosts() {
    let newImgPosts = [];
    let size = this.state.imgPosts.length;
    for (var i = 0; i < size; i++) {
      if (this.state.imgPosts[i] !== null) {
        newImgPosts.push(this.state.imgPosts[i]);
        console.log(this.state.imgPosts[i]);
      }
    }
    console.log(newImgPosts);
    return (
      (newImgPosts|| []).map(url => <img src={url} className="imagePosts" alt="" key={url}/>)
    )
  }

  render () {
    var customize = this.state.customize;
    let textPosts = this.state.textPosts;
    let customizeButton;
    let colorPicker;
    let fontPicker;
    let logOut;
    let allTextPosts = textPosts.map((p) => <div className="textPosts">{p}</div>);

    var mystyle = {
      backgroundColor: this.state.backgroundColor,
      borderRadius: "10px",
      marginLeft: "10%",
      paddingBottom: "15%",
      width: "80%"
    };

    var fontChoice = {
      fontFamily: this.state.font,
      fontSize: "25px"
    };

    logOut = (
      <button type="logOut" onClick={this.logOut}>Log out</button>);

    if (!customize) {
      customizeButton = <button type="customize" onClick={this.CustomizeOn}>Customize</button>;
      colorPicker = <div></div>;
      fontPicker = <div></div>;
    }
    else {
      customizeButton = <button type="customize" onClick={this.CustomizeOff}>Done</button>;
      colorPicker = (
        <div className="colorPicker">
          <SketchPicker
            color={this.state.backgroundColor}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      );
      fontPicker = (
        <div className="fontPicker">
          <form onSubmit={this.handleSubmit}>
            <label>
              <select value={this.state.font} onChange={this.handleFontChange} style={{fontSize: "14px", paddingTop: "5px", paddingBottom: "5px"}}>
                <option value="Arial" style={{fontFamily: "Arial"}}>Arial</option>
                <option value="Brush Script MT" style={{fontFamily: "Brush Script MT"}}>Brush Script MT</option>
                <option value="Courier New" style={{fontFamily: "Courier New"}}>Courier New</option>
                <option value="Georgia" style={{fontFamily: "Georgia"}}>Georgia</option>
                <option value="Times New Roman" style={{fontFamily: "Times New Roman"}}>Times New Roman</option>
              </select>
            </label>
          </form>
        </div>
      );
    }
    return (
      <React.Fragment>
        <div style={mystyle}>
          <title>Profile</title>
          <div style={{marginTop: "10px"}}></div>
          {customizeButton}
          <div className="userGreeting">Hello {this.props.username}</div>
          {colorPicker}
          {fontPicker}
          <div style={fontChoice}>
            {allTextPosts}
          </div>
          {this.allImgPosts()}
          {logOut}
        </div>
      </React.Fragment>
    )
  }
}
