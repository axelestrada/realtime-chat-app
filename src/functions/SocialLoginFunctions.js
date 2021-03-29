import { Plugins } from "@capacitor/core";
import { Twitter } from "@capacitor-community/twitter";
import "@codetrix-studio/capacitor-google-auth";

import { Drivers, Storage } from "@ionic/storage"

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

/* ------ Facebook Login ------ */
export async function signInFacebook(history) {
  try {
    const FACEBOOK_PERMISSIONS = ["public_profile", "email"];
    const result = await Plugins.FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    if (result && result.accessToken) {
      await storage.remove("twitterUserName");
      await storage.remove("googleUserId");

      await storage.set("facebookToken", result.accessToken.token);
      await storage.set("facebookUserId", result.accessToken.userId);

      history.push("/home");
    }
  } catch (e) {
    console.error(e);
  }
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
