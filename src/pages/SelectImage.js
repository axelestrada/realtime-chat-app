import { IonPage } from "@ionic/react";
import { Plugins } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

import Error from "../components/Error";
import Loader from "../components/Loader";
import FormHeader from "../components/FormHeader";
import FormContent from "../components/FormContent";
import MainContent from "../components/MainContent";
import SelectPicture from "../components/SelectPicture";
import FormSubmitButton from "../components/FormSubmitButton";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import axios from "axios";
import config from "../config.json";

const { Network } = Plugins;

export default function SelectImage() {
  const history = useHistory();
  const location = useLocation();

  const [photo, setPhoto] = useState();
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVibrateError(false);
    }, 350);

    return () => clearTimeout(timeout);
  }, [vibrateError]);

  async function uploadPhoto() {
    const connection = await Network.getStatus();
    setInternetConnection(connection.connected);

    if (connection.connected) {
      if (photo) {
        setShowLoader(true);

        const canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 500;

        let context = canvas.getContext("2d");
        let img = document.createElement("img");
        img.src = photo;

        img.onload = async function () {
          context.scale(500 / img.width, 500 / img.height);
          context.drawImage(img, 0, 0);

          try {
            const form = new FormData();

            form.append("url", canvas.toDataURL());
            form.append("id", location.state.userId);

            await axios
              .post(`${config.SERVER_URL}/user/upload-image`, form, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(() => {
                history.push("/register/add-phone", {
                  userId: location.state.userId,
                });
              })
              .catch((error) => {
                if (error.response && error.response.data.error) {
                  return setError(error.response.data.error);
                }

                setError("An unexpected error has ocurred");
                console.error(error);
              });
          } catch (error) {
            setError("An unexpected error has ocurred");
            console.error(error);
          }

          setShowLoader(false);
        };
      } else if (location.state) {
        history.push("/register/add-phone", {
          userId: location.state.userId,
        });
      } else {
        setError("An unexpected error has ocurred");
      }
    } else {
      setVibrateError(true);
    }
  }

  return (
    <IonPage>
      <MainContent>
        <Loader visible={showLoader} src={ChatBitLogo} />
        <Error visible={!internetConnection || error} vibrate={vibrateError}>
          <span>
            {(!internetConnection && "Please check your internet connection") ||
              error}
          </span>
        </Error>
        <FormContent justifyContent="justify-between">
          <FormHeader
            title="Profile Picture"
            subtitle="Select an image for your profile"
          />
          <SelectPicture
            photo={photo}
            setPhoto={setPhoto}
            setShowLoader={setShowLoader}
          />

          <FormSubmitButton title="Done" onClick={() => uploadPhoto()} />
        </FormContent>
      </MainContent>
    </IonPage>
  );
}
