import { api } from "./index";

const toUpperSafe = (value) => (typeof value === "string" ? value.trim().toUpperCase() : value);

const isSuccessStatus = (status) => status === "SUCCESS" || status === "CREATED";

const mapTargetJob = (groupKr) => {
  const map = {
    ITㆍ데이터: "IT_DATA",
    "IT/데이터": "IT_DATA",
  };
  return map[groupKr] || "IT_DATA";
};

const mapSubRole = (roleKr) => {
  const map = {
    "개발 PM": "SERVER_PM",
    "데이터 분석": "DATA_ANALYSIS",
    프론트엔드: "FRONTEND",
    백엔드: "BACKEND",
    "데이터 엔지니어": "DATA_ENGINEER",
    보안: "SECURITY",
  };
  return map[roleKr] || toUpperSafe(roleKr)?.replaceAll(" ", "_");
};

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const pickChangedFields = (prev = {}, next = {}) => {
  const changed = {};
  Object.keys(next || {}).forEach((key) => {
    if (!isEqual(prev?.[key], next?.[key])) {
      changed[key] = next[key];
    }
  });
  return changed;
};

export const api_profileCreate = async ({ profileRequest }) => {
  if (!profileRequest?.basicInfo?.name) {
    return {
      success: false,
      message: "프로필 등록에 실패했습니다. 이름을 확인해 주세요.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  try {
    console.log(profileRequest);
    const response = await api.post(`/api/v1/users/me/profile`, profileRequest);

    if (isSuccessStatus(response?.data?.status)) {
      return {
        success: true,
        updatedAt: response?.data?.data?.updatedAt,
        message: response?.data?.message,
      };
    }

    return {
      success: false,
      message: response?.data?.message || "프로필 등록에 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "프로필 등록에 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

export const api_profileGet = async () => {
  try {
    const response = await api.get(`/api/v1/users/me/profile`);
    if (isSuccessStatus(response?.data?.status) && response?.data?.data) {
      return response?.data?.data;
    }

    return null;
  } catch (err) {
    console.error("프로필 조회 실패:", err);
    return null;
  }
};

// {
//     "basicInfo": {
//         "name": "이영규",
//         "academicStatus": "ENROLLED",
//         "schoolName": "삼육대학교",
//         "major": "데이터클라우드공학과",
//         "grade": "",
//         "semester": ""
//     },
//     "jobInfo": {
//         "targetJob": "IT_DATA",
//         "subRoles": [
//             "FRONTEND"
//         ]
//     },
//     "specInfo": {
//         "certificates": [
//             "SQLD (SQL 개발자)",
//             "마이크로소프트 Azure Fundamentals (AZ-900)",
//             "마이크로소프트 Azure Data Fundamentals (DP-900)"
//         ],
//         "languageTests": [],
//         "awards": [
//             {
//                 "contestName": "SW 경진대회",
//                 "awardName": "최우수상"
//             }
//         ],
//         "codingLanguages": [
//             "JAVASCRIPT",
//             "REACT"
//         ]
//     },
//     "portfolioUrl": ""
// }

/**
 * 폼 입력값을 백엔드 요구 JSON 포맷으로 변환
 * @param {object} params - 폼 입력값
 * @returns {object} 백엔드 요구 포맷
 *
 * 매핑 예시:
 * {
 *   basicInfo: {
 *     name: name, // 이름
 *     academicStatus: mapAcademicStatus(univSituation), // 학적 상태(코드)
 *     schoolName: univ, // 학교명
 *     major: department, // 전공
 *     grade: grade, // 학년(코드)
 *     semester: semester, // 학기(코드)
 *   },
 *   jobInfo: {
 *     targetJob: mapTargetJob(hopeJobGroupLabel), // 희망 직군(코드)
 *     subRoles: hopeJobDetail, // 세부 직군(코드 배열)
 *   },
 *   specInfo: {
 *     certificates: qualificationsList, // 자격증 배열
 *     languageTests: languageQualifications, // 어학시험 배열
 *     awards: premiers, // 수상내역 배열
 *     codingLanguages: planguagesList, // 사용언어 배열
 *   },
 *   portfolioUrl: portfolioUrl // 포트폴리오 URL
 * }
 */
export const buildProfileRequestFromCreateForm = ({
  //FIXME: 최종학럭, 대학 타입 구분 없음
  univLevel,
  univType,
  name,
  univ,
  department,
  univSituation,
  hopeJobGroupLabel,
  hopeJobDetail,
  qualificationsList,
  languageQualifications,
  premiers,
  planguagesList,
  portfolioUrl,
  portfolioFileName,
  portfolioFileUrl,
}) => ({
  basicInfo: {
    name: name?.trim() || "", // 이름
    academicStatus: univSituation, // 학적 상태(한글 그대로)
    schoolName: univ?.trim() || "", // 학교명
    major: department?.trim() || "", // 전공
    educationLevel: univLevel?.trim() || "", // 학력 수준 (코드)
    schoolType: univType?.trim() || "", // 학교 유형 (코드)
  },
  jobInfo: {
    targetJob: mapTargetJob(hopeJobGroupLabel), // 희망 직군(코드)
    subRoles: (hopeJobDetail || []).map(mapSubRole).filter(Boolean), // 세부 직군(코드 배열)
  },
  specInfo: {
    certificates: qualificationsList || [], // 자격증 배열
    languageTests: (languageQualifications || [])
      .filter((item) => (item?.testName || item?.examName) && (item?.score || item?.grade))
      .map((item) => {
        const testName = item.testName || item.examName;
        const rawScore = item.score;
        const rawGrade = item.grade;
        const fallbackRaw = String(rawScore ?? rawGrade ?? "");
        const isNumericScore = /^\d+(\.\d+)?$/.test(fallbackRaw);

        // 우선순위: grade/score 명시값 -> 숫자 판별 기반 fallback
        const score = rawScore != null && rawScore !== "" ? String(rawScore) : isNumericScore ? fallbackRaw : null;
        const grade = rawGrade != null && rawGrade !== "" ? String(rawGrade) : isNumericScore ? null : fallbackRaw;

        return {
          testName, // 시험명
          score, // 점수
          grade, // 등급
        };
      }),
    awards: (premiers || [])
      .filter((item) => item?.title && item?.rank)
      .map((item) => ({
        contestName: item.title, // 대회명
        awardName: item.rank, // 수상명
      })),
    codingLanguages: (planguagesList || []).map((lang) => toUpperSafe(lang)), // 사용언어(대문자)
  },
  portfolio: {
    Url: portfolioUrl || "",
    FileName: portfolioFileName || "",
    FileUrl: portfolioFileUrl || "",
  },
});

/**
 * 기존 프로필과 현재 요청을 비교해 변경된 필드만 추출
 */
export const buildProfilePatchRequest = ({ previousProfile, currentProfileRequest }) => {
  const patchRequest = {};

  const changedBasicInfo = pickChangedFields(previousProfile?.basicInfo || {}, currentProfileRequest?.basicInfo || {});
  if (Object.keys(changedBasicInfo).length > 0) {
    patchRequest.basicInfo = changedBasicInfo;
  }

  const changedJobInfo = pickChangedFields(previousProfile?.jobInfo || {}, currentProfileRequest?.jobInfo || {});
  if (Object.keys(changedJobInfo).length > 0) {
    patchRequest.jobInfo = changedJobInfo;
  }

  const changedSpecInfo = pickChangedFields(previousProfile?.specInfo || {}, currentProfileRequest?.specInfo || {});
  if (Object.keys(changedSpecInfo).length > 0) {
    patchRequest.specInfo = changedSpecInfo;
  }

  const prevPortfolio = {
    Url: previousProfile?.portfolio?.Url ?? previousProfile?.portfolio?.url ?? "",
    FileName: previousProfile?.portfolio?.FileName ?? previousProfile?.portfolio?.fileName ?? "",
    FileUrl: previousProfile?.portfolio?.FileUrl ?? previousProfile?.portfolio?.fileUrl ?? previousProfile?.portfolioFileUrl ?? "",
  };
  const nextPortfolio = currentProfileRequest?.portfolio;

  if (typeof nextPortfolio !== "undefined" && !isEqual(prevPortfolio, nextPortfolio)) {
    patchRequest.portfolio = nextPortfolio;
  }

  return patchRequest;
};

/**
 * 프로필 부분 수정 (PATCH)
 * URL: PATCH /api/v1/users/me/profile
 * application/json
 * - 변경된 필드만 포함한 JSON
 */
export const api_profilePatch = async ({ patchRequest }) => {
  const hasPatchFields = patchRequest && Object.keys(patchRequest).length > 0;
  if (!hasPatchFields) {
    return {
      success: true,
      updatedAt: null,
      message: "변경된 항목이 없습니다.",
      noChanges: true,
    };
  }

  try {
    const response = await api.patch(`/api/v1/users/me/profile`, patchRequest);

    if (isSuccessStatus(response?.data?.status)) {
      return {
        success: true,
        updatedAt: response?.data?.data?.updatedAt,
        message: response?.data?.message,
      };
    }

    return {
      success: false,
      message: response?.data?.message || "프로필 수정에 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "프로필 수정에 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

export const api_reportAnalyze = async () => {
  try {
    const response = await api.post(`/api/v1/reports/analyze`);

    if (isSuccessStatus(response?.data?.status)) {
      return {
        success: true,
        reportId: response?.data?.data?.reportId,
        message: response?.data?.message,
      };
    }

    return {
      success: false,
      message: response?.data?.message || "로드맵 생성에 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "로드맵 생성에 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

export const api_roadmapListGet = async () => {
  try {
    const response = await api.get(`/api/v1/reports`);

    if (isSuccessStatus(response?.data?.status)) {
      const data = response?.data?.data || {};
      return {
        success: true,
        growthChart: data?.growthChart || [],
        chartAnalysis: data?.chartAnalysis || "",
        reportHistory: data?.reportHistory || [],
        pagination: data?.pagination || null,
      };
    }

    return {
      success: false,
      message: response?.data?.message || "로드맵 목록을 불러오는데 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "로드맵 목록을 불러오는데 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

export const api_roadmapListGrowthGet = async () => {
  const response = await api_roadmapListGet();
  if (!response?.success) {
    return {
      success: false,
      date: [],
      rate: [],
      chartAnalysis: "",
      message: response?.message,
      errorCode: response?.errorCode,
    };
  }

  const chart = response?.growthChart || [];
  return {
    success: true,
    date: chart.map((item) => item.date),
    rate: chart.map((item) => item.matchRate),
    chartAnalysis: response?.chartAnalysis || "",
  };
};

export const api_roadmapDetailGet = async (reportId) => {
  try {
    const response = await api.get(`/api/v1/reports/${reportId}`);

    if (isSuccessStatus(response?.data?.status)) {
      return {
        success: true,
        data: response?.data?.data,
      };
    }

    return {
      success: false,
      message: response?.data?.message || "로드맵 상세를 불러오는데 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "로드맵 상세를 불러오는데 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};

export const api_reportDelete = async (reportId) => {
  try {
    const response = await api.delete(`/api/v1/reports/${reportId}`);

    if (isSuccessStatus(response?.data?.status)) {
      return {
        success: true,
        message: response?.data?.message || "리포트가 성공적으로 삭제되었습니다.",
      };
    }

    return {
      success: false,
      message: response?.data?.message || "리포트 삭제에 실패했습니다.",
      errorCode: response?.data?.errorCode,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "리포트 삭제에 실패했습니다.",
      errorCode: err?.response?.data?.errorCode,
    };
  }
};
