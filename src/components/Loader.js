import "./styles/css/min/Loader.min.css";

export default function Loader({ visible }) {
  return (
    <div
      className="loader-container absolute top-0 left-0 justify-center items-center w-screen h-screen bg-white"
      style={{
        display: visible ? "flex" : "none",
      }}
    >
      <div className="gooey absolute w-40 h-10 bg-white">
        <span className="dot absolute w-5 h-5 top-1/2 rounded-full"></span>
        <div className="dots absolute top-1/2">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
