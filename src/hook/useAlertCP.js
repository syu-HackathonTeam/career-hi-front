import { useCallback, useState } from "react";

/**
 * useAlertCP - AlertCP 컴포넌트용 커스텀 훅
 *
 * @returns {[boolean, string, string, function, function, function, function]}
 * [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert]
 * - isAlertOpen: 알림창 열림 여부
 * - alertTitleText: 알림창 제목 텍스트
 * - alertButtonText: 버튼 텍스트
 * - setAlertTitleText: 제목 텍스트 설정 함수
 * - setAlertButtonText: 버튼 텍스트 설정 함수
 * - closeAlert: 알림창 닫기 함수
 * - openAlert: 알림창 열기 함수
 *
 * @example
 * // MainPage 컴포넌트에서 사용 예시
 * const [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert] = useAlertCP();
 *
 * useEffect(() => {
 *   setAlertTitleText("알림창 제목입니다.");
 *   setAlertButtonText("확인");
 *   openAlert();
 * }, []);
 *
 * return (
 *   <main>
 *     {isAlertOpen && (
 *       <AlertCP
 *         titleText={alertTitleText}
 *         buttonText={alertButtonText}
 *         closeButton={closeAlert}
 *         okButton={() => {
 *           // 확인 버튼 클릭 시 동작
 *           closeAlert();
 *         }}
 *       />
 *     )}
 *   </main>
 * );
 */
const useAlertCP = () => {
  // 알림창 열림 여부 상태
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // 알림창 제목 텍스트 상태
  const [alertTitleText, setAlertTitleText] = useState("");
  // 알림창 버튼 텍스트 상태
  const [alertButtonText, setAlertButtonText] = useState("");

  // 알림창 닫기 함수
  const closeAlert = useCallback(() => {
    setIsAlertOpen(false);
  }, [isAlertOpen]);

  // 알림창 열기 함수
  const openAlert = useCallback(() => {
    setIsAlertOpen(true);
  }, []);

  return [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert];
};
export default useAlertCP;
