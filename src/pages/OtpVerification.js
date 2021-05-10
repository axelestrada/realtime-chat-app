import { IonPage } from "@ionic/react";
import { Plugins } from "@capacitor/core";
import { useState, useEffect } from "react";
import { Drivers, Storage } from "@ionic/storage";
import { useLocation, useHistory } from "react-router";

import axios from "axios";

import Error from "../components/Error";
import Loader from "../components/Loader";
import FormHeader from "../components/FormHeader";
import MainContent from "../components/MainContent";
import FormContent from "../components/FormContent";
import ErrorDialog from "../components/ErrorDialog";
import SuccessDialog from "../components/SuccessDialog";
import FormSubmitButton from "../components/FormSubmitButton";
import CartoonUserAvatar from "../components/CartoonUserAvatar";

import happyUser from "../assets/images/happyUser.png";
import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import config from "../config.json";

const { Network } = Plugins;

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

export default function OtpVerification() {
  const history = useHistory();
  const location = useLocation();

  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errorDialog, setErrorDialog] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

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

  const onSubmit = async (e) => {
    e.preventDefault();

    const connection = await Network.getStatus();
    setInternetConnection(connection.connected);

    if (connection.connected) {
      if (location.state) {
        setShowLoader(true);

        const { code, userData, userId, phone, phoneIntl } = location.state;

        if (otpCode === code) {
          if (location.state.sendType === "sms") {
            await axios
              .post(`${config.SERVER_URL}/user/add-phone`, {
                id: userId,
                phone,
                phoneIntl,
              })
              .then(async () => {
                history.replace("/register/otp-verification", {});
                history.push("/home");

                setOtpCode("");
              })
              .catch((error) => {
                if (error.response && error.response.data.error) {
                  return setError(error.response.data.error);
                }

                setError("An unexpected error has ocurred");
                console.error(error);
              });
          } else if (location.state.sendType === "recovery") {
            history.replace("/register/otp-verification", {});
            history.push("/reset-password", {
              email: location.state && location.state.email,
            });

            setOtpCode("");
          } else {
            await axios
              .post(`${config.SERVER_URL}/user/register`, userData)
              .then(async (res) => {
                history.replace("/register/otp-verification", {});
                history.push("/register/select-image", {
                  userId: res.data.id,
                });

                await storage.set("token", res.data.token);
                await storage.set("userId", res.data.id);
                setOtpCode("");
              })
              .catch((error) => {
                if (error.response && error.response.data.error) {
                  return setError(error.response.data.error);
                }

                setError("An unexpected error has ocurred");
                console.error(error);
              });
          }
        } else {
          setError("The verification code is incorrect");
        }

        setShowLoader(false);
      } else {
        setError("An unexpected error has ocurred");
      }
    } else {
      setVibrateError(true);
    }
  };

  const resendEmail = async () => {
    setShowLoader(true);

    const { code } = location.state;
    const { name, email } = location.state.userData;

    await axios
      .post(`${config.SERVER_URL}/user/check-email`, {
        name,
        email,
        code,
      })
      .then(() => {
        setSuccessDialog(true);
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          return setError(error.response.data.error);
        }

        setErrorDialog("email");
        console.error(error);
      });

    setShowLoader(false);
  };

  const resendSms = async () => {
    setShowLoader(true);

    await axios
      .post(`${config.SERVER_URL}/user/send-sms`, {
        code: location.state && location.state.code,
        to: location.state && location.state.to,
      })
      .then(() => {})
      .catch((error) => {
        if (error.response && error.response.data.error) {
          return setError(error.response.data.error);
        }

        setErrorDialog("sms");
        console.error(error);
      });

    setShowLoader(false);
  };

  const resendVerifyEmail = async () => {
    setShowLoader(true);

    await axios
      .post(`${config.SERVER_URL}/user/send-recovery-email`, {
        email: location.state && location.state.email,
        code: location.state && location.state.code,
      })
      .then(() => {
        setSuccessDialog(true);
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          return setError(error.response.data.error);
        }

        setErrorDialog("verify-email");
        console.error(error);
      });

    setShowLoader(false);
  };

  return (
    <IonPage>
      <MainContent>
        <SuccessDialog
          visible={successDialog}
          setVisible={setSuccessDialog}
          title="Email forwarded!"
          subtitle="Please check your spam folder to make sure it's not in there."
          buttonTitle="Ok, Continue"
        />
        <ErrorDialog
          visible={errorDialog}
          setVisible={setErrorDialog}
          title="Error!"
          subtitle="Something went wrong!"
          buttonTitle="Try Again"
          onClick={() => {
            setErrorDialog("");

            switch (errorDialog) {
              case "email":
                resendEmail();
                break;
              case "verify-email":
                resendVerifyEmail();
                break;
              case "sms":
                resendSms();
                break;
              default:
                break;
            }
          }}
        />
        <Loader visible={showLoader} src={ChatBitLogo} />
        <Error visible={!internetConnection || error} vibrate={vibrateError}>
          <span>
            {(!internetConnection && "Please check your internet connection") ||
              error}
          </span>
        </Error>
        <FormContent justifyContent="justify-between">
          <FormHeader
            title="Verification Code"
            subtitle={`Please type the verification code sent to ${
              location.state && location.state.sendType === "sms"
                ? "your phone number"
                : "your email"
            }`}
          />
          <CartoonUserAvatar src={happyUser} />
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex flex-col items-center"
          >
            <input
              className="code-input border-none outline-none w-2/3 text-center bg-transparent tracking-widest"
              type="number"
              value={otpCode}
              onChange={(e) => {
                e.target.value = e.target.value.toString().slice(0, 5);

                setOtpCode(e.target.value);
              }}
            />
            <div className="resend-otp-link text-center text-base my-4">
              <p>
                Didn't receive the code?
                <button
                  type="button"
                  onClick={async () => {
                    const connection = await Network.getStatus();
                    setInternetConnection(connection.connected);

                    if (connection.connected) {
                      if (location.state) {
                        if (location.state.sendType === "sms") {
                          resendSms();
                        } else if (location.state.sendType === "recovery") {
                          resendVerifyEmail();
                        } else {
                          if (location.state.userData) {
                            resendEmail();
                          } else {
                            setError("An unexpected error has ocurred");
                          }
                        }
                      } else {
                        setError("An unexpected error has ocurred");
                      }
                    } else {
                      setVibrateError(true);
                    }
                  }}
                >
                  Resend
                </button>
              </p>
            </div>
            <FormSubmitButton title="Verify" />
          </form>
        </FormContent>
      </MainContent>
    </IonPage>
  );
}
