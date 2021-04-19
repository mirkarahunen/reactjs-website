import React, { useRef, useState, useEffect } from 'react'
import './ImageUpload.css'

// Image upload component with accepting props from outside
const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  // Establish a connection to a DOM (image upload input) element
  const filePickerRef = useRef();

  // Triggered whenever the file is being changed, generate preview
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {

      // Set preview url
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  // Once the user has picked a file, generate file preview
  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid;
    
    // If user has picked a file
    if (event.target.files && event.target.files.length === 1) {

      // Extract the uploaded file
      pickedFile = event.target.files[0];

      // Set file to the picked one
      setFile(pickedFile);

      // File exists -> change isValid state to true
      setIsValid(true);

      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    // Call input and update file state
    props.onInput(props.id, pickedFile, fileIsValid);

  };

  // Open up a file picker window to choose an image
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div>
        <div className="img-preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Update profile image.</p>}
        </div>
        <button type="button" onClick={pickImageHandler} className="Choose-File">
          <i className="fas fa-camera"></i>
        </button>
      </div>
      
    </div>
  );
};

export default ImageUpload;
