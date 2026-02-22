export const api_changePassword = async (data) => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.patch(`/api/v1/auth/password/reset`, {
  //     email: data?.email,
  //     phoneNumber: data?.phoneNumber,
  //     authCode: data?.authCode,
  //     newPassword: data?.newPassword,
  //   });
  //
  //   if (response?.data?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       message: response?.data?.message || "비밀번호가 성공적으로 변경되었습니다.",
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "비밀번호 변경에 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "비밀번호 변경에 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  if (!data?.email || !data?.newPassword) {
    return {
      success: false,
      message: "입력값을 확인해 주세요.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  return {
    success: true,
    message: "비밀번호가 성공적으로 변경되었습니다. (더미)",
  };
};
