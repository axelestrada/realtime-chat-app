import axios from "axios";

export default async function CheckEmail(
  data,
  history,
  setShowLoader,
  setError
) {
  setShowLoader(true);

  await axios
    .get("http://192.168.0.106:3300/user/check-email", {
      params: {
        name: data.name,
        email: data.email,
      },
    })
    .then((res) => {
      const {error} = res.data;
      if(error){
        setError(error)
      }else{
        console.log(res)
        history.push("/register/otp-verification", data);
      }
    })
    .catch((e) => {
      console.error(e);
      setError("An unexpected error has ocurred");
    });

  setShowLoader(false);
}
