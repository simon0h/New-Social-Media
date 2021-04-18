import React from 'react';
import logo from './logo.svg';
import './App.css';

function Feed() {
  const uploadedImage = React.useRef(null);

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

  return (
    <React.Fragment>
      <title>Feed</title>
      <h2>Your Feed</h2>
      <div className="Upload">
        <input type="file" accept="image/*" onChange={handleImageUpload} multiple="false"/>
        <div className ="image">
          <img
            ref={uploadedImage}
            style={{
              width: "35%",
              height: "auto",
              position: "absolute"
            }}
          />
        </div>
      </div>
      <body className="intro">
        <p> Loren ipsum </p>
      </body>
    </React.Fragment>
  );
}

export default Feed;
