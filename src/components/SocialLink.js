import "./styles/css/min/SocialLogin.min.css";
import { IonIcon } from "@ionic/react";

export default function SocialLink({ onClick, icon, iconColor }) {
  return (
    <button
      className="social-link w-9 h-9 text-lg flex justify-center items-center bg-white rounded-full"
      type="button"
      onClick={onClick}
    >
      <IonIcon style={{ color: iconColor }} src={icon} />
    </button>
  );
}
