import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

import "./styles/css/min/ErrorDialog.min.css";

export default function ErrorDialog({
  visible,
  setVisible,
  title,
  subtitle,
  buttonTitle,
  onClick = () => {},
}) {
  return (
    <div className={`error-dialog bg-white absolute top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-500 ${!visible && "opacity-0 pointer-events-none"}`}>
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          className="error-dialog__close-button absolute top-2 right-2 text-3xl cursor-pointer"
        >
          <IonIcon
            icon={close}
            onClick={() => {
              setVisible(false);
            }}
          />
        </button>

        <div className="bg-red-500 w-16 h-16 m-auto flex justify-center items-center relative rounded-full">
          <svg
            height="30"
            viewBox="0 0 512.001 512.001"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              d="M512.001 84.853L427.148 0 256.001 171.147 84.853 0 0 84.853 171.148 256 0 427.148l84.853 84.853 171.148-171.147 171.147 171.147 84.853-84.853L340.853 256z"
            />
          </svg>
        </div>

        <div className="py-4 text-center">
          <h1 className="error-dialog__title text-2xl">{title}</h1>
          <h3 className="error-dialog__subtitle pt-1 text-lg">{subtitle}</h3>
        </div>

        <button className="error-dialog__submit-button uppercase rounded-full" onClick={onClick}>
          {buttonTitle}
        </button>
      </div>
    </div>
  );
}
