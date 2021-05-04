import { useState, useEffect } from "react";
import { useHistory } from "react-router";

import { Plugins } from "@capacitor/core";

import { useForm } from "react-hook-form";

import axios from "axios";

import { IonIcon, IonPage } from "@ionic/react";

import {
  signInFacebook,
  signInTwitter,
  signInGoogle,
} from "../functions/SocialLoginFunctions";

import {
  eyeOutline,
  eyeOffOutline,
  logoTwitter,
  logoGoogle,
} from "ionicons/icons";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import FormHeader from "../components/FormHeader";
import Error from "../components/Error";
import FormInput from "../components/FormInput";
import FormRouterLink from "../components/FormRouterLink";
import FormSubmitButton from "../components/FormSubmitButton";
import FormModeSeparator from "../components/FormModeSeparator";
import MainContent from "../components/MainContent";
import SocialLogin from "../components/SocialLogin";
import SocialLink from "../components/SocialLink";

import { Drivers, Storage } from "@ionic/storage";
import FormContent from "../components/FormContent";
import Loader from "../components/Loader";

const { Network } = Plugins;

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);
  const [vibrateError, setVibrateError] = useState(false);
  const [loginError, setLoginError] = useState("");

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  const { register, handleSubmit, errors } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loginError !== "Insert a valid Email or Phone") {
        setLoginError("");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loginError]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVibrateError(false);
    }, 350);

    return () => clearTimeout(timeout);
  }, [vibrateError]);

  const onSubmit = async (data, e) => {
    const connection = await Network.getStatus();
    setInternetConnection(connection.connected);

    if (connection.connected) {
      const { email, password } = data;

      setShowLoader(true);

      await axios
        .post("http://192.168.0.106:3300/user/login", {
          email,
          password,
        })
        .then(async (res) => {
          history.push("/home");

          await storage.set("token", res.data.token);
          await storage.set("userId", res.data.userId);
          e.target.reset();
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data.error) {
              return setLoginError(error.response.data.error);
            }
          }

          setLoginError("An unexpected error has ocurred");
          console.error(error);
        });

      setShowLoader(false);
    } else {
      setVibrateError(true);
    }
  };

  return (
    <IonPage>
      <MainContent>
        <Loader visible={showLoader} src={ChatBitLogo} />
        <Error
          visible={
            !internetConnection || errors.email || errors.password || loginError
          }
          vibrate={vibrateError}
        >
          {!internetConnection && (
            <span>Please check your internet connection</span>
          )}
          {internetConnection && errors.email && (
            <span>{errors.email.message}</span>
          )}
          {internetConnection && !errors.email && loginError && (
            <span>{loginError}</span>
          )}
          {internetConnection &&
            !errors.email &&
            !loginError &&
            errors.password && <span>{errors.password.message}</span>}
        </Error>
        <FormContent>
          <FormHeader title="Login" subtitle="Sign in to your account" />
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <FormInput title="Email or Phone">
              <input
                type="text"
                name="email"
                ref={register({
                  required: {
                    value: true,
                    message: "Email or Phone is required",
                  },
                  validate: (value) => {
                    const trimValue = value
                      .replace(/\s+/g, "")
                      .replace(/[-]+/g, "");

                    if (
                      isNaN(trimValue) &&
                      !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
                        value
                      )
                    ) {
                      setLoginError("Insert a valid Email or Phone");
                    } else if (trimValue.length < 7) {
                      setLoginError("Insert a valid Email or Phone");
                    } else {
                      setLoginError("");
                      return true;
                    }
                  },
                })}
              />
            </FormInput>
            <FormInput title="Password">
              <input
                className="pr-4"
                type={showPassword ? "text" : "password"}
                name="password"
                ref={register({
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "The password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                <IonIcon src={showPassword ? eyeOffOutline : eyeOutline} />
              </button>
            </FormInput>
            <FormRouterLink
              title="Forgot password?"
              link="/forgot-password"
              linkTitle="Click here"
            />
            <FormSubmitButton title="Login" />
            <FormRouterLink
              title="Don`t have an account?"
              link="/register"
              linkTitle="Register"
            />
          </form>
          <FormModeSeparator />
          <SocialLogin formType="Login">
            <SocialLink
              icon="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDU2LjY5MyA1Ni42OTMiIGhlaWdodD0iNTYuNjkzcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1Ni42OTMgNTYuNjkzIiB3aWR0aD0iNTYuNjkzcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik00MC40MywyMS43MzloLTcuNjQ1di01LjAxNGMwLTEuODgzLDEuMjQ4LTIuMzIyLDIuMTI3LTIuMzIyYzAuODc3LDAsNS4zOTUsMCw1LjM5NSwwVjYuMTI1bC03LjQzLTAuMDI5ICBjLTguMjQ4LDAtMTAuMTI1LDYuMTc0LTEwLjEyNSwxMC4xMjV2NS41MThoLTQuNzd2OC41M2g0Ljc3YzAsMTAuOTQ3LDAsMjQuMTM3LDAsMjQuMTM3aDEwLjAzM2MwLDAsMC0xMy4zMiwwLTI0LjEzN2g2Ljc3ICBMNDAuNDMsMjEuNzM5eiIvPjwvc3ZnPg=="
              iconColor="#4267B2"
              onClick={async () => {
                const connection = await Network.getStatus();
                setInternetConnection(connection.connected);

                if (connection.connected) {
                  signInFacebook(history, setLoginError, setShowLoader);
                } else {
                  setVibrateError(true);
                }
              }}
            />
            <SocialLink
              icon={logoTwitter}
              iconColor="#22A2ED"
              onClick={async () => {
                const connection = await Network.getStatus();
                setInternetConnection(connection.connected);

                if (connection.connected) {
                  signInTwitter(history, setLoginError, setShowLoader);
                } else {
                  setVibrateError(true);
                }
              }}
            />
            <SocialLink
              icon={logoGoogle}
              iconColor="#E54E64"
              onClick={async () => {
                const connection = await Network.getStatus();
                setInternetConnection(connection.connected);

                if (connection.connected) {
                  signInGoogle(history, setLoginError, setShowLoader);
                } else {
                  setVibrateError(true);
                }
              }}
            />
          </SocialLogin>
        </FormContent>
      </MainContent>
    </IonPage>
  );
}
