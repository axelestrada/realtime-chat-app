import "./styles/css/min/FormRouterLink.min.css";
import { IonRouterLink } from "@ionic/react";

export default function FormRouterLink({ title, link, linkTitle }) {
  return (
    <div className="form-router-link text-center text-base mt-4 mb-4">
      <p>
        {title}
        <IonRouterLink routerLink={link} className="link ml-1">
          {linkTitle}
        </IonRouterLink>
      </p>
    </div>
  );
}
