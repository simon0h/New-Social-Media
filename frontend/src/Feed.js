import React, {Component} from "react";
import "./App.css";

// export default class Feed extends Component {
// 
//   constructor(props) {
//     super(props);
//     this.myRef = React.createRef();
//     this.uploadedImage = React.createRef();
//     this.imageUploader = React.createRef();
//     this.images = [];
//   }
// 
//   // var showImages = (
//   //   <div className ="image">
//   //     <img
//   //       ref={uploadedImage}
//   //       style={{
//   //         borderRadius: "10px",
//   //         width: "500px",
//   //         height: "auto",
//   //         position: "relative",
//   //         left: "30px"
//   //       }}
//   //     />
//   //   </div>
//   // )
// 
//   handleImageUpload = e => {
//     const [file] = e.target.files;
//     if (file) {
//       this.images.push(file);
// //       const reader = new FileReader();
// //       const {current} = this.uploadedImage;
// //       current.file = file;
// //       reader.onload = (e) => {
// //           current.src = e.target.result;
// //       }
// // 
// //       // var i;
// //       // for (i = 0; i < this.images.length; i++) {
// //       //   reader.readAsDataURL(this.images[i]);
// //       // }
// //       reader.readAsDataURL(file);
//     }
//     if (this.images.length > 0) {
//       var i;
//       for (i = 0; i < this.images.length; i++) {
//         const reader = new FileReader();
//         const {current} = this.uploadedImage;
//         current.file = file;
//         reader.onload = (e) => {
//             current.src = e.target.result;
//         }
// 
//         // var i;
//         // for (i = 0; i < this.images.length; i++) {
//         //   reader.readAsDataURL(this.images[i]);
//         // }
//         reader.readAsDataURL(this.images[i]);
//       }
//     }
//     console.log(this.uploadedImage);
//     console.log(this.images);
//   };
//   //Backend: store images in the servers, send a GET request to images that the follower posted
// 
//   render() {
//     var showImages = (
//       <div className ="image">
//         <img
//           ref={this.uploadedImage}
//           style={{
//             borderRadius: "10px",
//             width: "500px",
//             height: "auto",
//             position: "relative",
//             left: "30px"
//           }}
//         />
//       </div>
//     )
// 
//     return (
//       <React.Fragment>
//         <title>Feed</title>
//         <h2>Your Feed</h2>
//         <div className="upload">
//           <input type="file" multiple accept="image/*" onChange={this.handleImageUpload} ref={this.imageUploader}/>
//           {/* {showImages} */}
//           {(this.images || []).map(url => (
//                         <img src={url} alt="..." />
//                     ))}
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// export default Feed;

export default class Feed extends Component {

    fileObj = [];
    fileArray = [];

    constructor(props) {
        super(props)
        this.state = {
            file: [null]
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }

    uploadMultipleFiles(e) {
        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {
            this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
        }
        this.setState({file: this.fileArray})
    }

    uploadFiles(e) {
        e.preventDefault()
        console.log(this.state.file)
    }

    render() {
        return (
            <form>
              <div className="upload">
                <input type="file" onChange={this.uploadMultipleFiles} multiple />
              </div>
                {/* <button type="upload" className="upload" onClick={this.uploadFiles}>Upload</button> */}
                <div className="multipleImages">
                  {(this.fileArray || []).map(url => (
                    <img src={url} alt="..."/>
                  ))}
                </div>

                {/* <div className="form-group"> */}
                {/*     <input type="file" className="form-control" onChange={this.uploadMultipleFiles} multiple /> */}
                {/* </div> */}
                {/* <button type="upload" className="upload" onClick={this.uploadFiles}>Upload</button> */}
            </form >
        )
    }
}
