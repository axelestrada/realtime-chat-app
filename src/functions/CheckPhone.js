import axios from "axios";

export default async function CheckPhone(
  to,
  phone,
  code,
  setShowLoader,
  setError
) {
  setShowLoader(true);
  let result = false;

  await axios
    .post("http://192.168.0.106:3300/user/send-sms", {
      code,
      to,
      phone,
    })
    .then(() => {
      result = true;
    })
    .catch((error) => {
      if (error.response && error.response.data.error) {
        return setError(error.response.data.error);
      }

      setError("An unexpected error has ocurred");
      console.error(error);
    });

  setShowLoader(false);
  return result;
}
