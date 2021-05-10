import "./styles/css/Loader.css";

export default function Loader({ visible, src, size = "20" }) {
  return (
    <div
      className={`loader-container absolute top-0 left-0 flex justify-center items-center w-screen h-full transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div>
        <img src={src} alt="Chatbit Logo" className={`w-${size} h-${size}`} />
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    </div>
  );
}
