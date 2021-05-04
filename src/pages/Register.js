import { useState, useEffect } from "react";
import { useHistory } from "react-router";

import { useForm } from "react-hook-form";

import {
  signInFacebook,
  signInGoogle,
  signInTwitter,
} from "../functions/SocialLoginFunctions";

import { IonIcon, IonPage } from "@ionic/react";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import MainContent from "../components/MainContent";
import Loader from "../components/Loader";
import Error from "../components/Error";
import FormContent from "../components/FormContent";
import FormHeader from "../components/FormHeader";
import FormInput from "../components/FormInput";
import FormBrowserLink from "../components/FormBrowserLink";
import FormSubmitButton from "../components/FormSubmitButton";
import FormRouterLink from "../components/FormRouterLink";
import FormModeSeparator from "../components/FormModeSeparator";
import SocialLogin from "../components/SocialLogin";
import SocialLink from "../components/SocialLink";
import CustomCheckbox from "../components/CustomCheckbox";

import {
  eyeOutline,
  eyeOffOutline,
  logoTwitter,
  logoGoogle,
} from "ionicons/icons";

import { Plugins } from "@capacitor/core";
import CheckEmail from "../functions/CheckEmail";

const { Browser, Network } = Plugins;

const initialValues = {
  name: "",
  email: "",
  password: "",
};

export default function Register() {
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);
  const [registerError, setRegisterError] = useState("");
  const [vibrateError, setVibrateError] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: initialValues,
  });

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (registerError !== "Insert a valid Email") {
        setRegisterError("");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [registerError]);

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
        const characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let code = "";

        while (code.length <= 4) {
          code += characters[Math.floor(Math.random() * 10)];
        }

        const name = data.name.split(" ");

        if (
          await CheckEmail(
            {
              name: name.length >= 3 ? `${name[0]} ${name[2]}` : data.name,
              email: data.email,
              code,
            },
            setShowLoader,
            setRegisterError
          )
        ) {
          history.push("/register/otp-verification", {
            userData: data,
            code,
          });

          e.target.reset();
          setTermsAccepted(false);
        }
      } else {
        setRegisterError(
          "Please accept our legal agreements before continuing"
        );
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
            registerError
          }
          vibrate={vibrateError}
        >
          {!internetConnection && (
            <span>Please check your internet connection</span>
          )}
          {internetConnection && errors.name && errors.name.message}
          {internetConnection && !errors.name && errors.email && (
            <span>{errors.email.message}</span>
          )}
          {internetConnection &&
            !errors.name &&
            !errors.email &&
            registerError && <span>{registerError}</span>}
          {internetConnection &&
            !errors.name &&
            !errors.email &&
            !registerError &&
            errors.password && <span>{errors.password.message}</span>}
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
                    message: "Name is required",
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
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                    message: "Insert a valid email",
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

            <FormBrowserLink>
              <label htmlFor="terms">
                <CustomCheckbox
                  id="terms"
                  value={termsAccepted}
                  setValue={setTermsAccepted}
                />
                I understand and agree to
                <a
                  href="https://axelestrada.github.io/privacy-policy.html"
                  className="link"
                  onClick={async (e) => {
                    e.preventDefault();

                    await Browser.open({
                      url: "https://axelestrada.github.io/privacy-policy.html",
                    });
                  }}
                >
                  Privacy Policy
                </a>
                and
                <a
                  href="https://axelestrada.github.io/terms-and-conditions.html"
                  className="link"
                  onClick={async (e) => {
                    e.preventDefault();

                    await Browser.open({
                      url:
                        "https://axelestrada.github.io/terms-and-conditions.html",
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
                  signInFacebook(history, setRegisterError, setShowLoader);
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
                  signInTwitter(history, setRegisterError, setShowLoader);
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
                  signInGoogle(history, setRegisterError, setShowLoader);
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
