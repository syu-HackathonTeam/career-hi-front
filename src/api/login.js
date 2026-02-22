/**
 *
 * @returns {object} {success: boolean, userInfo?: object, tokenInfo:object }
 */
export const api_loginCheck = async () => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // if (!accessToken || !refreshToken) {
  //   return {
  //     success: false,
  //     message: "로그인이 필요합니다.",
  //   };
  // }

  return {
    success: true,
    userInfo: {
      userId: 1022,
      userName: "신가연",
      email: "dummy@careerhi.com",
    },
    tokenInfo: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * 로그인 API
 * @param {string} email 이메일
 * @param {string} password 비밀번호
 * @returns { success: boolean, userInfo?: object, tokenInfo:object } 로그인 여부 및 사용자 정보
 */
export const api_login = async ({ email, password }) => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.post("/api/v1/auth/login", {
  //     email,
  //     password,
  //   });
  //   const payload = response?.data;
  //   if (payload?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       userInfo: payload?.data?.user,
  //       tokenInfo: payload?.data?.tokenInfo,
  //       message: payload?.message,
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: payload?.message || "로그인에 실패했습니다.",
  //   };
  // } catch (err) {
  //   const errorCode = err?.response?.data?.errorCode;
  //   const message = errorCode === "LOGIN_FAILED" ? "아이디 또는 비밀번호를 확인해주세요." : err?.response?.data?.message || "로그인에 실패했습니다.";
  //   return {
  //     success: false,
  //     errorCode,
  //     message,
  //   };
  // }

  if (!email || !password) {
    return {
      success: false,
      errorCode: "LOGIN_FAILED",
      message: "아이디 또는 비밀번호를 확인해주세요.",
    };
  }

  return {
    success: true,
    message: "로그인에 성공하였습니다. (더미)",
    userInfo: {
      userId: 1022,
      userName: "신가연",
      email,
    },
    tokenInfo: {
      grantType: "Bearer",
      accessToken: "dummy_access_token",
      refreshToken: "dummy_refresh_token",
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresIn: 1209600,
    },
  };
};
