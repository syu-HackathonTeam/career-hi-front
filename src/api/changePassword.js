import { api } from ".";

export const api_changePassword = async (data) => {
  // TODO: 비밀번호 변경 API 구현
  // try {
  //   try {
  //   const response = await api.post(`/api/v1/auth/signup`, data);
  //   if (response?.data?.status === "CREATED") {
  //     return {
  //       success: true,
  //       userInfo: response?.data?.user,
  //       tokenInfo: response?.data?.token,
  //     };
  //   } else {
  //     return { success: false, message: response?.data?.message };
  //   }
  // } catch (err) {
  //   console.error(err);
  //   return { success: false };
  // }
  return {
    success: true,
    message: "비밀번호 변경에 성공했습니다.",
  };
};
