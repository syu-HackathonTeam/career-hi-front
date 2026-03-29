import { api } from "./index";

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
  if (!phone) {
    return {
      success: false,
      message: "휴대폰 번호를 확인해 주세요.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  try {
    const response = await api.post(`/api/v1/auth/verify/send`, { phoneNumber: String(phone), type });
    if (response?.data?.status === "SUCCESS") {
      return {
        success: true,
        expiryTime: response?.data?.data?.expiryTime ?? 180,
        message: response?.data?.message,
      };
    }

    return {
      success: false,
      message: response?.data?.message || "인증번호 발송에 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      errorCode: err?.response?.data?.errorCode,
      message: err?.response?.data?.message || "인증번호 발송에 실패했습니다.",
    };
  }
};

export const api_verifyCode = async ({ phoneNumber, authCode, type = "SIGNUP" }) => {
  if (!phoneNumber || !authCode) {
    return {
      success: false,
      message: "인증번호를 확인해 주세요.",
      errorCode: "AUTH_INVALID_CODE",
    };
  }

  try {
    const response = await api.post(`/api/v1/auth/verify/check`, {
      phoneNumber,
      authCode,
      type,
    });

    if (response?.data?.status === "SUCCESS") {
      return { success: true, message: response?.data?.message };
    }

    return {
      success: false,
      message: response?.data?.message || "인증번호 확인에 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "인증번호 확인에 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

/**
 * 회원가입 API
 * @param {*} data
 * @returns
 */
export const api_signup = async (data) => {
  if (!data?.email || !data?.password || !data?.name) {
    return {
      success: false,
      message: "필수 입력값을 확인해 주세요.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  try {
    const response = await api.post(`/api/v1/auth/signup`, data);
    if (response?.data?.status === "CREATED") {
      return {
        success: true,
        userInfo: response?.data?.data?.user,
        tokenInfo: response?.data?.data?.tokenInfo,
        message: response?.data?.message,
      };
    }

    return {
      success: false,
      message: response?.data?.message || "회원가입에 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "회원가입에 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};
