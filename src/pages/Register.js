import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import { IonIcon, IonPage } from "@ionic/react";
import { Plugins } from "@capacitor/core";

import axios from "axios";
import { useForm } from "react-hook-form";

import Error from "../components/Error";
import Loader from "../components/Loader";
import FormInput from "../components/FormInput";
import FormHeader from "../components/FormHeader";
import SocialLink from "../components/SocialLink";
import SocialLogin from "../components/SocialLogin";
import MainContent from "../components/MainContent";
import FormContent from "../components/FormContent";
import CustomCheckbox from "../components/CustomCheckbox";
import FormRouterLink from "../components/FormRouterLink";
import FormBrowserLink from "../components/FormBrowserLink";
import FormSubmitButton from "../components/FormSubmitButton";
import FormModeSeparator from "../components/FormModeSeparator";

import {
  eyeOutline,
  eyeOffOutline,
  logoTwitter,
  logoGoogle,
} from "ionicons/icons";

import {
  signInFacebook,
  signInGoogle,
  signInTwitter,
} from "../functions/SocialLoginFunctions";

import GenerateCode from "../functions/GenerateCode";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import config from "../config.json";

const { Browser, Network } = Plugins;

const initialValues = {
  name: "",
  email: "",
  password: "",
};

export default function Register() {
  const history = useHistory();

  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: initialValues,
  });

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (error !== "Enter a valid email address") {
        setError("");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error]);

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
      if (termsAccepted) {
        setShowLoader(true);

        const code = GenerateCode();
        const name = data.name.split(" ");

        await axios
          .post(`${config.SERVER_URL}/user/check-email`, {
            name: name.length >= 3 ? `${name[0]} ${name[2]}` : data.name,
            email: data.email,
            code,
          })
          .then(() => {
            history.push("/register/otp-verification", {
              userData: data,
              code,
            });

            e.target.reset();
            setTermsAccepted(false);
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
        setError("Please accept our legal agreements before continuing");
      }
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
            !internetConnection ||
            errors.name ||
            errors.email ||
            errors.password ||
            error
          }
          vibrate={vibrateError}
        >
          <span>
            {(!internetConnection && "Please check your internet connection") ||
              (errors.name && errors.name.message) ||
              (errors.email && errors.email.message) ||
              error ||
              (errors.password && errors.password.message)}
          </span>
        </Error>
        <FormContent>
          <FormHeader title="Register" subtitle="Sign up to your account" />
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <FormInput title="Full Name">
              <input
                type="text"
                name="name"
                ref={register({
                  required: {
                    value: true,
                    message: "Enter your name",
                  },
                })}
              />
            </FormInput>
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
                    message: "Enter a valid email address or phone",
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
                    message: "Enter your password",
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

            <FormBrowserLink>
              <label htmlFor="terms">
                <CustomCheckbox
                  id="terms"
                  value={termsAccepted}
                  setValue={setTermsAccepted}
                />
                I understand and agree to
                <a
                  href={config.PRIVACY_POLICY_URL}
                  className="link"
                  onClick={async (e) => {
                    e.preventDefault();

                    await Browser.open({
                      url: config.PRIVACY_POLICY_URL,
                    });
                  }}
                >
                  Privacy Policy
                </a>
                and
                <a
                  href={config.TERMS_AND_CONDITIONS_URL}
                  className="link"
                  onClick={async (e) => {
                    e.preventDefault();

                    await Browser.open({
                      url: config.TERMS_AND_CONDITIONS_URL,
                    });
                  }}
                >
                  Terms and Conditions
                </a>
              </label>
            </FormBrowserLink>
            <FormSubmitButton title="Register" />
            <FormRouterLink
              title="Already have an account?"
              linkTitle="Login"
              link="/login"
            />
          </form>
          <FormModeSeparator />
          <SocialLogin formType="Register">
            <SocialLink
              icon="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDU2LjY5MyA1Ni42OTMiIGhlaWdodD0iNTYuNjkzcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1Ni42OTMgNTYuNjkzIiB3aWR0aD0iNTYuNjkzcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik00MC40MywyMS43MzloLTcuNjQ1di01LjAxNGMwLTEuODgzLDEuMjQ4LTIuMzIyLDIuMTI3LTIuMzIyYzAuODc3LDAsNS4zOTUsMCw1LjM5NSwwVjYuMTI1bC03LjQzLTAuMDI5ICBjLTguMjQ4LDAtMTAuMTI1LDYuMTc0LTEwLjEyNSwxMC4xMjV2NS41MThoLTQuNzd2OC41M2g0Ljc3YzAsMTAuOTQ3LDAsMjQuMTM3LDAsMjQuMTM3aDEwLjAzM2MwLDAsMC0xMy4zMiwwLTI0LjEzN2g2Ljc3ICBMNDAuNDMsMjEuNzM5eiIvPjwvc3ZnPg=="
              iconColor="#4267B2"
              onClick={async () => {
                const connection = await Network.getStatus();
                setInternetConnection(connection.connected);

                if (connection.connected) {
                  signInFacebook(history, setError, setShowLoader);
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
                  signInTwitter(history, setError, setShowLoader);
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
                  signInGoogle(history, setError, setShowLoader);
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
