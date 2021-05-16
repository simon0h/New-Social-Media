import React, {Component} from "react";
import "./App.css";
import ImageUploader from "./ImageUploader";
import axios from "axios";

export default class Feed extends Component {
  fileObj = [];
  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {file: [null], post: false, textPosts: [], imgPosts: []};
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.allImgPosts = this.allImgPosts.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestAlbum = this.requestAlbum.bind(this);
  }

  requestAlbum() {
    var api_key = "9342dce25ceebef";
    var request_url = "https://api.imgur.com/3/image/qfx4GBy";
    var req = new XMLHttpRequest();
    var that = this;
    
    req.onreadystatechange = function() { 
       if (req.readyState === 4 && req.status === 200) {
         if (req.responseText === "Not found") {
            console.log("Imgur album not found.");
          } 
          else {
            var json = JSON.parse(req.responseText);    // You got your response back!
            console.log("Imgur JSON - ", json);
            console.log("Imgur link - ", json.data.link);
            that.setState({link: json.data.link});
          }
       } 
       else {
         console.log("Error with Imgur Request.");
       }
    }  
    req.open("GET", request_url, true); // true for asynchronous     
    req.setRequestHeader("Authorization", "Client-ID " + api_key);
    req.send(null);
  }

  componentDidMount = () => {
    //e.preventDefault();
    //this.requestAlbum();
    
    if (this.props.username === undefined) {
      console.log("Feed - undefined username");
    }
    else { 
      console.log("Feed - username - ", this.props.username);
      axios.post("http://localhost:5000/flask/hello", {type: "getFollowingTextPosts", message: this.props.username})
        .then(response => {
          this.setState({textPosts: response.data.arr})
          console.log("Feed - Backend: following text posts - ", this.state.textPosts);
        })
      axios.post("http://localhost:5000/flask/hello", {type: "getFollowingImagePosts", message: this.props.username})
        .then(response => {
          this.setState({imgPosts: response.data.arr})
          console.log("Feed - Backend: following image posts - ", this.state.imgPosts);
        })
    }
  }

  uploadMultipleFiles(e) {
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
        var url;
        // console.log("2", this.fileObj[0][i]);
        this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
        const formdata = new FormData()
        formdata.append("image", this.fileObj[0][i]);
        fetch("https://api.imgur.com/3/image/", {
            method: "post",
            headers: {
                Authorization: "Client-ID 9342dce25ceebef"
            },
            body: formdata
        }).then(data => data.json()).then(data => {
            url = data.data.link;
            console.log(url);
            axios.post("http://localhost:5000/flask/hello", {type: "newImagePost", message: url})
              .then(response => {
                console.log("Feed - Backend: new image posts - ", response.data.message);
              })
        })
    }

    //Todo 
    // change feed so multiple posts can go on it 
    // 


    this.setState({file: this.fileArray});
  }

  allImgPosts() {
    let imgObj = [];
    imgObj.push(this.state.imgPosts);
    //imgObj.push(this.fileArray);
    console.log("imgObj: ", imgObj);
    return (
      (imgObj|| []).map(url => <img src={url} className="multipleImages" alt="" key={url}/>)
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
        console.log("Feed - Backend: new text post - ", response.data.arr);
    })
  }

  render() {
    var post = this.state.post;
    var textPosts = this.state.textPosts;
    let postButton;
    let postImageButton;
    let postTextButton;
    let allTextPosts = textPosts.map((p) => <div className="posts">{p}</div>);
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

    return (
      <React.Fragment>
        {postButton}
        {postImageButton}
        {postTextButton}
        {allTextPosts}
        {/* <ImageUploader /> */}
        <div className="multipleImages">
          {this.allImgPosts()}
        </div>
      </React.Fragment>
    )
  }
}
