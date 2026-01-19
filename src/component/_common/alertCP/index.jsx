import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * AlertCP 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.titleText="AlertTitle"] - 알림창 제목 텍스트
 * @param {string} [props.buttonText="AlertButton"] - 버튼 텍스트
 * @param {function} props.closeButton - 닫기(X) 버튼 클릭 핸들러
 * @param {function} props.okButton - 확인 버튼 클릭 핸들러
 * @returns {JSX.Element} 알림창 컴포넌트
 */
const AlertCP = ({ titleText = "AlertTitle", buttonText = "AlertButton", closeButton, okButton }) => {
  return (
    <div className="w-screen select-none h-screen z-999 bg-[#171C20BF] fixed flexCenter">
      <div className="relative w-80 h-45 bg-white min-h-50 rounded-lg p-10 flex flex-col justify-between">
        {/* xMark */}
        <div onClick={() => closeButton()} className="absolute top-6 right-6 cursor-pointer text-gray-400">
          <FontAwesomeIcon icon={faXmark} />
        </div>

        {/* title */}
        <p className="H2_bold w-full text-center">{titleText}</p>
        <div className="H3_bold cursor-pointer w-full py-4 text-center text-white bg-point-main rounded-lg" onClick={okButton}>
          {buttonText}
        </div>
      </div>
    </div>
  );
};
export default AlertCP;
