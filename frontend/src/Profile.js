import React, {Component} from "react";
import {SketchPicker} from "react-color";
import "./App.css";
import axios from "axios"

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {backgroundColor: "white", customize: false, font: "Poppins", posts: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    axios.post("http://localhost:5000/flask/hello", {type: "myTextPosts"})
      .then(response => {
        this.setState({posts: response.data.posts})
        console.log(this.state.posts);
      })
  }

  CustomizeOn = () => {
    this.setState({customize: true});
    // console.log("Customize on");
  }

  CustomizeOff = () => {
    this.setState({customize: false});
    // console.log("Customize off");
  }

  CustomizeButton(click) {
    <button onClick="click" type="customize">
      Customize
    </button> 
  }

  handleChangeComplete = (color) => {
    this.setState({backgroundColor: color.hex});
    // console.log(this.state.backgroundColor);
    // this.forceUpdate();
  };

  handleChange(event) {
    // console.log(event.target.font)
    this.setState({font: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render () {
    var customize = this.state.customize;
    var posts = this.state.posts;
    let customizeButton;
    let colorPicker;
    let fontPicker;
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
      <div>
      {posts.map(p => <div className="posts" key={p}>{p}</div>)}
      </div>);

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
              <select value={this.state.font} onChange={this.handleChange} style={{marginLeft: "20px", fontSize: "18px"}}>
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
          {customizeButton}
          {colorPicker}
          {fontPicker}
          <div style={fontChoice}>
            {allTextPosts}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
