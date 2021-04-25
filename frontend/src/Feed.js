import React from 'react';
import './App.css';

function Feed() {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const handleImageUpload = e => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const {current} = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
          current.src = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  };
  //Backend: store images in the servers, send a GET request to images that the follower posted

  return (
    <React.Fragment>
      <title>Feed</title>
      <h2>Your Feed</h2>
      <div className="upload">
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={imageUploader}
          style={{display: "none"}}/>
        <div className ="image" onClick={() => imageUploader.current.click()}>
          <img
            ref={uploadedImage}
            style={{
              border: "5px solid #708090",
              borderRadius: "10px",
              width: "400px",
              height: "auto",
              position: "relative",
              left: "30px"
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Feed;
