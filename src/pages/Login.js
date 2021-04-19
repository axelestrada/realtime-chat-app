import { useState, useEffect } from "react";
import { useHistory } from "react-router";

import { Plugins, Capacitor } from "@capacitor/core";
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

  useEffect(() => {
    if (Capacitor.isNative) {
      Plugins.App.addListener("backButton", () => {
        if (window.location.pathname === "/login") {
          Plugins.App.exitApp();
        } else if (window.location.pathname === "/register") {
          history.push("/login");
        } else if (window.location.pathname === "/register/otp-verification") {
          history.push("/register");
        } else if (window.location.pathname === "/register/select-image") {
          history.push("/register/confirm-email");
        }
      });
    }
  }, []); // eslint-disable-line

  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loginError, setLoginError] = useState("");

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

  const onSubmit = (data, e) => {
    setShowLoader(true);

    axios
      .get("https://realtime-chat-siwi.herokuapp.com/user/login", {
        params: {
          email: data.email,
          password: data.password,
        },
      })
      .then(async (res) => {
        if (res.data.error) {
          setLoginError(res.data.error);
        } else {
          history.push("/home", res.data);
          await storage.set("userId", res.data._id);
          e.target.reset();
        }

        setShowLoader(false);
      })
      .catch((e) => {
        console.error(e);
        setLoginError(e);

        setShowLoader(false);
      });
  };

  return (
    <IonPage>
      <MainContent>
        <Loader visible={showLoader} />
        <Error visible={errors.email || errors.password || loginError}>
          {errors.email && <span>{errors.email.message}</span>}
          {!errors.email && loginError && <span>{loginError}</span>}
          {!errors.email && !loginError && errors.password && (
            <span>{errors.password.message}</span>
          )}
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
                    } else if (trimValue.split("")[0] === "+") {
                      setLoginError(
                        "Insert a phone number without country code"
                      );
                    } else {
                      setLoginError("");
                    }

                    return true;
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
              onClick={() =>
                signInFacebook(history, setLoginError, setShowLoader)
              }
            />
            <SocialLink
              icon={logoTwitter}
              iconColor="#22A2ED"
              onClick={() =>
                signInTwitter(history, setLoginError, setShowLoader)
              }
            />
            <SocialLink
              icon={logoGoogle}
              iconColor="#E54E64"
              onClick={() =>
                signInGoogle(history, setLoginError, setShowLoader)
              }
            />
          </SocialLogin>
        </FormContent>
      </MainContent>
    </IonPage>
  );
}