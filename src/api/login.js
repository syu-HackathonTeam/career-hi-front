import { api } from "./index.js";

/**
 *
 * @returns {object} {success: boolean, userInfo?: object, tokenInfo:object }
 */
export const api_loginCheck = async () => {
  // try {
  //   const response = await api.get("/api/v1/auth/check");
  //   const payload = response?.data;
  //   const isLoggedIn = payload?.data?.isLoggedIn;
  //   if (payload?.status === "SUCCESS" && isLoggedIn) {
  //     return {
  //       success: true,
  //       userInfo: payload?.data?.user,
  //     };
  //   }

  //   return {
  //     success: false,
  //     message: payload?.message || "로그인 상태가 아닙니다.",
  //   };
  // } catch (err) {
  //   if (err?.response?.status === 401) {
  //     return {
  //       success: false,
  //       message: err?.response?.data?.message || "로그인이 필요합니다.",
  //     };
  //   }
  //   console.error(err);
  //   return {
  //     success: false,
  //     message: "로그인 상태 확인에 실패했습니다.",
  //   };
  // }

  // FIXME: 임시 반환값 (로그인 유지)
  return {
    success: true,
    userInfo: {
      userId: 1022,
      userName: "OOO",
      email: "test@naver.com",
    },
    tokenInfo: {
      grantType: "Bearer",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access_token_area",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_token_area",
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresIn: 1209600,
    },
  };

  // FIXME: 임시 반환값 (로그인 안 된 상태)
  // return {
  //   success: false,
  // };
};

/**
 * 로그인 API
 * @param {string} email 이메일
 * @param {string} password 비밀번호
 * @returns { success: boolean, userInfo?: object, tokenInfo:object } 로그인 여부 및 사용자 정보
 */
export const api_login = async ({ email, password }) => {
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
    };
  } catch (err) {
    const message = err?.response?.data?.message || "로그인에 실패했습니다.";
    return {
      success: false,
      message,
    };
  }

  // TODO: 구현 필요 (여러 에러처리 포함)
  // return {
  //   success: true,
  //   userInfo: {
  //     userId: 1022,
  //     userName: "OOO",
  //     email: "",
  //   },
  //   tokenInfo: {
  //     grantType: "Bearer",
  //     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access_token_area",
  //     refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_token_area",
  //     accessTokenExpiresIn: 3600,
  //     refreshTokenExpiresIn: 1209600,
  //   },
  // };
};
