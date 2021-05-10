import { useEffect, useState, useCallback, useRef } from "react";
import { Plugins, CameraResultType } from "@capacitor/core";
import { defineCustomElements } from "@ionic/pwa-elements/loader";

import CameraPicture from "../assets/images/camera.svg";
import DefaultUser from "../assets/images/defaultUser.jpg";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./styles/css/SelectPicture.css";

const { Camera } = Plugins;

export default function SelectPicture({ photo, setPhoto }) {
  useEffect(() => {
    defineCustomElements(window);
  }, []);

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [tempPicture, setTempPicture] = useState("");
  const [completedCrop, setCompletedCrop] = useState(null);
  const [resizeVisible, setResizeVisible] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    aspect: 1 / 1,
  });

  async function takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    setTempPicture(image.dataUrl);
    setResizeVisible(true);
  }

  function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
      return;
    }

    setPhoto(canvas.toDataURL());
    setResizeVisible(false);
  }

  const onLoad = useCallback((img) => {
    imgRef.current = img;

    const aspect = 1 / 1;
    const width =
      img.width / aspect < img.height * aspect
        ? 100
        : ((img.height * aspect) / img.width) * 100;
    const height =
      img.width / aspect > img.height * aspect
        ? 100
        : (img.width / aspect / img.height) * 100;
    const y = (100 - height) / 2;
    const x = (100 - width) / 2;

    setCrop({
      unit: "%",
      width,
      height,
      x,
      y,
      aspect,
    });

    setCompletedCrop({
      unit: "px",
      width: img.width * (width / 100),
      height: img.height * (height / 100),
      x: img.width * (x / 100),
      y: img.width * (y / 100),
      aspect,
    });

    return false; // Return false if you set crop state in here.
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  return (
    <>
      <div className="select-picture relative w-44 h-44 mx-auto my-10 rounded-full border-solid border-white">
        <img
          className="w-full h-full object-cover object-center rounded-full"
          src={photo ? photo : DefaultUser}
          alt="Profile"
        />
        <button
          className="absolute bottom-0 right-0 w-12 h-12 p-0 rounded-full bg-white"
          type="button"
          onClick={() => takePicture()}
        >
          <img
            className="w-3/4 h-3/4 m-auto"
            src={CameraPicture}
            alt="Camera"
          />
        </button>
      </div>
      <div
        className={`resize-container bg-black z-50 p-4 pb-16 absolute top-0 left-0 flex justify-center items-center w-screen h-full transition-opacity duration-500 ${
          resizeVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ReactCrop
          src={tempPicture}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        />
        <div className="hidden">
          <canvas
            ref={previewCanvasRef}
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
            }}
          />
        </div>
        <div className="action-buttons w-full h-10 text-white absolute bottom-0 left-0">
          <button type="button" onClick={() => setResizeVisible(false)}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              generateDownload(previewCanvasRef.current, completedCrop)
            }
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
