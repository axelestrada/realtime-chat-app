import { useRef } from "react";
import "./styles/css/min/OTPInput.min.css";

export default function OTPInput({ value, setValue }) {
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const input5 = useRef(null);

  return (
    <div className="otp-input flex justify-between flex-wrap">
      <input
        type="number"
        ref={input1}
        value={value[0]}
        onChange={(e) => {
          if (e.target.value.length <= 1) {
            let digits = [...value];
            let digit = { ...value[0] };

            digit = e.target.value;
            digits[0] = digit;

            setValue(digits);
          }

          if (e.target.value.length !== 0) {
            input2.current.focus();
          }
        }}
      />

      <input
        type="number"
        ref={input2}
        value={value[1]}
        onKeyDown={(e) => {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (value[1].length === 0) {
              input1.current.focus();
            }
          }
        }}
        onChange={(e) => {
          if (e.target.value.length <= 1) {
            let digits = [...value];
            let digit = { ...value[1] };

            digit = e.target.value;
            digits[1] = digit;

            setValue(digits);
          }

          if (e.target.value.length !== 0) {
            input3.current.focus();
          }
        }}
      />

      <input
        type="number"
        ref={input3}
        value={value[2]}
        onKeyDown={(e) => {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (value[2].length === 0) {
              input2.current.focus();
            }
          }
        }}
        onChange={(e) => {
          if (e.target.value.length <= 1) {
            let digits = [...value];
            let digit = { ...value[2] };

            digit = e.target.value;
            digits[2] = digit;

            setValue(digits);
          }

          if (e.target.value.length !== 0) {
            input4.current.focus();
          }
        }}
      />

      <input
        type="number"
        ref={input4}
        value={value[3]}
        onKeyDown={(e) => {
          if (e.key === "Delete" || e.key === "Backspace") {
           if (value[3].length === 0) {
             input3.current.focus();
           }
          }
        }}
        onChange={(e) => {
          if (e.target.value.length <= 1) {
            let digits = [...value];
            let digit = { ...value[3] };

            digit = e.target.value;
            digits[3] = digit;

            setValue(digits);
          }

          if (e.target.value.length !== 0) {
            input5.current.focus();
          }
        }}
      />

      <input
        type="number"
        ref={input5}
        value={value[4]}
        onKeyDown={(e) => {
          if (e.key === "Delete" || e.key === "Backspace") {
            if(value[4].length === 0){
              input4.current.focus();
            }
          }
        }}
        onChange={(e) => {
          if (e.target.value.length <= 1) {
            let digits = [...value];
            let digit = { ...value[4] };

            digit = e.target.value;
            digits[4] = digit;

            setValue(digits);
          }
        }}
      />

      <div className="w-full flex justify-between">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
