import { IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import { Plugins, Capacitor } from "@capacitor/core";
import { useHistory, useLocation } from "react-router";

import Error from "../components/Error";
import Loader from "../components/Loader";
import ErrorDialog from "../components/ErrorDialog";
import MainContent from "../components/MainContent";
import ChatbitLogo from "../assets/images/chatbitLogo.jpg";

import axios from "axios";
import config from "../config.json";

const { Network } = Plugins;

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

export default function Start() {
  const history = useHistory();
  const location = useLocation();

  const [errorDialog, setErrorDialog] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  async function verifyToken() {
    const token = await storage.get("token");
    const connection = await Network.getStatus();

    setInternetConnection(connection.connected);

    if (connection.connected) {
      if (token) {
        await axios
          .get(`${config.SERVER_URL}/home`, {
            headers: {
              token,
            },
          })
          .then(() => {
            history.push("/home");
          })
          .catch((error) => {
            if (error.response && error.response.data.error) {
              return history.push("/login");
            }

            setErrorDialog(true);
            console.error(error);
          });
      } else {
        history.push("/login");
      }
    }
  }

  useEffect(() => {
    if (Capacitor.isNative) {
      Plugins.App.addListener("backButton", () => {
        const { pathname } = window.location;

        if (pathname === "/" || pathname === "/login" || pathname === "/home") {
          Plugins.App.exitApp();
        } else if (pathname === "/register" || pathname === "/forgot-password") {
          history.push("/login");
        } else if (pathname === "/register/otp-verification") {
          history.push("/register");
        }else if (pathname === "/home/chat" || pathname === "/home/contacts") {
          history.push("/home");
        }
      });
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (location.pathname === "/") {
      setErrorDialog(false);
      verifyToken();
    }
  }, [location, internetConnection]); // eslint-disable-line

  return (
    <IonPage>
      <MainContent>
        <ErrorDialog
          visible={errorDialog}
          setVisible={setErrorDialog}
          title="Error!"
          subtitle="Something went wrong!"
          buttonTitle="Try Again"
          onClick={() => {
            setErrorDialog(false);

            verifyToken();
          }}
        />

        <Error visible={!internetConnection}>
          <span>
            {!internetConnection && "Please check your internet connection"}
          </span>
        </Error>

        <Loader src={ChatbitLogo} visible={true} size="32" />
      </MainContent>
    </IonPage>
  );
}
