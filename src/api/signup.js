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
export const api_signupCertification = async (phone) => {
  try {
    const response = await api.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/verify/send`, { phoneNumber: String(phone) });
    if (response?.data?.status === "SUCCESS") {
      return true;
    } else {
      alert(response?.data?.message);
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  // return true;
};

/**
 * 회원가입 API
 * @param {*} data
 * @returns
 */
export const api_signup = async (data) => {
  try {
    const response = await api.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, data);
    if (response?.data?.status === "CREATED") {
      return {
        success: true,
        userInfo: response?.data?.user,
        tokenInfo: response?.data?.token,
      };
    } else {
      return { success: false, message: response?.data?.message };
    }
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
