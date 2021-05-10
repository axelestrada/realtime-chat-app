import "./styles/css/SocialLogin.css"

export default function SocialLogin({children, formType}) {
  return (
    <div className="social-login mt-3 text-center text-base">
      <p>{`${formType} with social network`}</p>
      <div className="flex justify-center items-center mt-4">{children}</div>
    </div>
  );
}
