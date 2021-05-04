import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { IonPage } from "@ionic/react";
import { Plugins } from "@capacitor/core";
import axios from "axios";

import Loader from "../components/Loader";
import Error from "../components/Error";
import FormContent from "../components/FormContent";
import FormHeader from "../components/FormHeader";
import FormSubmitButton from "../components/FormSubmitButton";
import MainContent from "../components/MainContent";
import SelectPicture from "../components/SelectPicture";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

const { Network } = Plugins;

export default function SelectImage() {
  const location = useLocation();
  const history = useHistory();

  const [photo, setPhoto] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);
  const [selImageError, setSelImageError] = useState("");

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelImageError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [selImageError]);

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
              .post("http://192.168.0.106:3300/user/upload-image", form, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                history.push("/register/add-phone", {
                  userId: location.state.userId,
                });
              })
              .catch((error) => {
               if (error.response && error.response.data.error) {
                 return setSelImageError(error.response.data.error);
               }

               setSelImageError("An unexpected error has ocurred");
               console.error(error);
              });
          } catch (error) {
            setSelImageError("An unexpected error has ocurred");
            console.error(error);
          }

          setShowLoader(false);
        };
      } else if (location.state) {
        history.push("/register/add-phone", {
          userId: location.state.userId,
        });
      } else {
        setSelImageError("An unexpected error has ocurred");
      }
    } else {
      setVibrateError(true);
    }
  }

  return (
    <IonPage>
      <MainContent>
        <Loader visible={showLoader} src={ChatBitLogo} />
        <Error
          visible={!internetConnection || selImageError}
          vibrate={vibrateError}
        >
          {!internetConnection && (
            <span>Please check your internet connection</span>
          )}
          {internetConnection && <span>{selImageError}</span>}
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

          <FormSubmitButton
            title="Done"
            onClick={() => uploadPhoto()}
          />
        </FormContent>
      </MainContent>
    </IonPage>
  );
}
