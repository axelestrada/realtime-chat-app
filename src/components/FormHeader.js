import "./styles/css/FormHeader.css";

export default function FormTitle({ title, subtitle }) {
  return (
    <div className="form-title text-center">
      <h1 className="m-0 text-3xl">{title}</h1>
      <h2 className="mt-2 text-base">{subtitle}</h2>
    </div>
  );
}
