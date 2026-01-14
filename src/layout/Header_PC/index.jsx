import { useEffect } from "react";
import LogoCP from "../../component/_common/logoCP";
import { useLoginInfo } from "../../context/LoginInfoContext";
import "./style.css";
import { useNavigate } from "react-router-dom";

const HeaderPc = () => {
  const { loginCheck, loginInfo } = useLoginInfo();
  const nav = useNavigate();

  useEffect(() => {
    loginCheck();
  }, [loginCheck]);

  const isLogin = loginInfo.isLogin;

  return (
    <header className="w-full h-[5.125rem] bg-gray-100 flex justify-between items-center px-[2vw] select-none">
      <LogoCP />
      {isLogin && (
        <div className="flex items-center gap-3">
          <div
            onClick={() => nav("/mypage")}
            className="w-fit h-[2.25rem] bg-point-text rounded-[3.75rem] text-white px-4 select-none cursor-pointer B3_bold flex items-center ">
            {loginInfo?.userData?.userName}님
          </div>
          <span className="B3">어서오세요!</span>
        </div>
      )}
      {!isLogin && (
        <div
          onClick={() => nav("/login")}
          className="w-fit h-[2.25rem] bg-point-text rounded-[3.75rem] text-white px-4 select-none cursor-pointer B3_bold flex items-center">
          로그인이 필요합니다
        </div>
      )}
    </header>
  );
};
export default HeaderPc;
