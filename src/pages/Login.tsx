import { useState, useEffect } from "react";
import { useHistory } from "react-router";

import { Plugins, Capacitor } from "@capacitor/core";

import { useForm } from "react-hook-form";

import { io } from "socket.io-client";
import axios from "axios";

import { IonContent, IonIcon, IonPage } from "@ionic/react";

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

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

const initialValues = {
  email: "",
  password: "",
};

const socket = io("http://localhost:3300", { autoConnect: false });

export default function Login() {
  const history = useHistory();

  useEffect(() => {
    if (Capacitor.isNative) {
      Plugins.App.addListener("backButton", () => {
        if (window.location.pathname === "/login") {
          Plugins.App.exitApp();
        } else if (window.location.pathname === "/register") {
          history.push("/login");
        } else if (window.location.pathname === "/register/confirm-email") {
          history.push("/register");
        } else if (window.location.pathname === "/register/select-image") {
          history.push("/register/confirm-email");
        }
      });
    }
  }, []); // eslint-disable-line

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    socket.on("login", (user) => {
      if (!user.error) {
        console.log(user);
        history.push("/home");
      } else {
        setLoginError(user.error);
      }
    });

    socket.connect();
  }, []); //eslint-disable-line

  const { register, handleSubmit, errors } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = (data, e) => {
    axios
      .get("http://localhost:3300/user/login", {
        params: {
          email: data.email,
          password: data.password,
        },
      })
      .then(async (res) => {
        if(res.data.error){
          setLoginError(res.data.error);
        }else{
          await storage.set("userId", res.data._id);
          e.target.reset();
          history.push("/home", res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <MainContent>
          <Error
            visible={
              errors.email || errors.password || loginError ? true : false
            }
          >
            {errors.email && <span>{errors.email.message}</span>}
            {!errors.email && loginError && <span>{loginError}</span>}
            {!errors.email && !loginError && errors.password && (
              <span>{errors.password.message}</span>
            )}
          </Error>
          <div className="w-full max-w-sm p-11">
            <FormHeader title="Login" subtitle="Sign in to your account" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput title="Email or Phone">
                <input
                  autoComplete="off"
                  type="text"
                  name="email"
                  ref={register({
                    required: {
                      value: true,
                      message: "Email or Phone is required",
                    },
                    validate: (value) => {
                      if (
                        !/^(\+\d{3})?([ ])?([3|8|9])\d{3}-?\d{4}$/.test(
                          value
                        ) &&
                        !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
                          value
                        )
                      ) {
                        setLoginError("Insert a valid Email or Phone");
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
                  autoComplete="off"
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
                onClick={() => signInFacebook(history)}
              />
              <SocialLink
                icon={logoTwitter}
                iconColor="#22A2ED"
                onClick={() => signInTwitter(history)}
              />
              <SocialLink
                icon={logoGoogle}
                iconColor="#E54E64"
                onClick={() => signInGoogle(history)}
              />
            </SocialLogin>
          </div>
        </MainContent>
      </IonContent>
    </IonPage>
  );
}
