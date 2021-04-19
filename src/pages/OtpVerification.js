import { useState } from "react";
import { IonPage } from "@ionic/react";

import MainContent from "../components/MainContent";
import Loader from "../components/Loader";
import Error from "../components/Error";
import FormContent from "../components/FormContent";
import FormHeader from "../components/FormHeader";
import CartoonUserAvatar from "../components/CartoonUserAvatar";

import happyUser from "../assets/images/happyUser.png";
import OTPInput from "../components/OTPInput";
import FormSubmitButton from "../components/FormSubmitButton";

export default function OtpVerification() {
  const [showLoader, setShowLoader] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);

  return (
    <IonPage>
      <MainContent>
        <Loader visible={showLoader} />
        <Error visible={verificationError}>
          <span>{verificationError}</span>
        </Error>
        <FormContent>
          <FormHeader
            title="OTP Verification"
            subtitle="Enter the OTP just sent to your email"
          />
          <CartoonUserAvatar src={happyUser} />
          <form>
            <OTPInput value={otpCode} setValue={setOtpCode} />
            <div className="resend-otp-link text-center text-base my-4">
              <p>
                Didn't receive a OTP?
                <button
                  type="button"
                  onClick={() => {
                    console.log("reenviar");
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
