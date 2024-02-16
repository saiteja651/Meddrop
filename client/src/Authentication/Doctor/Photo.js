// import React,{useState} from 'react';
// import ReactS3 from 'react-s3';

// window.Buffer = window.Buffer || require("buffer").Buffer;

// const config = {
//   bucketName: 'test12345111',
//   dirName: 'photos',
//   region: 'ap-south-1',
//   accessKeyId: "AKIAXYKJT73UV5Z7EAEX",
//   secretAccessKey: "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"
// }

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       uploadedLocation: null
//     };
//   }
 
//   uploadFile = (e) => {
//     console.log(e.target.files[0]);
//     ReactS3.uploadFile(e.target.files[0], config)
//       .then((data) => {
//         console.log(data);
//         console.log(data.location)
//         this.setState({ uploadedLocation: data.location });
//       })
//       .catch((err) => {
//         alert(err);
//       });
//   };

//   handleButtonClick = () => {
//     // Trigger upload when button is clicked
//     const fileInput = document.getElementById('fileInput');
//     if (fileInput) {
//       fileInput.click();
//     }
//   };

//   render() {
//     return (
//       <div>
//         <h3>Upload</h3>
//         <input
//           id="fileInput"
//           type="file"
//           style={{ display: 'none' }}
//           onChange={this.uploadFile}
//         />
//         <div onClick={this.handleButtonClick} style={{cursor : 'pointer'}}>Upload File</div>
        
//       </div>
//     );
//   }
// }

// export default App;
import React, { useState } from 'react';
import ReactS3 from 'react-s3';

window.Buffer = window.Buffer || require("buffer").Buffer;

const config = {
  bucketName: 'test12345111',
  dirName: 'photos',
  region: 'ap-south-1',
  accessKeyId: "AKIAXYKJT73UV5Z7EAEX",
  secretAccessKey: "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"
}

const Photo = ({setImage}) => {
  const [uploadedLocation, setUploadedLocation] = useState(null);
  const [imageName,setImagename]=useState()
  const uploadFile = (e) => {
    console.log(e.target.files[0]);
    setImagename(e.target.files[0].name)
    ReactS3.uploadFile(e.target.files[0], config)
      .then((data) => {
        console.log(data);
        console.log(data.location)
        setImage(data.location)
        setUploadedLocation(data.location);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleButtonClick = () => {
    // Trigger upload when button is clicked
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div>
      
      <h3><input
        id="fileInput"
        type="file"
        style={{ display: 'none' ,backgroundcolor:"green",height:"30px"}}
        onChange={uploadFile}
      /></h3>
      <div onClick={handleButtonClick} style={{ cursor: 'pointer' }}><h5>Upload Image</h5></div>
      {imageName && <p>{imageName}</p>}
    </div>
  );
}

export default Photo;
