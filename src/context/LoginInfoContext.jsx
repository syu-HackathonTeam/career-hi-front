import { createContext, useContext, useState } from "react";
import { api_login, api_loginCheck } from "../api/login";
import { api_signup } from "../api/signup";
import { api_changePassword } from "../api/changePassword";

// UserContext 생성
const LoginInfoContext = createContext(null);

// 기본 로그인 정보 형태
const DEFAULT_LOGIN_INFO = {
  isLogin: false,
  userData: {
    userId: null,
    userName: null,
  },
  // 마지막 검증 시간 (타임스탬프)
  lastValidated: null,
};

// UserProvider 컴포넌트
export const LoginInfoProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState(DEFAULT_LOGIN_INFO);

  /**
   * 최근 검증 시점과 비교하여 필요할 때만 서버에 로그인 상태를 확인한다.
   * @returns {Promise<void|typeof DEFAULT_LOGIN_INFO|{isLogin: boolean, userData: object, lastValidated: number}}> 최신 로그인 정보
   */
  const loginCheck = async () => {
    const now = Date.now();
    const lastValidated = loginInfo.lastValidated;
    const isExpired = lastValidated === null || now - lastValidated > 60000; // 1분 = 60초

    if (!isExpired && lastValidated !== null) {
      // 3분 이내에 검증된 경우, API 호출 없이 리턴
      return loginInfo;
    }

    try {
      const res = await api_loginCheck();
      if (res.success) {
        const next = {
          isLogin: true,
          userData: res.userInfo,
          lastValidated: Date.now(),
        };
        setLoginInfo(next);
        localStorage.setItem("jwt_token", res.tokenInfo?.accessToken ?? "");
        localStorage.setItem("refresh_token", res.tokenInfo?.refreshToken ?? "");
        return next;
      }
      setLoginInfo(DEFAULT_LOGIN_INFO);
      return DEFAULT_LOGIN_INFO;
    } catch (err) {
      console.error("Login check failed:", err);
      setLoginInfo(DEFAULT_LOGIN_INFO);
      return DEFAULT_LOGIN_INFO;
    }
  };

  /**
   * 사용자의 이메일/비밀번호로 로그인 요청을 수행하고 전역 상태를 갱신한다.
   * @param {string} email 로그인 이메일
   * @param {string} password 로그인 비밀번호
   * @returns {Promise<{success: boolean, message: string}>} 로그인 처리 결과
   */
  const login = async (email, password) => {
    // 로그인 상태일 때 중복 로그인 방지
    if (loginInfo.isLogin) {
      return {
        success: false,
        message: "이미 로그인된 상태입니다.",
      };
    }

    // 로그인 상태일 때 중복 로그인 방지
    await loginCheck().then((res) => {
      if (res?.success) {
        return {
          success: false,
          message: "이미 로그인된 상태입니다.",
        };
      }
    });

    // 로그인 시도
    try {
      const res = await api_login(email, password);
      if (res.success) {
        const next = {
          isLogin: true,
          userData: res.userInfo,
          lastValidated: Date.now(),
        };
        setLoginInfo(next);
        localStorage.setItem("jwt_token", res.tokenInfo?.accessToken ?? "");
        localStorage.setItem("refresh_token", res.tokenInfo?.refreshToken ?? "");
        return {
          success: true,
          message: "로그인에 성공했습니다.",
        };
      } else {
        setLoginInfo(DEFAULT_LOGIN_INFO);
        return {
          success: false,
          message: res?.message || "로그인에 실패했습니다.",
        };
      }
    } catch (err) {
      console.error(err);
      setLoginInfo(DEFAULT_LOGIN_INFO);
      return {
        success: false,
        message: "로그인에 실패했습니다.",
      };
    }
  };

  const signup = async (data) => {
    // 로그인 상태일 때 중복 로그인 방지
    if (loginInfo.isLogin) {
      return {
        success: false,
        message: "이미 로그인된 상태입니다.",
      };
    }

    // 로그인 상태일 때 중복 로그인 방지
    await loginCheck().then((res) => {
      if (res?.success) {
        return {
          success: false,
          message: "이미 로그인된 상태입니다.",
        };
      }
    });
    // 회원가입 시도
    try {
      const res = await api_signup(data);
      if (res.success) {
        const next = {
          isLogin: true,
          userData: res.userInfo,
          lastValidated: Date.now(),
        };
        setLoginInfo(next);
        localStorage.setItem("jwt_token", res.tokenInfo?.accessToken ?? "");
        localStorage.setItem("refresh_token", res.tokenInfo?.refreshToken ?? "");
        return {
          success: true,
          message: "회원가입에 성공했습니다.",
        };
      } else {
        setLoginInfo(DEFAULT_LOGIN_INFO);
        return {
          success: false,
          message: res?.message || "로그인에 실패했습니다.",
        };
      }
    } catch (err) {
      console.error(err);
      setLoginInfo(DEFAULT_LOGIN_INFO);
      return {
        success: false,
        message: "로그인에 실패했습니다.",
      };
    }
  };

  const changePassword = async (data) => {
    // 로그인 상태일 때 중복 로그인 방지
    if (loginInfo.isLogin) {
      return {
        success: false,
        message: "이미 로그인된 상태입니다.",
      };
    }

    // 비밀번호 변경
    try {
      const res = await api_changePassword(data);
      return res;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return <LoginInfoContext.Provider value={{ loginInfo, setLoginInfo, loginCheck, login, signup, changePassword }}>{children}</LoginInfoContext.Provider>;
};

// Context를 쉽게 사용하기 위한 커스텀 훅
/**
 * 제공 값:
 * - loginInfo: { isLogin, userData, lastValidated }
 * - setLoginInfo: 상태 변경 함수
 * - loginCheck: 로그인 상태를 서버에서 검증하는 비동기 함수
 * 기본 제공 값:
 * - loginInfo: { isLogin, userData, lastValidated }
 * - setLoginInfo: 상태 변경 함수
 * - loginCheck: 로그인 상태를 서버에서 검증하는 비동기 함수
 * - login: 이메일/비밀번호로 로그인 요청을 수행하는 비동기 함수
 * - signup: 회원가입 요청을 수행하는 비동기 함수
 * - changePassword: 비밀번호 변경 요청을 수행하는 비동기 함수
 */
export const useLoginInfo = () => useContext(LoginInfoContext);
