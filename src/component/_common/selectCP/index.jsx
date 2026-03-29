import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";
import { useState } from "react";

const SelectCP = ({ value, setValue, selectList, placeholder = "", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-h-12 overflow-y-visible">
      <div
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
        className="SelectCP z-10 flex px-5 flex-nowrap gap-3 items-center cursor-pointer rounded-lg border border-gray-300 relative bg-white"
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
        <input
          type="text"
          className="B4 h-11.5 cursor-pointer text-point-text flex-1 w-full outline-none border-0 caret-transparent"
          value={value}
          readOnly
          disabled={disabled}
          placeholder={placeholder}
        />
        {isOpen && <FontAwesomeIcon icon={faCaretUp} className="text-gray-500" />}
        {!isOpen && <FontAwesomeIcon icon={faCaretDown} className="text-gray-500" />}
      </div>

      {/* 셀렉트박스 */}
      {isOpen && (
        <div className="cursor-pointer rounded-lg border border-gray-400 relative bg-white p-4 z-51 mt-1.5">
          <div className="w-fit">
            {selectList.map((item, index) => (
              <div
                onClick={() => {
                  setValue(item);
                  setIsOpen(false);
                }}
                key={index}
                className="mb-2 last:mb-0 cursor-pointer B4 px-2.5 py-1 rounded-sm"
                style={{
                  backgroundColor: item === value ? "#FFF2F5" : "withe",
                  color: item === value ? "var(--color-point-sub-bold)" : "var(--color-point-text)",
                }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SelectCP;
