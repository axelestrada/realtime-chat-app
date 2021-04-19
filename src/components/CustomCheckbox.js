import "./styles/css/min/CustomCheckbox.min.css";

export default function CustomCheckbox({ id, value, setValue }) {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="custom-checkbox"
        checked={value}
        onChange={() => setValue(!value)}
      />
      <label htmlFor={id}></label>
    </>
  );
}
