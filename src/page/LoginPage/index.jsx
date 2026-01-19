import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainLayout from "../../layout";
import { faKakaoTalk } from "@fortawesome/free-brands-svg-icons";
import logo_image from "../../assets/image/logo.png";
import "./style.css";
import InputCP from "../../component/_common/inputCP";
import { useNavigate } from "react-router-dom";
import { useInput } from "../../hook/useInput";
import ButtonCP from "../../component/_common/buttonCP";
import { useCallback, useState } from "react";
import LoginLayout from "../../layout/LoginLayout";

const LoginPage = () => {
  const nav = useNavigate();
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword, setPassword] = useInput("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateEmail = (email) => email.includes("@") && email.includes(".");
  const validatePassword = (password) => /^[A-Za-z0-9\-!@#]{6,16}$/.test(password);

  const onClickLogin = useCallback(() => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid && !passwordValid) {
      // 이메일, 비밀번호 모두 오류
      setPassword("");
      setEmailError(true);
      setPasswordError(true);
      return;
    }
    if (!emailValid) {
      // 이메일만 오류
      setEmailError(true);
      setPasswordError(false);
      return;
    }
    if (!passwordValid) {
      // 비밀번호만 오류
      setPassword("");
      setEmailError(false);
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
    setEmailError(false);

    alert("로그인 성공!");
  }, [email, password, setPassword, setEmailError, setPasswordError]);
  return (
    <LoginLayout>
      {/* 콘텐츠 */}
      <div className="w-full flex flexHeightCenter gap-8">
        <img src={logo_image} alt="LOGO" id="loginPage-logo" className=" w-1/3 max-w-25 p-1.5 border rounded-3xl border-gray-200" />
        <p className="H2_bold">로그인</p>
      </div>
      <div className="w-full hidden md:black">
        <ButtonCP bg="bg-[#FEE500]" color="text-[#392020]">
          <FontAwesomeIcon icon={faKakaoTalk} className="mr-2" />
          <span>카카오 로그인</span>
        </ButtonCP>
      </div>
      <div className="hidden md:black border-b border-gray-200 w-full max-w-105">{/* 밑줄 */}</div>
      <div className="w-full max-w-105 flex flex-col justify-center gap-2">
        <div className="w-full">
          {/* 이메일 */}
          <InputCP placeholder="이메일" value={email} onChangeValue={onChangeEmail} errorText="이메일 형식이 올바르지 않습니다" error={emailError} />
        </div>
        <div className="w-full">
          {/* 비밀번호 */}
          <InputCP
            placeholder="비밀번호"
            value={password}
            onChangeValue={onChangePassword}
            type="password"
            errorText="비밀번호는 6~16자 영문, 숫자, 특수문자(-!@#)만 가능합니다"
            error={passwordError}
          />
        </div>
        <p onClick={() => nav("/find-password")} className="B4 text-gray-500 cursor-pointer border-b w-fit">
          비밀번호를 잊어버렸습니다
        </p>
      </div>
      <div className="w-full max-w-105 mt-6 flexWidthCenter">
        <div onClick={onClickLogin} className="w-full">
          <ButtonCP bg="bg-point-text" color="text-white">
            로그인
          </ButtonCP>
        </div>
        <p className="w-fit text-center mt-4 B3 cursor-pointer" onClick={() => nav("/signup")}>
          회원가입
        </p>
      </div>
      <div className="md:hidden black border-b border-gray-200 w-full max-w-105">{/* 밑줄 */}</div>
      <div className="flexWidthCenter gap-2.5">
        <p>간편 로그인</p>
        <div className="bg-[#FEE500] w-13 h-13 rounded-full flexCenter text-2xl">
          <FontAwesomeIcon icon={faKakaoTalk} className="" />
        </div>
      </div>
    </LoginLayout>
  );
};
export default LoginPage;
