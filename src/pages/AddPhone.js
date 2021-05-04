import { IonIcon, IonPage } from "@ionic/react";
import { Plugins } from "@capacitor/core";
import { useState, useEffect } from "react";

import Error from "../components/Error";
import Loader from "../components/Loader";
import FormHeader from "../components/FormHeader";
import MainContent from "../components/MainContent";
import FormContent from "../components/FormContent";

import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../styles/css/min/AddPhone.min.css";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";
import PhoneIcon from "../assets/images/phoneIcon.svg";
import FormSubmitButton from "../components/FormSubmitButton";
import { chevronForward } from "ionicons/icons";
import CheckPhone from "../functions/CheckPhone";
import { useHistory, useLocation } from "react-router";

const { Network } = Plugins;

export default function AddPhone() {
  const history = useHistory();
  const location = useLocation();

  const [showLoader, setShowLoader] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  const [addPhoneError, setAddPhoneError] = useState("");
  const [phone, setPhone] = useState("");

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAddPhoneError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [addPhoneError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVibrateError(false);
    }, 350);

    return () => clearTimeout(timeout);
  }, [vibrateError]);

  return (
    <IonPage>
      <MainContent>
        <Error
          visible={!internetConnection || addPhoneError}
          vibrate={vibrateError}
        >
          {!internetConnection && (
            <span>Please check your internet connection</span>
          )}
          {internetConnection && <span>{addPhoneError}</span>}
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
                const phoneNumber = parsePhoneNumber(phone);

                const characters = [
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ];
                let code = "";

                while (code.length <= 4) {
                  code += characters[Math.floor(Math.random() * 10)];
                }

                if (
                  await CheckPhone(
                    phone,
                    phoneNumber.nationalNumber,
                    code,
                    setShowLoader,
                    setAddPhoneError
                  )
                ) {
                  history.push("/register/otp-verification", {
                    sendType: "sms",
                    phone: phoneNumber.nationalNumber,
                    phoneIntl: phone,
                    userId: location.state && location.state.userId,
                    code,
                  });
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
