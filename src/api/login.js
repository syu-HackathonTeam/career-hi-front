import { api } from "./index.js";

/**
 *
 * @returns {object} {success: boolean, userInfo?: object, tokenInfo:object }
 */
export const api_loginCheck = async () => {
  // TODO: 구현 필요
  // try {
  //   const response = await api.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/verify/send`, { phoneNumber: String(phone) });
  //   if (response?.data?.status === "SUCCESS") {
  //     return true;
  //   } else {
  //     alert(response?.data?.message);
  //     return false;
  //   }
  // } catch (err) {
  //   console.error(err);
  //   return false;
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
export const api_login = ({ email, password }) => {
  // TODO: 구현 필요 (여러 에러처리 포함)
  return {
    success: true,
    userInfo: {
      userId: 1022,
      userName: "OOO",
      email: "",
    },
    tokenInfo: {
      grantType: "Bearer",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access_token_area",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_token_area",
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresIn: 1209600,
    },
  };
};
