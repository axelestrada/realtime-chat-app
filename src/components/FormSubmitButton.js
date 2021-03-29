import "./styles/css/min/FormSubmitButton.min.css";

export default function FormSubmitButton({ title }) {
  return (
    <button type="submit" className="form-submit-button w-full text-lg mt-2 h-10 rounded-3xl text-white">
      {title}
    </button>
  );
}
