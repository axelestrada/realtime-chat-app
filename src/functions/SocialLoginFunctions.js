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
  let user = {};

  try {
    const FACEBOOK_PERMISSIONS = ["public_profile", "email"];
    const result = await Plugins.FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    setShowLoader(true);

    if (result && result.accessToken) {
      await axios
        .get(
          `https://graph.facebook.com/v10.0/${result.accessToken.userId}?fields=name,email&access_token=${result.accessToken.token}`
        )
        .then(async (res) => {
          const data = await res.json();
          const { name, email } = data;

          user = {
            name,
            email,
          };
        })
        .catch((e) => {
          console.error(e);
        });

      await axios
        .get(
          `https://graph.facebook.com/v10.0/${result.accessToken.userId}/picture?type=large&access_token=${result.accessToken.token}`
        )
        .then((data) => {
          const picture = data.url;

          user = {
            ...user,
            picture,
          };
        })
        .catch((e) => {
          console.error(e);
        });

      await axios
        .post(
          "https://realtime-chat-siwi.herokuapp.com/user/social-register",
          user
        )
        .then((res) => {
          const { data } = res;
          if (data.error) {
            if (
              data.error.path[0] === "email" &&
              (data.error.type === "string.empty" ||
                data.error.type === "any.required")
            ) {
              setError("This account has no email address");
            } else {
              setError(data.error.message);
            }
          } else if (data._id) {
            history.push("/home");
          } else {
            setError("An unexpected error has ocurred");
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  } catch (e) {
    console.error(e);
  }

  setShowLoader(false);
}

/* ------ Twitter Login ------ */
const twitter = new Twitter();

export async function signInTwitter(history, setError, setShowLoader) {
  let user = {};

  await twitter
    .login()
    .then(async (result) => {
      setShowLoader(true);

      if (result.authToken && result.authTokenSecret) {
        await axios
          .get(`https://realtime-chat-siwi.herokuapp.com/user/twitter-data`, {
            params: {
              oauthToken: result.authToken,
              oauthTokenSecret: result.authTokenSecret,
            },
          })
          .then(async (res) => {
            const { data } = res;

            if (data.error) {
              setError(data.error);
            } else {
              const { name, email, profile_image_url_https } = data;
              const picture = profile_image_url_https.replace(
                "_normal",
                "_bigger"
              );

              user = {
                name,
                email,
                picture,
              };

              await axios
                .post(
                  "https://realtime-chat-siwi.herokuapp.com/user/social-register",
                  user
                )
                .then((res) => {
                  const { data } = res;
                  if (data.error) {
                    if (
                      data.error.path[0] === "email" &&
                      (data.error.type === "string.empty" ||
                        data.error.type === "any.required")
                    ) {
                      setError("This account has no email address");
                    } else {
                      setError(data.error.message);
                    }
                  } else if (data._id) {
                    history.push("/home");
                  } else {
                    setError("An unexpected error has ocurred");
                  }
                })
                .catch((e) => {
                  console.error(e);
                });
            }
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
        .post(
          "https://realtime-chat-siwi.herokuapp.com/user/social-register",
          user
        )
        .then((res) => {
          const { data } = res;

          if (data.error) {
            if (
              data.error.path[0] === "email" &&
              (data.error.type === "string.empty" ||
                data.error.type === "any.required")
            ) {
              setError("This account has no email address");
            } else {
              setError(data.error.message);
            }
          } else if (data._id) {
            history.push("/home");
          } else {
            setError("An unexpected error has ocurred");
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  } catch (e) {
    console.error(e);
  }

  setShowLoader(false);
}
