/**
 * 회원가입 인증번호 발송 API
 * @param {*} phone 핸드폰 번호
 * @returns 
 * {
  "status": "SUCCESS",
  "message": "인증번호가 발송되었습니다.",
  "data": {
    "expiryTime": 180 // 3분(초 단위)
  }
}
 */
export const api_signupCertification = async (phone, type = "SIGNUP") => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.post(`/api/v1/auth/verify/send`, { phoneNumber: String(phone), type });
  //   if (response?.data?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       expiryTime: response?.data?.data?.expiryTime ?? 180,
  //     };
  //   } else {
  //     return {
  //       success: false,
  //       message: response?.data?.message || "인증번호 발송에 실패했습니다.",
  //     };
  //   }
  // } catch (err) {
  //   return {
  //     success: false,
  //     errorCode: err?.response?.data?.errorCode,
  //     message: err?.response?.data?.message || "인증번호 발송에 실패했습니다.",
  //   };
  // }

  if (!phone) {
    return {
      success: false,
      message: "휴대폰 번호를 확인해 주세요.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  return {
    success: true,
    expiryTime: 180,
    message: `인증번호가 발송되었습니다. (더미: ${type})`,
  };
};

export const api_verifyCode = async ({ phoneNumber, authCode, type = "SIGNUP" }) => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.post(`/api/v1/auth/verify/check`, {
  //     phoneNumber,
  //     authCode,
  //     type,
  //   });
  //
  //   if (response?.data?.status === "SUCCESS") {
  //     return { success: true, message: response?.data?.message };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "인증번호 확인에 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "인증번호 확인에 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  if (!phoneNumber || !authCode) {
    return {
      success: false,
      message: "인증번호를 확인해 주세요.",
      errorCode: "AUTH_INVALID_CODE",
    };
  }

  const isValidCode = String(authCode) === "123456";
  if (!isValidCode) {
    return {
      success: false,
      message: "인증번호가 일치하지 않습니다.",
      errorCode: "AUTH_INVALID_CODE",
    };
  }

  return {
    success: true,
    message: `인증이 완료되었습니다. (더미: ${type})`,
  };
};

/**
 * 회원가입 API
 * @param {*} data
 * @returns
 */
export const api_signup = async (data) => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.post(`/api/v1/auth/signup`, data);
  //   if (response?.data?.status === "CREATED") {
  //     return {
  //       success: true,
  //       userInfo: response?.data?.data?.user,
  //       tokenInfo: response?.data?.data?.tokenInfo,
  //       message: response?.data?.message,
  //     };
  //   } else {
  //     return { success: false, message: response?.data?.message, errorCode: response?.data?.errorCode };
  //   }
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "회원가입에 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  if (!data?.email || !data?.password || !data?.name) {
    return {
      success: false,
      message: "필수 입력값을 확인해 주세요.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  return {
    success: true,
    message: "회원가입이 완료되었습니다. 환영합니다! (더미)",
    userInfo: {
      userId: 1022,
      userName: data?.name,
      email: data?.email,
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
