import "./styles/css/min/FormSubmitButton.min.css";

export default function FormSubmitButton({ title, onClick = () => {} }) {
  return (
    <button type="submit" className="form-submit-button w-full text-lg mt-2 h-10 rounded-3xl text-white" onClick={onClick}>
      {title}
    </button>
  );
}
