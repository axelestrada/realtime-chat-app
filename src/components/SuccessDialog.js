import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import "./styles/css/SuccessDialog.css";

export default function SuccessDialog({
  visible,
  setVisible,
  title,
  subtitle,
  buttonTitle,
  onClick = () => {},
}) {
  return (
    <div
      className={`success-dialog bg-white absolute top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-500 ${
        !visible && "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col justify-center items-center p-5">
        <button
          type="button"
          className="success-dialog__close-button absolute top-2 right-2 text-3xl cursor-pointer"
        >
          <IonIcon
            icon={close}
            onClick={() => {
              setVisible(false);
            }}
          />
        </button>

        <div className="bg-green-500 w-16 h-16 m-auto flex justify-center items-center relative rounded-full">
          <svg
            height="30"
            viewBox="0 0 515.556 515.556"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              d="M0 274.226l176.549 176.886L515.556 112.44l-48.67-47.997-290.337 290L47.996 225.891z"
            />
          </svg>
        </div>

        <div className="py-4 text-center">
          <h1 className="success-dialog__title text-2xl">{title}</h1>
          <h3 className="success-dialog__subtitle pt-1 text-lg">{subtitle}</h3>
        </div>

        <button
          className="success-dialog__submit-button uppercase rounded-full"
          onClick={() => {
            setVisible(false);

            onClick();
          }}
        >
          {buttonTitle}
        </button>
      </div>
    </div>
  );
}
