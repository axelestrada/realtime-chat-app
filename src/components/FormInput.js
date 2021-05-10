import "./styles/css/FormInput.css";

export default function FormInput({ title, children }) {
  return (
    <div className="form-input relative pt-4">
      <label className="text-lg">{title}</label>
      {children}
    </div>
  );
}
