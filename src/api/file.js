import { api } from "./index";

const MAX_UPLOAD_FILE_SIZE_MB = 10;
const MAX_UPLOAD_FILE_SIZE_BYTES = MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024;
const SUCCESS_STATUS = new Set(["SUCCESS", "OK", "200"]);

const isSuccessStatus = (status) => {
  if (typeof status === "number") {
    return status >= 200 && status < 300;
  }

  if (!status) return false;
  return SUCCESS_STATUS.has(String(status).toUpperCase());
};

const normalizeFileUploadData = (payload) => {
  const data = payload?.data || payload;

  return {
    fileName: data?.FileName || data?.fileName || "",
    fileUrl: data?.FileUrl || data?.fileUrl || "",
  };
};

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

  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    return {
      success: false,
      message: `포트폴리오 파일은 ${MAX_UPLOAD_FILE_SIZE_MB}MB 이하만 업로드할 수 있습니다.`,
      fileName: null,
      fileUrl: null,
      errorCode: "FILE_TOO_LARGE",
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
    const { fileName, fileUrl } = normalizeFileUploadData(payload);
    const hasSuccessStatus = isSuccessStatus(payload?.status);
    const isHttpSuccess = response?.status >= 200 && response?.status < 300;

    if ((hasSuccessStatus || isHttpSuccess) && fileUrl) {
      return {
        success: true,
        message: payload?.message || "파일 업로드가 완료되었습니다.",
        fileName: fileName || file?.name || "",
        fileUrl,
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
export const api_deleteFile = async (fileName) => {
  if (!fileName) {
    return {
      success: false,
      message: "삭제할 파일 이름이 없습니다.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  try {
    const response = await api.delete(`/api/v1/files`, {
      params: { fileName },
    });
    const payload = response?.data;
    const hasSuccessStatus = isSuccessStatus(payload?.status);
    const isHttpSuccess = response?.status >= 200 && response?.status < 300;

    if (hasSuccessStatus || isHttpSuccess) {
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
