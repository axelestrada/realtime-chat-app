import { Plugins } from "@capacitor/core";
import { useEffect, useState } from "react";
import { IonIcon, IonPage } from "@ionic/react";
import { useHistory, useLocation } from "react-router";

import Error from "../components/Error";
import Loader from "../components/Loader";
import FormInput from "../components/FormInput";
import FormHeader from "../components/FormHeader";
import FormContent from "../components/FormContent";
import MainContent from "../components/MainContent";
import FormSubmitButton from "../components/FormSubmitButton";

import axios from "axios";

import {
  checkmarkCircleOutline,
  closeOutline,
  eyeOffOutline,
  eyeOutline,
  key,
} from "ionicons/icons";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import config from "../config.json";

const { Network } = Plugins;

export default function ResetPassword() {
  const history = useHistory();
  const location = useLocation();

  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [samePassword, setSamePassword] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [internetConnection, setInternetConnection] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    const connection = await Network.getStatus();
    setInternetConnection(connection.connected);

    if (connection.connected) {
      if (newPassword === confirmPassword) {
        if (newPassword.length < 6) {
          setError("The password must be at least 6 characters");
        } else {
          setShowLoader(true);

          await axios
            .put(`${config.SERVER_URL}/user/update-password`, {
              email: location.state && location.state.email,
              password: newPassword,
            })
            .then(() => {
              history.push("/login");
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
        setError("Passwords do not match");
      }
    } else {
      setVibrateError(true);
    }
  };

  useEffect(() => {
    if (newPassword) {
      setSamePassword(newPassword === confirmPassword);
    } else {
      setSamePassword(false);
    }
  }, [newPassword, confirmPassword]);

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
            title="Reset Password"
            subtitle="Enter the new password and let's being extra safe"
          />
          <div className="relative mx-auto rounded-full w-20 h-20 key-icon flex justify-center items-center">
            <div className="edge absolute top-0 left-0 w-full h-full"></div>
            <IonIcon className="text-white w-10 h-10" src={key} />
          </div>
          <form autoComplete="off" onSubmit={onSubmit}>
            <FormInput title="New Password">
              <input
                className="pr-4"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <IonIcon src={showPassword ? eyeOffOutline : eyeOutline} />
              </button>
            </FormInput>
            <FormInput title="Confirm Password">
              <input
                className="pr-4"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <IonIcon
                className="icon w-7 h-7"
                style={{ color: samePassword ? "#a2d5c2" : "#d995a3" }}
                src={samePassword ? checkmarkCircleOutline : closeOutline}
              />
            </FormInput>

            <FormSubmitButton title="Done" mt="7" />
          </form>
        </FormContent>
      </MainContent>
    </IonPage>
  );
}
