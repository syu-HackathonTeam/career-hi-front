import { api } from "./index";

// 파일 업로드
export const api_uploadFile = async (file) => {
  if (!file) {
    return {
      success: false,
      message: "업로드할 파일이 없습니다.",
      fileName: null,
      fileUrl: null,
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/api/v1/files/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response?.data;
    const data = payload?.data;

    if (payload?.status === "SUCCESS" && data?.FileUrl) {
      return {
        success: true,
        message: payload?.message || "파일 업로드가 완료되었습니다.",
        fileName: data?.FileName || file?.name || "",
        fileUrl: data?.FileUrl,
      };
    }

    return {
      success: false,
      message: payload?.message || "파일 업로드에 실패했습니다.",
      fileName: null,
      fileUrl: null,
      errorCode: payload?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "파일 업로드에 실패했습니다.",
      fileName: null,
      fileUrl: null,
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

// 파일 삭제
export const api_deleteFile = async (fileUrl) => {
  if (!fileUrl) {
    return {
      success: false,
      message: "삭제할 파일 URL이 없습니다.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  try {
    const response = await api.delete(`/api/v1/files`, {
      data: { fileUrl },
    });
    const payload = response?.data;

    if (payload?.status === "SUCCESS") {
      return {
        success: true,
        message: payload?.message || "파일이 삭제되었습니다.",
      };
    }

    return {
      success: false,
      message: payload?.message || "파일 삭제에 실패했습니다.",
      errorCode: payload?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "파일 삭제에 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};
