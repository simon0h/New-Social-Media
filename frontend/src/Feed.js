import React, {Component} from "react";
import "./App.css";
import axios from "axios";

export default class Feed extends Component {
  fileObj = [];
  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {file: [null], post: false, textPosts: [null], imgPosts: [null]};
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.allImgPosts = this.allImgPosts.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    //e.preventDefault();
    let none = "none";
    if (this.props.username === undefined) {
      console.log("undefined")
    }
    else { 
      axios.post("http://localhost:5000/flask/hello", {type: "getFollowingTextPosts", message: this.props.username})
        .then(response => {
          this.setState({textPosts: response.data.arr})
          console.log("Backend: following text posts - ", this.state.textPosts);
        })
      axios.post("http://localhost:5000/flask/hello", {type: "getFollowingImagePosts", message: this.props.username})
        .then(response => {
          this.setState({imgPosts: response.data.arr})
          console.log("Backend: following image posts - ", this.state.imgPosts);
        })
    }
  }

  uploadMultipleFiles(e) {
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
        //console.log("1", this.fileObj[0]);
        //console.log("2", this.fileObj[0][i]);
        this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
    //console.log("3", this.fileArray);
    for (let i = 0; i < this.fileArray.length; i++) {
      axios.post("http://localhost:5000/flask/hello", {type: "newImages", message: this.fileArray[i]})
        .then(response => {
          console.log("Backend: new image post - ", response.data.message);
      })
    }
    this.setState({file: this.fileArray});
  }

  allImgPosts() {
    let imgObj = [];
    imgObj.push(this.state.imgPosts);
    return (
      (imgObj|| []).map(url => <img src={url} className="multipleImages" alt="Image placeholder" key={url}/>)
    )
  }

  uploadFiles(e) {
    e.preventDefault();
    //console.log(this.state.file);
  }

  PostOn = () => {
    this.setState({post: true});
  }

  PostOff = () => {
    this.setState({post: false});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:5000/flask/hello", {type: "newTextPost", message: this.state.textPost})
      .then(response => {
        this.setState({posts: response.data.arr})
        console.log("Backend: new text post - ", response.data.arr);
    })
  }

  render() {
    var post = this.state.post;
    var textPosts = this.state.textPosts;
    let postButton;
    let postImageButton;
    let postTextButton;
    let allTextPosts;
    console.log(textPosts);

    if (!post) {
      postButton = <button type="post" onClick={this.PostOn}>Post</button>;
      postImageButton = <div></div>;
      postTextButton = <div></div>;
    }
    else {
      postButton = <button type="post" onClick={this.PostOff}>Done</button>;
      postImageButton = (
        <form>
          <div className="upload">
            <input type="file" onChange={this.uploadMultipleFiles} multiple/>
          </div>
          <div className="multipleImages">
            {(this.fileArray || []).map(url => (
              <img src={url} alt="..." style={{
                borderRadius:"10px",
                height:"auto",
                left:"30px",
                marginTop:"20px",
                marginRight:"20px",
                width:"500px"}}/>
            ))}
          </div>
        </form>
      )
      postTextButton = (
        <form onSubmit={this.handleSubmit}>
          <label>
            <div className="textPost">Text post:</div>
            <input type="text" onChange={e => this.setState({textPost: e.target.value})}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      )
    }
    allTextPosts = (
      <div>
      {textPosts.map(p => <div className="posts" key={p}>{p}</div>)}
      </div>);

    return (
      <React.Fragment>
        {postButton}
        {postImageButton}
        {postTextButton}
        {allTextPosts}
        <div className="multipleImages">
          {this.allImgPosts()}
        </div>
      </React.Fragment>
    )
  }
}
