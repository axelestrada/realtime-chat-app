import "./styles/css/FormSubmitButton.css";

export default function FormSubmitButton({ title, onClick = () => {}, mt = 0 }) {
  return (
    <button type="submit" className={`form-submit-button w-full text-lg mt-2 h-10 rounded-3xl text-white mt-${mt}`} onClick={onClick}>
      {title}
    </button>
  );
}
