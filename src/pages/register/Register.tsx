/* ------ React ------ */
import { useState, useEffect } from "react";
import { useHistory } from "react-router";

/* ------ React Hook Form ------ */
import { useForm } from "react-hook-form";

/* ------ Social Login ------ */
import { signInFacebook, signInGoogle, signInTwitter } from "../../functions/SocialLoginFunctions";

/* ------ Storage ------ */
import { Drivers, Storage } from "@ionic/storage";

/* ------ Socket.IO ------ */
import { io } from "socket.io-client";

/* ------ Ionic Components ------ */
import { IonContent, IonIcon, IonPage, IonRouterLink } from "@ionic/react";

/* ------ Styles ------ */
import "../../styles/css/min/Login.min.css";

/* ------ Icons ------ */
import {
  eyeOutline,
  eyeOffOutline,
  logoTwitter,
  logoGoogle,
} from "ionicons/icons";

import { Twitter } from "@capacitor-community/twitter";

/* ------ Open In Browser ------ */
import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;

/* ------ Initialize Twitter ------ */
const twitter: Twitter = new Twitter();

/* ------ Set The Default Values For The Controls ------ */
const initialValues = {
  name: "",
  email: "",
  password: "",
};

/* ------ Initialize Socket ------ */
const socket = io("http://localhost:3300", { autoConnect: false });

/* ------ Initialize Storage ------ */
const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

const Register: React.FC = () => {
  /* ------ Initialize History ------ */
  const history = useHistory();

  /* ------ States ------ */
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  /* ------ Controls For The Form ------ */
  const { register, handleSubmit, errors } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = (data) => {
    history.push("/register/confirm-email", data);
  };

  /* ------ Listen Socket ------ */
  useEffect(() => {
    socket.on("user", (user) => {
      console.log(user);
    });

    socket.connect();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="body">
          <div
            className={
              errors.name || errors.email || errors.password || emailError
                ? "errors visible"
                : "errors"
            }
          >
            {errors.name && errors.name.message}
            {!errors.name && errors.email && (
              <span>{errors.email.message}</span>
            )}
            {!errors.name && !errors.email && emailError && (
              <span>{emailError}</span>
            )}
            {!errors.email && !emailError && errors.password && (
              <span>{errors.password.message}</span>
            )}
          </div>
          <div className="main">
            <div className="title">
              <h1>Register</h1>
              <h2>Sign up to your account</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="off"
                  ref={register({
                    required: {
                      value: true,
                      message: "Name is required",
                    },
                  })}
                />
              </div>
              <div className="input-field">
                <label htmlFor="email">Email or Phone</label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  autoComplete="off"
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
                        setEmailError("Insert a valid Email or Phone");
                      } else {
                        setEmailError("");
                      }

                      return true;
                    },
                  })}
                />
              </div>
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  ref={register({
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="password-eye"
                >
                  <IonIcon src={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
              <div className="browser-link">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">
                  <label htmlFor="terms" className="custom-checkbox"></label>I
                  have read and accepted the
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
              </div>
              <button type="submit" className="submit-button register">
                Continue
              </button>
              <div className="router-link">
                <p>Already have an account?</p>
                <IonRouterLink routerLink="/login" className="link">
                  Login
                </IonRouterLink>
              </div>
            </form>
            <div className="or-separator">OR</div>
            <div className="social-login">
              <p>Register with social network</p>
              <button
                className="social-link"
                type="button"
                onClick={() => signInFacebook(history)}
              >
                <IonIcon
                  style={{ color: "#4267B2" }}
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDU2LjY5MyA1Ni42OTMiIGhlaWdodD0iNTYuNjkzcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1Ni42OTMgNTYuNjkzIiB3aWR0aD0iNTYuNjkzcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik00MC40MywyMS43MzloLTcuNjQ1di01LjAxNGMwLTEuODgzLDEuMjQ4LTIuMzIyLDIuMTI3LTIuMzIyYzAuODc3LDAsNS4zOTUsMCw1LjM5NSwwVjYuMTI1bC03LjQzLTAuMDI5ICBjLTguMjQ4LDAtMTAuMTI1LDYuMTc0LTEwLjEyNSwxMC4xMjV2NS41MThoLTQuNzd2OC41M2g0Ljc3YzAsMTAuOTQ3LDAsMjQuMTM3LDAsMjQuMTM3aDEwLjAzM2MwLDAsMC0xMy4zMiwwLTI0LjEzN2g2Ljc3ICBMNDAuNDMsMjEuNzM5eiIvPjwvc3ZnPg=="
                />
              </button>
              <button
                className="social-link"
                type="button"
                onClick={() => signInTwitter(history)}
              >
                <IonIcon style={{ color: "#22A2ED" }} src={logoTwitter} />
              </button>
              <button
                className="social-link"
                type="button"
                onClick={() => signInGoogle(history)}
              >
                <IonIcon style={{ color: "#E54E64" }} src={logoGoogle} />
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
