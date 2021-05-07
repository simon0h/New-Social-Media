import React, {Component} from "react";
import "./App.css";
import axios from "axios"

export default class Feed extends Component {
  fileObj = [];
  fileArray = [];

  constructor(props) {
      super(props);
      this.state = {file: [null], post: false, posts: []};
      this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
      this.uploadFiles = this.uploadFiles.bind(this);
  }

  componentDidMount = () => {
    axios.post("http://localhost:5000/flask/hello", {type: "textPosts"})
      .then(response => {
        this.setState({posts: response.data.posts})
        console.log(this.state.posts);
      })
  }

  uploadMultipleFiles(e) {
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
        this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
    this.setState({file: this.fileArray});
  }

  uploadFiles(e) {
    e.preventDefault();
    console.log(this.state.file);
  }

  PostOn = () => {
    this.setState({post: true});
  }

  PostOff = () => {
    this.setState({post: false});
  }

  render() {
    var post = this.state.post;
    var posts = this.state.posts;
    let postButton;
    let postImageButton;
    let postTextButton;
    let allTextPosts;

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
        <form>
          <label>
            Text post:
            <input type="text" name="textPost"/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      )
    }
    allTextPosts = (
      <div>
      {posts.map(p => <div className="posts" key={p}>{p}</div>)}
      </div>);

    return (
      <React.Fragment>
        {postButton}
        {postImageButton}
        {postTextButton}
        {allTextPosts}
      </React.Fragment>
    )
  }
}
