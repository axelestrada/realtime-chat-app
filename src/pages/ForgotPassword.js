import { IonPage } from "@ionic/react";
import { useHistory } from "react-router";
import { Plugins } from "@capacitor/core";
import { useState, useEffect } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";

import Error from "../components/Error";
import Loader from "../components/Loader";
import FormInput from "../components/FormInput";
import FormHeader from "../components/FormHeader";
import FormContent from "../components/FormContent";
import MainContent from "../components/MainContent";
import FormSubmitButton from "../components/FormSubmitButton";
import CartoonUserAvatar from "../components/CartoonUserAvatar";

import sadUser from "../assets/images/sadUser.png";
import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import GenerateCode from "../functions/GenerateCode";

import config from "../config.json";

const { Network } = Plugins;

export default function ForgotPassword() {
  const history = useHistory();

  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      email: "",
    },
  });

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  const onSubmit = async (data, e) => {
    const connection = await Network.getStatus();
    setInternetConnection(connection.connected);

    if (connection.connected) {
      const code = GenerateCode();

      setShowLoader(true);

      await axios
        .post(`${config.SERVER_URL}/user/send-recovery-email`, {
          email: data.email,
          code,
        })
        .then(() => {
          history.push("/register/otp-verification", {
            email: data.email,
            code,
            sendType: "recovery",
          });

          e.target.reset();
        })
        .catch((error) => {
          if (error.response && error.response.data.error) {
            return setError(error.response.data.error);
          }

          setError("An unexpected error has ocurred");
          console.error(error);
        });

      setShowLoader(false);
    } else {
      setVibrateError(true);
    }
  };

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
        <Loader visible={showLoader} src={ChatBitLogo} />
        <Error
          visible={!internetConnection || errors.email || error}
          vibrate={vibrateError}
        >
          <span>
            {(!internetConnection && "Please check your internet connection") ||
              (errors.email && errors.email.message) ||
              error}
          </span>
        </Error>
        <FormContent justifyContent="justify-between">
          <FormHeader
            title="Forgot Password"
            subtitle="Enter your email to receive a one time password (OTP)"
          />
          <CartoonUserAvatar src={sadUser} />
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <FormInput title="Email">
              <input
                type="email"
                name="email"
                ref={register({
                  required: {
                    value: true,
                    message: "Enter your email address",
                  },
                  pattern: {
                    value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </FormInput>

            <FormSubmitButton title="Send" mt="10" />
          </form>
        </FormContent>
      </MainContent>
    </IonPage>
  );
}
