import { Plugins } from "@capacitor/core";
import { useState, useEffect } from "react";
import { IonIcon, IonPage } from "@ionic/react";
import { useHistory, useLocation } from "react-router";

import Error from "../components/Error";
import Loader from "../components/Loader";
import FormHeader from "../components/FormHeader";
import MainContent from "../components/MainContent";
import FormContent from "../components/FormContent";
import FormSubmitButton from "../components/FormSubmitButton";

import axios from "axios";
import "react-phone-number-input/style.css";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";

import { chevronForward } from "ionicons/icons";
import PhoneIcon from "../assets/images/phoneIcon.svg";
import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import GenerateCode from "../functions/GenerateCode";
import config from "../config.json";

const { Network } = Plugins;

export default function AddPhone() {
  const history = useHistory();
  const location = useLocation();

  const [showLoader, setShowLoader] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

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

  return (
    <IonPage>
      <MainContent>
        <Error visible={!internetConnection || error} vibrate={vibrateError}>
          <span>
            {(!internetConnection && "Please check your internet connection") ||
              error}
          </span>
        </Error>
        <Loader visible={showLoader} src={ChatBitLogo} />
        <FormContent justifyContent="justify-end" alignItems="items-end">
          <button
            type="button"
            className="skip-button flex justify-center items-center mb-3"
            onClick={() => {
              history.push("/home");
            }}
          >
            Skip
            <IonIcon src={chevronForward} className="ml-1" />
          </button>
          <img
            src={PhoneIcon}
            alt="phone"
            className="w-28 h-28 object-cover m-auto mb-5"
          />
          <FormHeader
            title="Add your phone number"
            subtitle="Add your phone number so your friends can find you more easily"
          />
          <form
            className="w-full"
            onSubmit={async (e) => {
              e.preventDefault();

              const connection = await Network.getStatus();
              setInternetConnection(connection.connected);

              if (connection.connected) {
                if (phone && location.state && location.state.userId) {
                  const code = GenerateCode();
                  const phoneNumber = parsePhoneNumber(phone);

                  setShowLoader(true);

                  await axios
                    .post(`${config.SERVER_URL}/user/send-sms`, {
                      code,
                      to: phone,
                    })
                    .then(() => {
                      history.push("/register/otp-verification", {
                        sendType: "sms",
                        phone: phoneNumber.nationalNumber,
                        phoneIntl: phone,
                        userId: location.state && location.state.userId,
                        code,
                      });
                    })
                    .catch((error) => {
                      if (error.response && error.response.data.error) {
                        return setError(error.response.data.error);
                      }

                      setError("An unexpected error has ocurred");
                      console.error(error);
                    });

                  setShowLoader(false);
                }
              } else {
                setVibrateError(true);
              }
            }}
          >
            <PhoneInput defaultCountry="HN" value={phone} onChange={setPhone} />
            <FormSubmitButton title="Done" />
          </form>
        </FormContent>
      </MainContent>
    </IonPage>
  );
}
