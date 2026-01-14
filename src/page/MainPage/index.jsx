import { use, useEffect } from "react";
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
        <MainLayout>
          <MainContentLayout>
            <div className="w-full pb-14 h-full flex flex-col items-center justify-center select-none relative">
              <img src={logo_3d} alt="이미지를 불러올 수 없습니다." className="h-6/10 max-h-[360px] pb-1/5" />
              {/* 로그인 */}
              {loginInfo.isLogin && (
                <p className="text-center H2_bold leading-7 md:text-xl">
                  내 스펙을 입력하고
                  <br />단 <span className="dot-text">1</span>
                  <span className="dot-text">초</span> 만에 취업 준비 로드맵을 완성해요!
                </p>
              )}
              {loginInfo.isLogin && (
                <div onClick={() => nav("/my-roadmap")} className="px-14 py-5 rounded-[0.6rem] bg-point-text cursor-pointer text-white mt-[8%]">
                  나의 로드맵 알아보기
                </div>
              )}

              {/* 로그아웃 */}
              {!loginInfo.isLogin && (
                <p className="text-center font-kimm leading-7 md:text-xl">
                  지금 Career-Hi 로그인하고
                  <br />
                  나에게 꼭 맞는 취업 준비 로드맵을 확인해요
                </p>
              )}
              {!loginInfo.isLogin && (
                <div onClick={() => nav("/login")} className="px-14 py-5 rounded-[0.6rem] bg-point-text cursor-pointer text-white mt-[8%]">
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
