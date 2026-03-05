import logo_image from "../../assets/image/logo.png";
import "./style.css";
import InputCP from "../../component/_common/inputCP";
import { useNavigate } from "react-router-dom";
import { useInput } from "../../hook/useInput";
import ButtonCP from "../../component/_common/buttonCP";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoginLayout from "../../layout/LoginLayout";
import { api_signupCertification, api_verifyCode } from "../../api/signup";
import { useLoginInfo } from "../../context/LoginInfoContext";
import useAlertCP from "../../hook/useAlertCP";
import AlertCP from "../../component/_common/alertCP";

const SignUpPage = () => {
  const nav = useNavigate();
  // 알럴트
  const [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert] = useAlertCP();

  // 입력 상태들
  const [name, onChangeName] = useInput("");
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword, setPassword] = useInput("");
  const [confirmPassword, onChangeConfirmPassword] = useInput("");
  const [phone, onChangePhone] = useInput("");
  const [verificationCode, onChangeVerificationCode] = useInput("");
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);

  // 에러 상태들
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [verificationCodeError, setVerificationCodeError] = useState(false);

  // 전역변수
  const { signup } = useLoginInfo();

  // 인증번호 발송/쿨 다운 상태
  const [cooldownLeft, setCooldownLeft] = useState(0); // 인증 재요청 쿨 다운 남은 초

  const validateName = useCallback((value) => value.trim().length > 0, []);
  const validateEmail = useCallback((email) => email.includes("@") && email.includes("."), []);
  const validatePassword = useCallback((pwd) => /^[A-Za-z0-9\-!@#]{6,16}$/.test(pwd), []);
  const validateConfirmPassword = useCallback((value) => value.length > 0 && value === password, [password]);
  const validatePhone = useCallback((value) => /^010\d{8}$/.test(value), []);
  const validateVerificationCode = useCallback((value) => /^\d{6}$/.test(value), []);

  // 쿨 다운 잔여 시간을 mm:ss로 표시
  const getCooldownLabel = useCallback(() => {
    const m = String(Math.floor(cooldownLeft / 60)).padStart(2, "0");
    const s = String(cooldownLeft % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [cooldownLeft]);

  // 쿨타임 활성화 여부
  const isCooldownActive = useMemo(() => cooldownLeft > 0, [cooldownLeft]);

  // 쿨 다운 감소
  useEffect(() => {
    if (cooldownLeft <= 0) return undefined;
    const timer = setInterval(() => {
      setCooldownLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownLeft]);

  /**
   * 회원가입 버튼 클릭 핸들러
   */
  const onClickSignUp = useCallback(async () => {
    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const confirmPasswordValid = validateConfirmPassword(confirmPassword);
    const phoneValid = validatePhone(phone);
    const isVerificationEmpty = verificationCode.trim().length === 0;
    const verificationCodeValid = !isVerificationEmpty && validateVerificationCode(verificationCode);
    const verificationSentValid = verificationRequested;

    setNameError(!nameValid);
    setEmailError(!emailValid);
    setPasswordError(!passwordValid);
    setConfirmPasswordError(!confirmPasswordValid);
    setPhoneError(!phoneValid);
    setVerificationCodeError(isVerificationEmpty || !verificationCodeValid || !verificationSentValid);

    if (!nameValid || !emailValid || !passwordValid || !confirmPasswordValid || !phoneValid || !verificationCodeValid || !verificationSentValid) {
      if (isVerificationEmpty) {
        alert("인증번호를 입력해 주세요");
        return;
      }

      if (!passwordValid) setPassword("");
      return;
    }

    const verifyResult = await api_verifyCode({
      phoneNumber: phone,
      authCode: verificationCode,
      type: "SIGNUP",
    });

    if (!verifyResult?.success) {
      setVerificationCodeError(true);
      setAlertTitleText(verifyResult?.message || "인증번호가 일치하지 않습니다.");
      setAlertButtonText("확인");
      openAlert();
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phone,
      authCode: verificationCode,
      marketingAgreed: marketingAgree,
    };

    try {
      const result = await signup(data);
      if (result.success) {
        setAlertTitleText("가입이 완료되었습니다");
        setAlertButtonText("메인 페이지");
        openAlert();
      } else {
        setAlertTitleText(result.message || "회원가입에 실패했습니다");
        setAlertButtonText("확인");
        openAlert();
      }
    } catch (err) {
      console.error(err);
      setAlertTitleText("회원가입 중 오류가 발생했습니다");
      setAlertButtonText("확인");
      openAlert();
    }
  }, [
    setAlertTitleText,
    setAlertButtonText,
    openAlert,
    name,
    email,
    password,
    confirmPassword,
    phone,
    verificationCode,
    verificationRequested,
    setPassword,
    marketingAgree,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validatePhone,
    validateVerificationCode,
    signup,
  ]);

  /**
   * 인증번호 발송
   */
  const onSendVerificationCode = useCallback(async () => {
    const phoneValid = validatePhone(phone);
    setPhoneError(!phoneValid);
    if (!phoneValid || cooldownLeft > 0) return;

    const result = await api_signupCertification(phone, "SIGNUP");
    if (result?.success) {
      setVerificationRequested(true);
      setCooldownLeft(result?.expiryTime ?? 180);
      return;
    }

    setAlertTitleText(result?.message || "인증번호 발송에 실패했습니다");
    setAlertButtonText("확인");
    openAlert();
  }, [cooldownLeft, openAlert, phone, setAlertButtonText, setAlertTitleText, validatePhone]);

  return (
    <LoginLayout>
      {/* AlertCP */}
      {isAlertOpen && (
        <AlertCP
          titleText={alertTitleText}
          buttonText={alertButtonText}
          closeButton={closeAlert}
          okButton={() => {
            closeAlert();
            nav("/");
          }}
        />
      )}
      {/* 콘텐츠 */}
      <div className="w-full flex flexHeightCenter gap-8">
        <img src={logo_image} alt="LOGO" id="loginPage-logo" className=" w-1/3 max-w-25 p-1.5 border rounded-3xl border-gray-200" />
        <p className="H2_bold">회원가입</p>
      </div>

      <div className="border-b border-gray-200 w-full max-w-105">{/* 밑줄 */}</div>
      <div className="w-full max-w-105 flex flex-col justify-center gap-2">
        <div className="w-full">
          {/* 이름 */}
          <InputCP placeholder="이름 *" value={name} onChangeValue={onChangeName} errorText="이름을 입력해 주세요" error={nameError} />
        </div>
        <div className="w-full">
          {/* 이메일 */}
          <InputCP placeholder="이메일 *" value={email} onChangeValue={onChangeEmail} errorText="이메일 형식이 올바르지 않습니다" error={emailError} />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-2">
            {/* 전화번호 */}
            <InputCP placeholder="전화번호 *" value={phone} onChangeValue={onChangePhone} errorText="전화번호를 입력해 주세요" error={phoneError} />
          </div>
          <div className={isCooldownActive ? "pointer-events-none" : ""} onClick={onSendVerificationCode}>
            <ButtonCP bg={isCooldownActive ? "bg-gray-300" : "bg-point-text"} color={isCooldownActive ? "text-point-text" : "text-white"} fontSize="text-sm">
              {isCooldownActive ? getCooldownLabel() : "인증번호 발송"}
            </ButtonCP>
          </div>
        </div>
        {verificationRequested && (
          <div className="w-full">
            {/* 인증번호 */}
            <InputCP
              placeholder="인증번호 *"
              value={verificationCode}
              onChangeValue={onChangeVerificationCode}
              errorText="6자리 숫자를 입력해 주세요"
              error={verificationCodeError}
            />
          </div>
        )}
        <div className="w-full">
          {/* 비밀번호 */}
          <InputCP
            placeholder="비밀번호 *"
            value={password}
            onChangeValue={onChangePassword}
            type="password"
            errorText="비밀번호는 6~16자 영문, 숫자, 특수문자(-!@#)만 가능합니다"
            error={passwordError}
          />
        </div>
        <div className="w-full">
          {/* 비밀번호 확인 */}
          <InputCP
            placeholder="비밀번호 확인 *"
            value={confirmPassword}
            onChangeValue={onChangeConfirmPassword}
            type="password"
            errorText="비밀번호가 일치하지 않습니다"
            error={confirmPasswordError}
          />
        </div>
        <form className="cursor-pointer">
          <input
            type="checkbox"
            id="marketingAgree"
            name="marketingAgree"
            className="cursor-pointer"
            checked={marketingAgree}
            onChange={() => setMarketingAgree((prev) => !prev)}
          />
          <label htmlFor="marketingAgree" className="ml-2 B4 text-gray-500 cursor-pointer">
            마케팅 정보 수신에 동의합니다 (선택)
          </label>
        </form>
      </div>

      <div className="w-full max-w-105 mt-6 flexWidthCenter" onClick={onClickSignUp}>
        <ButtonCP bg="bg-point-text" color="text-white">
          회원가입
        </ButtonCP>
      </div>
    </LoginLayout>
  );
};
export default SignUpPage;
