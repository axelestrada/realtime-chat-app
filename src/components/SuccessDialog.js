import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import FormSubmitButton from "./FormSubmitButton";

import "./styles/css/SuccessDialog.css";

export default function SuccessDialog({
  title,
  subtitle,
  buttonTitle,
  visible,
  setVisible,
}) {
  return (
    <div
      className={`z-40 success-dialog w-full h-full absolute top-0 left-0 justify-center items-center flex transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="z-30 success-dialog__box bg-white px-5 py-7 w-10/12 text-center relative">
        <button
          type="button"
          className="success-dialog__close-button absolute top-2 right-2 text-2xl cursor-pointer"
        >
          <IonIcon
            icon={close}
            onClick={() => {
              setVisible(false);
            }}
          />
        </button>
        <div className="success-dialog__icon w-14 h-14 m-auto flex justify-center items-center bg-white relative rounded-full">
          <svg
            viewBox="0 0 512 512"
            height="25"
            width="25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <linearGradient id="gradient">
              <stop stopColor="#bde1c5" offset="0%" />
              <stop stopColor="#a7dcdc" offset="100%" />
            </linearGradient>
            <path
              fill="url(#gradient)"
              d="M450.585 68.552L198.52 320.617 61.415 183.513 0 244.928l198.52 198.52L512 129.968z"
            />
          </svg>
        </div>
        <div className="py-4">
          <h1 className="success-dialog__title text-xl">{title}</h1>
          <h3 className="success-dialog__subtitle pt-1">{subtitle}</h3>
        </div>
        <FormSubmitButton
          title={buttonTitle}
          onClick={() => {
            setVisible(false);
          }}
        />
      </div>
    </div>
  );
}
