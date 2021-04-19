import "./styles/css/min/Loader.min.css";

export default function Loader({ visible }) {
  return (
    <div
      className="loader-container absolute top-0 left-0 justify-center items-center w-screen h-screen"
      style={{
        display: visible ? "flex" : "none",
      }}
    >
      <div className="lds-dual-ring"></div>
    </div>
  );
}
