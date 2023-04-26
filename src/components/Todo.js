import React, { useEffect, useRef, useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Webcam from "react-webcam";
import { addPhoto, DeletePhotoSrc, GetPhotoSrc } from "../db.js"
import { Modal, Button } from "react-bootstrap";

const WebcamCapture = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [imgId, setImgId] = React.useState(null);
  const [photoSave, setPhotoSave] = useState(false);
 const [closeButton, setColseButton] = useState(false);



  useEffect(() => {
    if (photoSave) {
      console.log("useEffect detected photoSave");
      props.photoedTask(imgId);
      setPhotoSave(false);
    } 
   }); 
  

  //console.log("WebCamCapture", props.id);
  const capture = React.useCallback((id) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log("capture", imageSrc.length, id);
  }, [webcamRef, setImgSrc]);

  const savePhoto = (id, imgSrc) => {
    console.log("savePhoto", imgSrc?.length, id);
    addPhoto(id, imgSrc);
    setImgId(id);
    setPhotoSave(true);
  };

  const cancelPhoto = (id, imgSrc) => {
    console.log("cancelPhoto", imgSrc?.length, id);
    DeletePhotoSrc(id);
    setImgSrc(imgSrc);
    setPhotoSave( false);
  }
  const changePhoto = (id, imgSrc) => {
    console.log("changePhoto", imgSrc?.length, id);
    cancelPhoto(id);
   
  }
  const handleClose = (closeButton) =>{
    console.log("handleClose" );
   Webcam().close();
   setColseButton(true);
  }
  return (
    <>
    <div className="webcam">
 
      {!imgSrc && (<Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="200"
        height="200"
      />)}
   
      {imgSrc && (
        <img
          src={imgSrc} alt={props.name}
        />
      )}
      <div className="btn-group bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4">
        {!imgSrc && (
          <button
            type="button"
            className="btn bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4"
            onClick={()=>capture(props.id)}
          >
            Capture photo
          </button>
        )}
        {imgSrc && (
          <button
            type="button"
            className="btn"
            onClick={()=>savePhoto(props.id,imgSrc)}
          >
            save Photo
          </button>
        )}
        {imgSrc && (
          <button
            type="button"
            className="btn"
            onClick={()=>changePhoto(props.id,imgSrc)}
          >
            Change Photo
          </button>
        )}
        <button
          type="button"
          className="btn todo-cancel"
          onClick={()=>cancelPhoto(props.id.imageSrc)}
         
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => handleClose(true)}
        >
          Close
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
      </div>  
      </div>
  </>
  );
};


const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);
 
  return (
    <>
      <div className="mx-auto px-2">
      <img src={photoSrc} alt={props.name}/>
      </div>  
  </>
  );
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName || props.name}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">

        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );



/*   Delete confirmation */

const DeleteConfirmation = ({ showModal, hideModal, confirmModal, id, type, message }) => {
    return (
        <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={hideModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => confirmModal(type,props.id) }>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    )
}
 

/* Delete Confirmation ends here */

  const viewTemplate = (
    <div className="stack-small mx-auto px-2">
      <div className="c-cb">
          <input
            id={props.id}
            type="checkbox"
            defaultChecked={props.completed}
            onChange={() => props.toggleTaskCompleted(props.id)}
          />
          <label className="todo-label" htmlFor={props.id}>{props.name}
            &nbsp; | &nbsp; 
            <a href={props.location.mapURL}>(Map)</a>
            &nbsp; | &nbsp;
            <a href={props.location.smsURL}>(sms)</a>
          </label>
        </div>
        <div className="btn-group">
         <button
          type="button"
          className="btn_edit"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
          >
            <i class="fa-solid fa-pencil"></i><span className="visually-hidden">{props.name}</span>
          </button>
          <div className="popup_group">
          <Popup trigger={<Button type="button" className="btn_take_photo"> Take Photo </Button>} modal >
            <div className="take_photo"><WebcamCapture id={props.id} photoedTask={props.photoedTask} className="triger_webcam"/></div>
        
          </Popup>
          </div>
          <div className="popup_group">
          <Popup trigger={<button type="button" className="btn_view_photo"> View Photo </button>} modal>
            <div className="view_photo "><ViewPhoto id={props.id} alt={props.name} className="triger_webcam"/></div>
          </Popup>  
          <Popup> {close => <cancelPhoto onclick={close} />}close </Popup>
          </div>        
          <button
            type="button"
            className="btn btn__danger "
            onClick={( ) => props.deleteTask(props.id)}
          >
            Delete <span className="visually-hidden">{props.name}</span>
          </button>
        </div>
    </div>
  );


  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    }
    if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);


  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}