
import Webcam from "react-webcam";
import Popup from 'reactjs-popup';
import { addPhoto, GetPhotoSrc } from "../db.js"

function Camera(props) {

    const WebcamCapture = (props) => {
        const webcamRef = React.useRef(null);
        const [imgSrc, setImgSrc] = React.useState(null);
        const [imgId, setImgId] = React.useState(null);
        const [photoSave, setPhotoSave] = useState(false);
        const [changePhoto, setChangePhoto] = useState(false)
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
          cancelPhoto(id);
          setPhotoSave();
        }
        return (
          <>
          
            {!imgSrc && (<Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="400"
              height="400"
            />)}
         
            {imgSrc && (
              <img
                src={imgSrc}
              />
            )}
            <div className="btn-group">
              {!imgSrc && (
                <button
                  type="button"
                  className="btn"
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
                  Save Photo
                </button>
              )}
          {/*     this is fixed to test the code */}
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
                onClick={()=>cancelPhoto(props.id,imgSrc)}
               
              >
                Cancel
              </button>
            </div>  
            
        </>
        );
      };
      const ViewPhoto = (props) => {
        const photoSrc = GetPhotoSrc(props.id);
        return (
          <>
            <div>
            <img src={photoSrc} alt={props.name}/>
            </div>  
        </>
        );
      };

      const viewTemplate = (
        <div className="stack-small">
          <div className="c-cb">
              <input
                id={props.id}
                type="checkbox"
                defaultChecked={props.completed}
                onChange={() => props.toggleTaskCompleted(props.id)}
              />
              <label className="todo-label" htmlFor={props.id}>{props.name}
                &nbsp; | &nbsp; 
                <a href={props.location.mapURL}>(map)</a>
                &nbsp; | &nbsp;
                <a href={props.location.smsURL}>(sms)</a>
              </label>
            </div>
            <div className="btn-group">
            <button
              type="button"
              className="btn btn_green"
              onClick={() => setEditing(true)}
              ref={editButtonRef}
              >
                Edit <span className="visually-hidden">{props.name}</span>
              </button>
              <Popup trigger={<button type="button" className="btn"> Take Photo </button>} modal>
                <div><WebcamCapture id={props.id} photoedTask={props.photoedTask}/></div>
              </Popup>
              <Popup trigger={<button type="button" className="btn"> View Photo </button>} modal>
                <div><ViewPhoto id={props.id} alt={props.name}/></div>
                <Popup> {close => <cancelPhoto onclick={close} />} </Popup>
              </Popup>          
              <button
                type="button"
                className="btn btn__danger"
                onClick={() => props.deleteTask(props.id)}
              >
                Delete <span className="visually-hidden">{props.name}</span>
              </button>
            </div>
        </div>
      );
    


    return (
    <div>
         <Popup trigger={<button type="button" className="btn"> Take Photo </button>} modal>
            <div><WebcamCapture id={props.id} photoedTask={props.photoedTask}/></div>
          </Popup>
          <Popup trigger={<button type="button" className="btn"> View Photo </button>} modal>
            <div><ViewPhoto id={props.id} alt={props.name}/></div>
            <Popup> {close => <cancelPhoto onclick={close} />} </Popup>
          </Popup> 
    </div>
  )   
}

export default Camera;
