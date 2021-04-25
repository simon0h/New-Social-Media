import React, {Component} from 'react';
import {SketchPicker} from 'react-color';
import './App.css';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {backgroundColor: 'white', customize: false};
  }

  CustomizeOn = () => {
    this.setState({customize: true});
    console.log("Customize on");
  }

  CustomizeOff = () => {
    this.setState({customize: false});
    console.log("Customize off");
  }

  CustomizeButton(click) {
    <button onClick="click" type="customize">
      Customize
    </button> 
  }

  handleChangeComplete = (color) => {
    this.setState({backgroundColor: color.hex});
    console.log(this.state.backgroundColor);
    // this.forceUpdate();
  };

  render () {
    var customize = this.state.customize;
    let customizeButton;
    let colorPicker;

    var mystyle = {
      backgroundColor: this.state.backgroundColor,
      paddingBottom: '55%'
    };

    if (!customize) {
      customizeButton = <button type="customize" onClick={this.CustomizeOn}>Customize</button>;
      colorPicker = <div></div>;
    }
    else {
      customizeButton = <button type="customize" onClick={this.CustomizeOff}>Done</button>;
      colorPicker = (
        <div className="picker">
          <SketchPicker
            color={ this.state.backgroundColor }
            onChangeComplete={this.handleChangeComplete}
          />
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
          <p>Loren ipsum</p>
        </div>
      </React.Fragment>
    );
  }
}
