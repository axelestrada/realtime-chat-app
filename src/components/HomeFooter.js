import { useHistory } from "react-router";
import { IonIcon, IonRouterLink } from "@ionic/react";

import {
  chatbubbleEllipsesOutline,
  homeOutline,
  personOutline,
} from "ionicons/icons";

import "./styles/css/HomeFooter.css";

export default function HomeFooter({ lastConversation }) {
  const history = useHistory();

  return (
    <div className="home__footer bg-white relative py-6 flex items-center justify-evenly rounded-t-3xl">
      <IonRouterLink className="button" routerLink="/home">
        <IonIcon className="icon" src={homeOutline} />
      </IonRouterLink>

      <div>
        <div className="floating-button rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <button
            className="button"
            onClick={() => {
              if (lastConversation) {
                history.push("/home/chat", {
                  userId:
                    lastConversation.contactInfo &&
                    lastConversation.contactInfo._id,
                  userName:
                    lastConversation.contactInfo &&
                    lastConversation.contactInfo.name,
                });
              } else {
                history.push("/home/contacts");
              }
            }}
          >
            <IonIcon className="icon" src={chatbubbleEllipsesOutline} />
          </button>
        </div>
      </div>

      <button
        className="button"
        onClick={() => {
          history.push("/home/contacts", { lastConversation });
        }}
      >
        <IonIcon className="icon" src={personOutline} />
      </button>
    </div>
  );
}
