import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router";
import { IonPage } from "@ionic/react";
import { Plugins } from "@capacitor/core";

import CheckEmail from "../functions/CheckEmail";

import ChatBitLogo from "../assets/images/chatbitLogoIcon.jpg";

import MainContent from "../components/MainContent";
import Error from "../components/Error";
import FormContent from "../components/FormContent";
import FormHeader from "../components/FormHeader";
import CartoonUserAvatar from "../components/CartoonUserAvatar";
import FormSubmitButton from "../components/FormSubmitButton";
import Loader from "../components/Loader";
import SuccessDialog from "../components/SuccessDialog";

import happyUser from "../assets/images/happyUser.png";
import axios from "axios";

import { Drivers, Storage } from "@ionic/storage";
import CheckPhone from "../functions/CheckPhone";

const { Network } = Plugins;

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

export default function OtpVerification() {
  const history = useHistory();
  const location = useLocation();

  const [showLoader, setShowLoader] = useState(false);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [vibrateError, setVibrateError] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);
  const [verificationError, setVerificationError] = useState("");
  const [otpCode, setOtpCode] = useState("");

  Network.addListener("networkStatusChange", (status) => {
    setInternetConnection(status.connected);
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVerificationError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [verificationError]);

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
              .post("http://192.168.0.106:3300/user/add-phone", {
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
                  return setVerificationError(error.response.data.error);
                }

                setVerificationError("An unexpected error has ocurred");
                console.error(error);
              });
          } else {
            await axios
              .post("http://192.168.0.106:3300/user/register", userData)
              .then(async (res) => {
                history.replace("/register/otp-verification", {});
                history.push("/register/select-image", {
                  userId: res.data.id,
                });

                await storage.set("token", res.data.token);
                setOtpCode("");
              })
              .catch((error) => {
                  if (error.response && error.response.data.error) {
                    return setVerificationError(error.response.data.error);
                  }

                  setVerificationError("An unexpected error has ocurred");
                  console.error(error);
              });
          }
        } else {
          setVerificationError("The verification code is incorrect");
        }

        setShowLoader(false);
      } else {
        setVerificationError("An unexpected error has ocurred");
      }
    } else {
      setVibrateError(true);
    }
  };

  const resendEmail = async () => {
    const { code } = location.state;
    const { name, email } = location.state.userData;

    if (
      await CheckEmail(
        { name: name, email, code },
        setShowLoader,
        setVerificationError
      )
    ) {
      setSuccessDialogVisible(true);
    }
  };

  const resendSms = async () => {
    await CheckPhone(location.state.to, setShowLoader, setVerificationError);
  };

  return (
    <IonPage>
      <MainContent>
        <SuccessDialog
          visible={successDialogVisible}
          setVisible={setSuccessDialogVisible}
          title="Email forwarded!"
          subtitle="Please check your spam folder to make sure it's not in there."
          buttonTitle="Ok, Continue"
        />
        <Loader visible={showLoader} src={ChatBitLogo} />
        <Error
          visible={!internetConnection || verificationError}
          vibrate={vibrateError}
        >
          {!internetConnection && (
            <span>Please check your internet connection</span>
          )}
          {internetConnection && <span>{verificationError}</span>}
        </Error>
        <FormContent justifyContent="justify-between">
          <FormHeader
            title="Verification Code"
            subtitle={`Please type the verification code sent to ${
              location.state && location.state.sendType === "sms" ? "your phone number" : "your email"
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
                        } else {
                          if (location.state.userData) {
                            resendEmail();
                          } else {
                            setVerificationError(
                              "An unexpected error has ocurred"
                            );
                          }
                        }
                      } else {
                        setVerificationError("An unexpected error has ocurred");
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
