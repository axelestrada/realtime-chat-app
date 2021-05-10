import { Plugins } from "@capacitor/core";
import "@codetrix-studio/capacitor-google-auth";
import { Drivers, Storage } from "@ionic/storage";
import { Twitter } from "@capacitor-community/twitter";

import axios from "axios";
import config from "../config.json";

const storage = new Storage({
  name: "__localDb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

storage.create();

/* ------ Facebook Login ------ */
export async function signInFacebook(history, setError, setShowLoader) {
  try {
    setShowLoader(true);

    const FACEBOOK_PERMISSIONS = ["public_profile", "email"];
    const result = await Plugins.FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    if (result && result.accessToken) {
      await axios
        .get(
          `https://graph.facebook.com/v10.0/${result.accessToken.userId}?fields=name,email,picture.type(large)&access_token=${result.accessToken.token}`
        )
        .then(async (res) => {
          const { name, email, picture } = res.data;

          const user = {
            name,
            email,
            picture: picture.data.url,
          };

          await axios
            .post(`${config.SERVER_URL}/user/social-register`, user)
            .then(async (res) => {
              const { token, id, phone } = res.data;
              if (phone) {
                history.push("/home");
              } else {
                history.push("/register/add-phone", { userId: id });
              }

              await storage.set("token", token);
            })
            .catch((error) => {
             if (error.response && error.response.data.error) {
               return setError(error.response.data.error);
             }

             setError("An unexpected error has ocurred");
             console.error(error);
            });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  } catch (err) {
    console.error(err);
  }

  setShowLoader(false);
}

/* ------ Twitter Login ------ */
const twitter = new Twitter();

export async function signInTwitter(history, setError, setShowLoader) {
  await twitter
    .login()
    .then(async (result) => {
      setShowLoader(true);

      if (result.authToken && result.authTokenSecret) {
        await axios
          .get(`${config.SERVER_URL}/user/twitter-data`, {
            params: {
              oauthToken: result.authToken,
              oauthTokenSecret: result.authTokenSecret,
            },
          })
          .then(async (res) => {
            const { name, email, profile_image_url_https } = res.data;
            const picture = profile_image_url_https.replace(
              "_normal",
              "_bigger"
            );

            const user = {
              name,
              email,
              picture,
            };

            await axios
              .post(`${config.SERVER_URL}/user/social-register`, user)
              .then(async (res) => {
                const { token, id, phone } = res.data;
                if (phone) {
                  history.push("/home");
                } else {
                  history.push("/register/add-phone", { userId: id });
                }

                await storage.set("token", token);
              })
              .catch((error) => {
                if (error.response && error.response.data.error) {
                  return setError(error.response.data.error);
                }

                setError("An unexpected error has ocurred");
                console.error(error);
              });
          })
          .catch((e) => {
            console.error(e);
          });
      }
    })
    .catch((e) => {
      console.error(e);
    });

  setShowLoader(false);
}

/* ------ Google Login ------ */
export async function signInGoogle(history, setError, setShowLoader) {
  try {
    const result = await Plugins.GoogleAuth.signIn();
    setShowLoader(true);

    if (result && result.id) {
      const { email, imageUrl } = result;
      const user = {
        name: result.name || result.displayName,
        email,
        picture: imageUrl,
      };

      await axios
        .post(`${config.SERVER_URL}/user/social-register`, user)
        .then(async (res) => {
          const { token, id, phone } = res.data;
          if (phone) {
            history.push("/home");
          } else {
            history.push("/register/add-phone", { userId: id });
          }

          await storage.set("token", token);
        })
        .catch((error) => {
         if (error.response && error.response.data.error) {
           return setError(error.response.data.error);
         }

         setError("An unexpected error has ocurred");
         console.error(error);
        });
    }
  } catch (e) {
    console.error(e);
  }

  setShowLoader(false);
}
