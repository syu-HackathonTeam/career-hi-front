import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { api_uploadFile, api_deleteFile } from "../../../api/file";

/**
 * 파일 업로드 공통 컴포넌트
 * @param {Object} props
 * @param {function} props.onFileSelect - 파일 선택 시 호출되는 콜백 (files: { name: string, url: string }[])
 * @param {string} [props.accept] - 허용 파일 타입 (예: "image/*", ".pdf,.doc")
 * @param {boolean} [props.multiple=false] - 다중 파일 선택 허용
 * @param {string} [props.placeholder="파일 선택"] - 버튼 텍스트
 * @param {boolean} [props.disabled=false] - 비활성화
 * @param {number} [props.maxFiles] - 최대 파일 개수
 * @param {number} [props.maxSizeMB] - 최대 파일 크기(MB)
 * @param {function} [props.validateFiles] - 추가 검증 함수 (files: File[]) => string | null
 * @param {function} [props.onError] - 에러 발생 시 콜백 (message: string)
 * @param {boolean} [props.showError=true] - 에러 메시지 표시 여부
 */
const FileUploadCP = ({
  onFileSelect,
  accept,
  multiple = false,
  placeholder = "파일 선택",
  disabled = false,
  maxFiles,
  maxSizeMB,
  validateFiles,
  onError,
  showError = true,
}) => {
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const getAcceptList = () => {
    if (!accept) return [];
    return accept
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const isFileAccepted = (file, acceptRule) => {
    const lowerRule = acceptRule.toLowerCase();
    const fileName = (file?.name || "").toLowerCase();
    const fileType = (file?.type || "").toLowerCase();

    if (lowerRule.startsWith(".")) {
      return fileName.endsWith(lowerRule);
    }

    if (lowerRule.endsWith("/*")) {
      const prefix = lowerRule.replace("*", "");
      return fileType.startsWith(prefix);
    }

    return fileType === lowerRule;
  };

  const validateSelectedFiles = (files) => {
    if (!files || files.length === 0) return null;

    if (typeof maxFiles === "number" && files.length + selectedFiles.length > maxFiles) {
      return `최대 ${maxFiles}개까지 업로드할 수 있습니다.`;
    }

    if (typeof maxSizeMB === "number") {
      const maxBytes = maxSizeMB * 1024 * 1024;
      const oversizeFile = files.find((file) => file.size > maxBytes);
      if (oversizeFile) {
        return `파일 크기는 ${maxSizeMB}MB 이하만 업로드할 수 있습니다.`;
      }
    }

    const acceptList = getAcceptList();
    if (acceptList.length > 0) {
      const invalidFile = files.find((file) => !acceptList.some((rule) => isFileAccepted(file, rule)));
      if (invalidFile) {
        return "허용되지 않는 파일 형식입니다.";
      }
    }

    if (typeof validateFiles === "function") {
      const customError = validateFiles(files);
      if (customError) return customError;
    }

    return null;
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const error = validateSelectedFiles(fileArray);

      if (error) {
        setErrorMessage(error);
        if (onError) onError(error);
        return;
      }

      setErrorMessage("");

      try {
        const uploadResults = await Promise.all(
          fileArray.map(async (file) => {
            const data = await api_uploadFile(file);
            const url = data?.url || data?.fileUrl || data?.location || "";
            return {
              name: file.name,
              url,
            };
          }),
        );

        const newSelectedFiles = [...selectedFiles, ...uploadResults];
        setSelectedFiles(newSelectedFiles);

        if (onFileSelect) {
          onFileSelect(newSelectedFiles);
        }
      } catch (uploadError) {
        const message = "파일 업로드에 실패했습니다.";
        setErrorMessage(message);
        if (onError) onError(message);
      }
    }
  };

  const handleRemoveFile = async (index) => {
    const targetFile = selectedFiles[index];
    if (!targetFile?.url) return;

    try {
      const result = await api_deleteFile(targetFile.url);
      const isSuccess = result?.success ?? true;

      if (!isSuccess) {
        const message = "파일 삭제에 실패했습니다.";
        setErrorMessage(message);
        if (onError) onError(message);
        return;
      }

      const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newSelectedFiles);

      if (onFileSelect) {
        onFileSelect(newSelectedFiles);
      }
    } catch (deleteError) {
      const message = "파일 삭제에 실패했습니다.";
      setErrorMessage(message);
      if (onError) onError(message);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fileUploadCP">
      <div
        style={{
          backgroundColor: disabled ? "#d6d6d6" : "white",
        }}
        onClick={handleButtonClick}
        className="B4 cursor-pointer text-point-text w-full h-12 py-4 px-5 rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-none">
        {placeholder}
        <input ref={fileInputRef} type="file" accept={accept} multiple={multiple} onChange={handleFileChange} style={{ display: "none" }} disabled={disabled} />
      </div>
      <div className="mt-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-[#F0F9EB] p-2 rounded mb-2">
            <span className="B4 text-point-main">{file.name}</span>
            <button type="button" className="text-point-main cursor-pointer" onClick={() => handleRemoveFile(index)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        ))}
      </div>
      {showError && errorMessage && <p className="text-[12px] text-point-error pt-1">{errorMessage}</p>}
    </div>
  );
};

export default FileUploadCP;
