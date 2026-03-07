import { api, getTokenInfo } from "./index";

/**
 *
 * @returns {object} {success: boolean, userInfo?: object, tokenInfo:object }
 */
export const api_loginCheck = async () => {
  const { accessToken, refreshToken } = getTokenInfo();

  if (!accessToken || !refreshToken) {
    return {
      success: false,
      message: "로그인이 필요합니다.",
    };
  }

  try {
    const response = await api.get("/api/v1/users/me");
    const payload = response?.data;
    const userInfo = payload?.data?.user || payload?.data;

    if (payload?.status === "SUCCESS" && userInfo) {
      return {
        success: true,
        userInfo,
        tokenInfo: payload?.data?.tokenInfo || {
          accessToken,
          refreshToken,
        },
      };
    }

    return {
      success: false,
      message: payload?.message || "로그인이 필요합니다.",
      errorCode: payload?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "로그인이 필요합니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

/**
 * 로그인 API
 * @param {string} email 이메일
 * @param {string} password 비밀번호
 * @returns { success: boolean, userInfo?: object, tokenInfo:object } 로그인 여부 및 사용자 정보
 */
export const api_login = async ({ email, password }) => {
  if (!email || !password) {
    return {
      success: false,
      errorCode: "LOGIN_FAILED",
      message: "아이디 또는 비밀번호를 확인해주세요.",
    };
  }

  try {
    const response = await api.post("/api/v1/auth/login", {
      email,
      password,
    });
    const payload = response?.data;
    if (payload?.status === "SUCCESS") {
      return {
        success: true,
        userInfo: payload?.data?.user,
        tokenInfo: payload?.data?.tokenInfo,
        message: payload?.message,
      };
    }

    return {
      success: false,
      message: payload?.message || "로그인에 실패했습니다.",
      errorCode: payload?.errorCode,
    };
  } catch (err) {
    const errorCode = err?.response?.data?.errorCode;
    const message = errorCode === "LOGIN_FAILED" ? "아이디 또는 비밀번호를 확인해주세요." : err?.response?.data?.message || "로그인에 실패했습니다.";
    return {
      success: false,
      errorCode,
      message,
    };
  }
};

export const api_logout = async () => {
  const { refreshToken } = getTokenInfo();

  try {
    const response = await api.post("/api/v1/auth/logout", {
      refreshToken,
    });

    return response?.data?.status === "SUCCESS";
  } catch (err) {
    console.error("로그아웃 실패:", err);
    return false;
  }
};

export const api_deleteUser = async () => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  try {
    const response = await api.delete("/api/v1/users/me");
    const payload = response?.data;
    if (payload?.status === "SUCCESS") {
      return true;
    }

    return false;
  } catch (err) {
    console.error("회원 탈퇴 실패:", err);
    return false;
  }
};
