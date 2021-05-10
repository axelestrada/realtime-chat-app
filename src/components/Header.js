import { IonIcon } from "@ionic/react";
import { search } from "ionicons/icons";

import "./styles/css/Header.css"

export default function Header({
  title,
  value,
  setValue,
  placeholder = "search",
  showToggle = true
}) {
  return (
    <div className="header bg-white rounded-b-3xl p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">{title}</h1>
        {showToggle && (
          <svg
            viewBox="0 0 134.775 134.775"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
          >
            <path
              fill="currentColor"
              d="M67.58 44.795c13.569 0 22.201-11.101 22.201-22.598C89.781 11.101 81.149 0 67.58 0 53.213 0 44.994 11.101 44.994 22.197c0 11.497 8.219 22.598 22.586 22.598zM67.58 134.775c13.569 0 22.201-11.101 22.201-22.602 0-11.101-8.632-22.193-22.201-22.193-14.367 0-22.586 11.093-22.586 22.193 0 11.502 8.219 22.602 22.586 22.602z"
            />
          </svg>
        )}
      </div>

      <div className="header__search-box rounded-full mt-3 py-3 px-5">
        <IonIcon src={search} className="w-5 h-5 grid" />
        <input
          className="search-input"
          autoComplete="off"
          type="text"
          name="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
