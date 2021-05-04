import axios from "axios";

export default async function CheckEmail(data, setShowLoader, setError) {
  setShowLoader(true);

  const { name, email, code } = data;
  let result = false;

  await axios
    .post("http://192.168.0.106:3300/user/check-email", {
      name,
      email,
      code,
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
