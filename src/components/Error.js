import "./styles/css/Error.css";

export default function Error({children, visible, vibrate = false}) {
  return (
    <div
      className={
        `error max-w-sm absolute bg-white top-0 rounded-lg left-1/2 w-4/5 transition-transform p-4 text-base text-center tracking-wide ${visible && "visible"} ${vibrate && "vibrate"}`
      }
    >
     {children}
    </div>
  );
}