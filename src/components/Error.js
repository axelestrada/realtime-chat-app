import "./styles/css/min/Error.min.css";

export default function Error({children, visible}) {
  return (
    <div
      className={
        `error absolute z-50 bg-white top-0 rounded-lg left-1/2 transform -translate-x-1/2 -translate-y-20 w-4/5 transition-transform p-4 text-base text-center tracking-wide${visible && " visible"}`
      }
    >
     {children}
    </div>
  );
}