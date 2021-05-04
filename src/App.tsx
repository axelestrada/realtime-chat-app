import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupConfig } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Start from "./pages/Start.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import OtpVerification from "./pages/OtpVerification.js";
import SelectImage from "./pages/SelectImage.js";
import AddPhone from './pages/AddPhone.js';
import Home from "./pages/Home.js";
import Chat from "./pages/Chat.js";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./styles/tailwind.min.css";
import "./styles/css/min/Main.min.css";
import Contacts from "./pages/Contacts.js";
import StartChat from "./pages/StartChat.js";


setupConfig({
  hardwareBackButton: false,
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/home/chat">
          <Chat />
        </Route>
        <Route exact path="/home/start-chat">
          <StartChat />
        </Route>
        <Route exact path="/home/contacts">
          <Contacts />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/register/select-image">
          <SelectImage />
        </Route>
        <Route exact path="/register/otp-verification">
          <OtpVerification />
        </Route>
        <Route exact path="/register/add-phone">
          <AddPhone />
        </Route>
        <Route exact path="/">
          <Start />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
