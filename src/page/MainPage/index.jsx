import { useEffect } from "react";
import AlertCP from "../../component/_common/alertCP";
import useAlertCP from "../../hook/useAlertCP";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout";
import MainContentLayout from "../../layout/MainLayout";
import logo_3d from "../../assets/image/3d_logo.png";
import { useLoginInfo } from "../../context/LoginInfoContext";
import "./style.css";

const MainPage = () => {
  const [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert] = useAlertCP();
  const { loginCheck, loginInfo } = useLoginInfo();
  const nav = useNavigate();

  useEffect(() => {
    const run = async () => {
      const result = await loginCheck();
      if (!result.isLogin) {
        setAlertTitleText("로그인이 필요합니다.");
        setAlertButtonText("로그인/회원가입");
        openAlert();
      }
    };
    run();
  }, [loginCheck, setAlertTitleText, setAlertButtonText, openAlert]);

  return (
    <div>
      {/* AlertCP */}
      {isAlertOpen && (
        <AlertCP
          titleText={alertTitleText}
          buttonText={alertButtonText}
          closeButton={closeAlert}
          okButton={() => {
            closeAlert();
            nav("/login");
          }}
        />
      )}
      <div
        style={{
          position: isAlertOpen ? "fixed" : "static",
          top: isAlertOpen ? "0" : "unset",
          left: isAlertOpen ? "0" : "unset",
          width: "100%",
        }}>
        <MainLayout mobile_block={true} page="main">
          <MainContentLayout page="main">
            <div className="w-full sm:pb-14 h-full flex flex-col items-center justify-center select-none relative gap-4 sm:gap-0">
              <img src={logo_3d} alt="이미지를 불러올 수 없습니다." className="h-2/10 sm:h-6/10 max-h-90 pb-1/5" />
              {/* 로그인 */}
              {loginInfo.isLogin && (
                <p className="sm:H2_bold font-semibold text-[1rem] text-center  leading-7 text-gray-400 sm:text-xl sm:text-black">
                  내 스펙을 입력하고
                  <br />단 <span className="dot-text">1</span>
                  <span className="dot-text">초</span> 만에 취업 준비 로드맵을 완성해요!
                </p>
              )}
              {loginInfo.isLogin && (
                <div
                  onClick={() => nav("/roadmap/create")}
                  className="w-full sm:w-[unset] text-center px-14 py-5 rounded-[0.6rem] bg-point-text cursor-pointer text-white mt-[8%]">
                  나의 로드맵 알아보기
                </div>
              )}

              {/* 로그아웃 */}
              {!loginInfo.isLogin && (
                <p className="sm:font-kimm font-pretendard font-semibold text-[1rem] text-center leading-7 text-gray-400 sm:text-xl sm:text-black">
                  지금 Career-Hi 로그인하고
                  <br />
                  나에게 꼭 맞는 취업 준비 로드맵을 확인해요
                </p>
              )}
              {!loginInfo.isLogin && (
                <div
                  onClick={() => nav("/login")}
                  className="w-full sm:w-[unset] px-14 py-5 rounded-[0.6rem] text-center bg-point-text cursor-pointer text-white mt-[8%]">
                  로그인/회원가입
                </div>
              )}
            </div>
          </MainContentLayout>
        </MainLayout>
      </div>
    </div>
  );
};
export default MainPage;
