import { Plugins } from "@capacitor/core";
import { Twitter } from "@capacitor-community/twitter";
import "@codetrix-studio/capacitor-google-auth";

import axios from "axios";

import { Drivers, Storage } from "@ionic/storage";

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

/* ------ Facebook Login ------ */
export async function signInFacebook(history, setError, setShowLoader) {
  setShowLoader(true)

  let facebookUserData = {
    socialAccount: "facebook",
    socialAccountId: "",
    name: "",
    email: "",
    picture: "",
  };

  try {
    const FACEBOOK_PERMISSIONS = ["public_profile", "email"];
    const result = await Plugins.FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    if (result && result.accessToken) {
      facebookUserData.socialAccountId = result.accessToken.userId;

      await fetch(
        `https://graph.facebook.com/v10.0/${result.accessToken.userId}?fields=name,email&access_token=${result.accessToken.token}`
      )
        .then(async (res) => await res.json())
        .then((response) => {
          facebookUserData.name = response.name;
          facebookUserData.email = response.email;
        })
        .catch((e) => {
          console.error(e);
          alert(e);
        });

      await fetch(
        `https://graph.facebook.com/v10.0/${result.accessToken.userId}/picture?type=large&access_token=${result.accessToken.token}`
      )
        .then((res) => {
          facebookUserData.picture = res.url;
        })
        .catch((e) => {
          console.error(e);
          alert(e);
        });

      axios
        .post(
          "https://realtime-chat-siwi.herokuapp.com/user/social-register",
          facebookUserData
        )
        .then((res) => {
          const { data } = res;
          if (data.error) {
            if (
              data.error.path[0] === "email" &&
              data.error.type === "string.empty"
            ) {
              setError("This account has no email address");
            }
          } else {
            if (data) {
              history.push("/home");
            } else {
              setError("An unexpected error has ocurred");
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  } catch (e) {
    console.error(e);
  }

  setShowLoader(false);
}

/* ------ Twitter Login ------ */
const twitter = new Twitter();

export async function signInTwitter(history) {
  twitter
    .login()
    .then(async (result) => {
      if (result.userName) {
        await storage.remove("googleUserId");
        await storage.remove("facebookToken");
        await storage.remove("facebookUserId");

        await storage.set("twitterUserName", result.userName);
        history.push("/home");
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

/* ------ Google Login ------ */
export async function signInGoogle(history) {
  try {
    const result = await Plugins.GoogleAuth.signIn();

    if (result && result.id) {
      await storage.remove("twitterUserName");
      await storage.remove("facebookToken");
      await storage.remove("facebookUserId");

      await storage.set("googleUserId", result.id);
      history.push("/home");
    }
  } catch (e) {
    console.error("error", e);
  }
}
