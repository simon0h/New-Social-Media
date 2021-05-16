import React from 'react';

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);

    fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ imageURL: `http://localhost:8000/${body.file}` });
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <br />
        <input type="file" id="file"/>
        <br />
        <strong>
            <p id="url"></p>
        </strong>

        {/* { */}
        {/*     const file = document.getElementById("file") */}
        {/*     const img = document.getElementById("img") */}
        {/*     const url = document.getElementById("url") */}
        {/*     file.addEventListener("change", ev => { */}
        {/*         const formdata = new FormData() */}
        {/*         formdata.append("image", ev.target.files[0]) */}
        {/*         fetch("https://api.imgur.com/3/image/", { */}
        {/*             method: "post", */}
        {/*             headers: { */}
        {/*                 Authorization: "Client-ID 9342dce25ceebef" */}
        {/*             }, */}
        {/*             body: formdata */}
        {/*         }).then(data => data.json()).then(data => { */}
        {/*             img.src = data.data.link */}
        {/*             url.innerText = data.data.link */}
        {/*         }) */}
        {/*     }) */}
        {/* } */}
      </React.Fragment>
    );
  }
}

export default ImageUploader;