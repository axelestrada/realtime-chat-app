import {
  chatbubbleEllipsesOutline,
  homeOutline,
  personOutline,
} from "ionicons/icons";
import { IonIcon, IonRouterLink } from "@ionic/react";

import "./styles/css/min/HomeFooter.min.css";

export default function HomeFooter() {
  return (
    <div className="home__footer bg-white relative py-6 flex items-center justify-evenly rounded-t-3xl">
      <IonRouterLink className="button" routerLink="/home">
        <IonIcon className="icon" src={homeOutline} />
      </IonRouterLink>

      <div>
        <div className="floating-button rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <IonRouterLink className="button" routerLink="/home/start-chat">
            <IonIcon className="icon" src={chatbubbleEllipsesOutline} />
          </IonRouterLink>
        </div>
      </div>

      <IonRouterLink className="button" routerLink="/home/contacts">
        <IonIcon className="icon" src={personOutline} />
      </IonRouterLink>
    </div>
  );
}
