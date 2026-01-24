import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import "./style.css";

const CHOSEONG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

const JUNGSEONG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];

const JONGSEONG = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const BASE = 0xac00;
const CHOSEONG_BASE = 21 * 28;
const JUNGSEONG_BASE = 28;

// 한글을 자모 단위로 분리해 연속 문자열로 변환 (초성 검색 대응)
const toJamoString = (text = "") => {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // 한글 음절(가~힣)
      if (code >= 0xac00 && code <= 0xd7a3) {
        const offset = code - BASE;
        const choseongIndex = Math.floor(offset / CHOSEONG_BASE);
        const jungseongIndex = Math.floor((offset % CHOSEONG_BASE) / JUNGSEONG_BASE);
        const jongseongIndex = offset % JUNGSEONG_BASE;
        return `${CHOSEONG[choseongIndex]}${JUNGSEONG[jungseongIndex]}${JONGSEONG[jongseongIndex]}`;
      }
      return char; // 한글 외 문자는 그대로 반환
    })
    .join("");
};

const SearchBarCP = ({ value, onChangeValue, setValue, selectList, placeholder = "", disabled = false, zIndexClass = "z-50" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredList = useMemo(() => {
    if (value && selectList) {
      const query = value.toLowerCase();
      const queryJamo = toJamoString(query);

      return selectList.filter((item) => {
        const itemLower = item.toLowerCase();
        // 1) 일반 부분 문자열 매칭
        if (itemLower.includes(query)) return true;
        // 2) 자모 분리 후 초성/중성/종성 연속 매칭 (입력 조합 중간값 대응)
        const itemJamo = toJamoString(itemLower);
        return itemJamo.startsWith(queryJamo);
      });
    }
    return [];
  }, [value, selectList]);

  const handleItemClick = (item) => {
    setValue(item);
    setIsOpen(false);
  };

  const showList = (() => {
    if (!isOpen) return false;
    if (filteredList.length === 0) return false;
    if (filteredList.length === 1 && filteredList[0].toLowerCase() === (value || "").toLowerCase()) return false;
    return true;
  })();

  // 검색어 하이라이트 함수
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-point-main font-bold">
          {part}
        </span>
      ) : (
        <span key={index} className="text-gray-500">
          {part}
        </span>
      ),
    );
  };

  //FIXME: 디자인 수정, 다른 div 위치에 간섭이 되는지 확인하기, 스크롤바 수정하기
  return (
    <div className="relative w-full max-h-12 overflow-y-visible">
      <div
        className={`searchBarCp rounded-lg border border-gray-300 focus:border-gray-500 relative bg-white ${zIndexClass}`}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}>
        {/* INPUT */}
        <div className="flex px-5 flex-nowrap gap-3 items-center" onFocus={() => setIsOpen(true)} onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
          <input
            type="text"
            className="B4 h-11.5 text-point-text flex-1 w-full outline-none border-0"
            value={value}
            onChange={onChangeValue}
            disabled={disabled}
            placeholder={placeholder}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500 B4" />
        </div>

        {/* LIST */}
        {showList && (
          <div className="searchBarCp-list border-t border-t-gray-200 py-5 mx-5 max-h-52 overflow-y-auto">
            {filteredList.map((item, index) => (
              <div key={index} className="pb-3 last:pb-0 cursor-pointer B4 text-point-text" onClick={() => handleItemClick(item)}>
                {highlightText(item, value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchBarCP;
