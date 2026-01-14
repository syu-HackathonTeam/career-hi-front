/**
 * 공통 인풋 컴포넌트
 * @param {Object} props
 * @param {string} props.placeholder - placeholder 텍스트
 * @param {string} props.value - input 값
 * @param {function} props.onChangeValue - onChange 핸들러
 * @param {string} [props.type="text"] - input 타입
 * @param {boolean} [props.disabled=false] - 입력 비활성화
 * @param {string} [props.errorText=""] - 에러 메시지 텍스트
 * @param {boolean} [props.error=false] - 에러 상태 표시
 * @returns {JSX.Element}
 */
const InputCP = ({ placeholder, value, onChangeValue, type = "text", disabled = false, errorText = "", error = false }) => {
  return (
    <div>
      <input
        style={{
          backgroundColor: disabled ? "#d6d6d6" : "white",
        }}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChangeValue}
        className="B3 text-point-text w-full py-4 px-5 rounded-lg border-[1px] border-gray-300 focus:border-gray-500 focus:outline-none"
      />
      {error && <p className="text-[12px] text-point-error pt-1">{errorText}</p>}
    </div>
  );
};
export default InputCP;
