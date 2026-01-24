import { api } from "./index";

// 파일 업로드
export const api_uploadFile = async (file) => {
  // const formData = new FormData();
  // formData.append("file", file);

  // const response = await api.post("/files", formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });

  // return response.data;

  return { success: true, url: "임시주소" };
};

// 파일 삭제
export const api_deleteFile = async (fileUrl) => {
  // const response = await api.delete("/files", {
  //   data: { url: fileUrl },
  // });

  // return response.data;

  return { success: true };
};
