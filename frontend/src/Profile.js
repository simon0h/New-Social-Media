import React, {Component} from "react";
import {SketchPicker} from "react-color";
import "./App.css";
import axios from "axios"

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {backgroundColor: "white", customize: false, font: "Poppins", posts: []};
    this.handleFontChange = this.handleFontChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.allImgPosts = this.allImgPosts.bind(this);
  }

  componentDidMount = () => {
    axios.post("http://localhost:5000/flask/hello", {type: "getMyTextPosts"})
      .then(response => {
        this.setState({posts: response.data.arr})
        console.log("Profile - Backend: my text posts - ", this.state.posts);
      })
    axios.post("http://localhost:5000/flask/hello", {type: "getMyColor"})
      .then(response => {
        this.setState({backgroundColor: response.data.message})
        console.log("Profile - Backend: my color - ", this.state.backgroundColor);
      })
    axios.post("http://localhost:5000/flask/hello", {type: "getMyFont"})
      .then(response => {
        this.setState({font: response.data.message})
        console.log("Profile - Backend: my font - ", this.state.font);
      })
  }

  logOut = () => {
    //event.preventDefault();
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
        this.setState({font: response.data.message})
        console.log("Profile - Backend: my font - ", this.state.font);
      })
  };

  handleFontChange(event) {
    // console.log(event.target.font)
    this.setState({font: event.target.value});
    axios.post("http://localhost:5000/flask/hello", {type: "setMyFont", message: this.state.font})
      .then(response => {
        this.setState({font: response.data.message})
        console.log("Profile - Backend: my font - ", this.state.font);
      })
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  allImgPosts() {
    let imgObj = [];
    imgObj.push(this.state.imgPosts);
    return (
      <div className="multipleImages">
        {(imgObj || []).map(url => (
            <img src={url} alt="..." style={{
              borderRadius:"10px",
              height:"auto",
              left:"30px",
              marginTop:"20px",
              marginRight:"20px",
              width:"500px"}}/>
        ))}
      </div>
    )
  }

  render () {
    var customize = this.state.customize;
    let allPosts = this.state.posts;
    let customizeButton;
    let colorPicker;
    let fontPicker;
    let logOut;
    let allTextPosts;

    var mystyle = {
      backgroundColor: this.state.backgroundColor,
      paddingBottom: "55%"
    };

    var fontChoice = {
      fontFamily: this.state.font,
      fontSize: "25px"
    };

    allTextPosts = (
      <script>
        {allPosts.map(p => <div className="posts" key={p}>{p}</div>)}
      </script>
    );

    logOut = (
      <button type="customize" onClick={this.logOut}>Log out</button>);

    if (!customize) {
      customizeButton = <button type="customize" onClick={this.CustomizeOn}>Customize</button>;
      colorPicker = <div></div>;
      fontPicker = <div></div>;
    }
    else {
      customizeButton = <button type="customize" onClick={this.CustomizeOff}>Done</button>;
      colorPicker = (
        <div className="picker">
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
              Pick a font:
              <select value={this.state.font} onChange={this.handleFontChange} style={{marginLeft: "20px", fontSize: "18px"}}>
                <option value="Arial" style={{fontFamily: "Arial"}}>Arial</option>
                <option value="Brush Script MT" style={{fontFamily: "Brush Script MT"}}>Brush Script MT</option>
                <option value="Courier New" style={{fontFamily: "Courier New"}}>Courier New</option>
                <option value="Georgia" style={{fontFamily: "Georgia"}}>Georgia</option>
                <option value="Times New Roman" style={{fontFamily: "Times New Roman"}}>Times New Roman</option>
              </select>
            </label>
            {/* <input type="submit" value="Submit" style={{borderRadius: "8px", fontFamily: "Poppins", fontSize: "15px", marginLeft: "15px"}}/> */}
          </form>
        </div>
      );
    }
    return (
      <React.Fragment>
        <div style={mystyle}>
          <title>Profile</title>
          <h2>Profile</h2>
          <h2>Profile - Hello {this.props.username}</h2>
          {customizeButton}
          {colorPicker}
          {fontPicker}
          {logOut}
          <div style={fontChoice}>
            {allTextPosts}
          </div>
          {this.allImgPosts()}
        </div>
      </React.Fragment>
    )
  }
}
