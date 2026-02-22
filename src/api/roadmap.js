const toUpperSafe = (value) => (typeof value === "string" ? value.trim().toUpperCase() : value);

const mapAcademicStatus = (statusKr) => {
  const map = {
    재학: "ENROLLED",
    휴학: "LEAVE_OF_ABSENCE",
    졸업: "GRADUATED",
    졸업유예: "EXPECTED_GRADUATION",
    중퇴: "DROPOUT",
  };
  return map[statusKr] || "ENROLLED";
};

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

export const api_profileCreate = async ({ profileRequest, portfolioFile }) => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const formData = new FormData();
  //   formData.append("request", new Blob([JSON.stringify(profileRequest)], { type: "application/json" }));
  //   if (portfolioFile) {
  //     formData.append("portfolioFile", portfolioFile);
  //   }
  //
  //   const response = await api.post(`/api/v1/users/me/profile`, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //
  //   if (response?.data?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       updatedAt: response?.data?.data?.updatedAt,
  //       message: response?.data?.message,
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "프로필 등록에 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "프로필 등록에 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  if (!profileRequest?.basicInfo?.name) {
    return {
      success: false,
      message: "프로필 등록에 실패했습니다. 이름을 확인해 주세요.",
      errorCode: "INVALID_INPUT_VALUE",
    };
  }

  return {
    success: true,
    updatedAt: new Date().toISOString(),
    message: portfolioFile ? "프로필 정보가 등록되었습니다. (더미/파일 포함)" : "프로필 정보가 등록되었습니다. (더미)",
  };
};

export const api_profileGet = async () => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.get(`/api/v1/users/me/profile`);
  //   if (response?.data?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       data: response?.data?.data,
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "프로필 조회에 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "프로필 조회에 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  return {
    success: true,
    data: {
      basicInfo: {
        name: "신가연",
        academicStatus: "ENROLLED",
        academicStatusKr: "재학",
        schoolName: "한국대학교",
        major: "컴퓨터공학",
      },
      jobInfo: {
        targetJob: "IT_DATA",
        targetJobKr: "IT/데이터",
        subRoles: ["BACKEND", "DATA_ANALYSIS"],
      },
      specInfo: {
        certificates: ["정보처리기사", "SQLD"],
        languageTests: [{ testName: "OPIc", score: "IM2", grade: null }],
        awards: [{ contestName: "교내 해커톤", awardName: "금상" }],
        codingLanguages: ["JAVA", "PYTHON"],
      },
      portfolio: {
        url: "https://github.com/lovesome-gy",
        fileName: "portfolio_dummy.pdf",
      },
    },
  };
};

export const buildProfileRequestFromCreateForm = ({
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
}) => ({
  basicInfo: {
    name: name?.trim() || "",
    academicStatus: mapAcademicStatus(univSituation),
    schoolName: univ?.trim() || "",
    major: department?.trim() || "",
  },
  jobInfo: {
    targetJob: mapTargetJob(hopeJobGroupLabel),
    subRoles: (hopeJobDetail || []).map(mapSubRole).filter(Boolean),
  },
  specInfo: {
    certificates: qualificationsList || [],
    languageTests: (languageQualifications || [])
      .filter((item) => item?.examName && item?.score)
      .map((item) => {
        const raw = String(item.score);
        const isNumericScore = /^\d+(\.\d+)?$/.test(raw);
        return {
          testName: item.examName,
          score: isNumericScore ? raw : null,
          grade: isNumericScore ? null : raw,
        };
      }),
    awards: (premiers || [])
      .filter((item) => item?.title && item?.rank)
      .map((item) => ({
        contestName: item.title,
        awardName: item.rank,
      })),
    codingLanguages: (planguagesList || []).map((lang) => toUpperSafe(lang)),
  },
});

export const api_reportAnalyze = async () => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.post(`/api/v1/reports/analyze`);
  //
  //   if (response?.data?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       reportId: response?.data?.data?.reportId,
  //       message: response?.data?.message,
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "로드맵 생성에 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "로드맵 생성에 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  return {
    success: true,
    reportId: 550,
    message: "로드맵 생성이 완료되었습니다. (더미)",
  };
};

export const api_roadmapListGet = async () => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.get(`/api/v1/reports`);
  //
  //   if (response?.data?.status === "SUCCESS") {
  //     const data = response?.data?.data || {};
  //     return {
  //       success: true,
  //       growthChart: data?.growthChart || [],
  //       chartAnalysis: data?.chartAnalysis || "",
  //       reportHistory: data?.reportHistory || [],
  //       pagination: data?.pagination || null,
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "로드맵 목록을 불러오는데 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "로드맵 목록을 불러오는데 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  return {
    success: true,
    growthChart: [
      { date: "2025.11.02", matchRate: 13 },
      { date: "2025.11.27", matchRate: 25 },
      { date: "2026.01.03", matchRate: 40 },
    ],
    chartAnalysis: "신가연 님은 꾸준히 우상향 그래프를 그리고 있어요. 지난달 대비 15% 성장했습니다. (더미)",
    reportHistory: [
      {
        reportId: 550,
        title: "신가연 - 데이터 엔지니어",
        date: "2026.01.03",
        matchRate: 40,
        canViewSpec: true,
        canViewReport: true,
      },
      {
        reportId: 410,
        title: "신가연 - 백엔드 개발자",
        date: "2025.11.27",
        matchRate: 25,
        canViewSpec: true,
        canViewReport: true,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalElements: 2,
    },
  };
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
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.get(`/api/v1/reports/${reportId}`);
  //
  //   if (response?.data?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       data: response?.data?.data,
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "로드맵 상세를 불러오는데 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "로드맵 상세를 불러오는데 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  const detailMap = {
    550: {
      reportId: 550,
      userName: "윤혜원",
      targetJob: "데이터 엔지니어",
      matchRate: 40,
      createdAt: "2026-01-03",
      // 그래프 하단 코멘트
      overallComment:
        "최근 데이터 엔지니어가 많이 공고에서 요구하는 스펙을 일정 수준 가졌지만, 다른 경쟁자들에 비해 경쟁력이 약해요. 서류 단계에서 불합격할 확률이 높은 상태에요. 아래에서 Career-Hi가 상세히 짚어줄 테니 부족한 필수 스택을 확인하고 꿈을 향해 더 달려가 보세요!",

      // 자격증
      certificateAnalysis: {
        title: "최근 데이터 엔지니어 직군에서 요구되는 자격증이에요",
        // 미 보유중
        required: ["빅데이터분석기사", "SQLD"],
        // 보유중
        preferred: ["ADsP"],
        // 동향
        industryTrend:
          "최근 올라온 데이터 엔지니어 직군 공고 중 5곳에서 빅데이터분석기사, ADsP, SQLD 자격증을 요구하고 있어요. 이 세 가지 자격증을 요구하는 기업 중에는 카카오 등 국내 주요 대기업이 포함되어 있어요.",
        // 방향성
        coaching:
          "이 세 가지 자격증이 모두 필요한 건 아니에요. 윤혜원 님은 이미 ADsP 자격증을 취득하셨으니 SQLD 취득을 추천해요. 두 자격증만으로 충분히 경쟁력이 생길 거예요.",
      },
      // 취업시장
      awardAnalysis: {
        //타이틀
        title: "신가연 님의 수상 경력은 현재 취업시장에서 불리해요",
        // 차트
        charts: [
          {
            label: "직무 관련 수상 경력 우대",
            userPercent: 70,
            otherPercent: 30,
          },
          {
            label: "교외 활동 우대",
            userPercent: 62,
            otherPercent: 38,
          },
        ],
        // 동향
        industryTrend: {
          summary: "데이터 엔지니어 직군 공고를 분석한 결과 교외 대회에서 수상한 경험이 중요한 스펙으로 작용하고 있어요. 우대하는 주요 조건은 다음과 같아요.",
          details: ["2년 이내 수상한 경력일 것", "교내가 아닌 외부 공모전일 것"],
        },
        // 방향성
        coaching: {
          summary:
            "신가연 님의 수상 경력은 모두 교내로 분류되어 있어 상대적으로 메리트가 약해요. 자격증 취득을 통해 직무 관련 지식을 높이고 외부 공모전 당선 확률을 높이는 걸 추천 할게요. 또한 개인이 수상한 경험보다 팀을 이뤄 협업한 경험이 필요해요. 팀원 협업과 수상 경력을 통해 채울 수 있는 루트를 찾아드릴게요.",
          details: ["커리큘럼에 팀 대회가 포함되어있는 대외활동, 부트캠프 참여하기", "교외 공모전 팀 빌딩 플랫폼 활용하기"],
        },
      },
      // 스킬
      skillGap: {
        title: "필수 스택, 어디까지 달성하셨나요?",
        // 달성한 스택
        items: [
          {
            badgeTitle: "TOEIC",
            badgeValue: "914/850",
            // 달성
            isAchieved: true,
            contentTitle: "어학 성적",
            contentDescription:
              "데이터 엔지니어 직군 필수 어학 성적을 달성했어요. 하지만 만료 기한에 주의하고, 실무 자격증을 딸 수 있도록 꾸준히 학습으로 남겨두는 것이 좋아요.",
          },
        ],
      },
      // 포트폴리오
      portfolioAnalysis: {
        title: "신가연 님의 포트폴리오를 분석했어요",
        isPositive: false,
        analysisResult:
          "신가연 님의 사용 언어인 C언어의 비중이 부실해요. 또한 협업 경험 없이 개인의 스터디 내용 위주로 구성되어 있어 실무 경험이 잘 나타나지 않았어요. 전체적인 분량이 부족하며, 형식을 준수하는 것이 중요해요. 요즘 기업에서 요구하는 파일 형식과 달라 좋은 첫인상을 주기 힘들어 보여요.",
        feedbackList: ["C언어 사용 프로젝트 추가", "협업 경험 중심", "분량 00000자로 증량", "파일 형식 준수 (zip, pdf)"],
      },
    },
    410: {
      reportId: 410,
      userName: "신가연",
      targetJob: "백엔드 개발자",
      matchRate: 25,
      createdAt: "2025.11.27",
      certificateAnalysis: {
        title: "백엔드 직군 우대 자격증을 보완해 보세요",
        required: ["정보처리기사"],
        preferred: ["SQLD"],
      },
      skillGap: {
        title: "핵심 백엔드 스택을 점검해 보세요",
        completedSkills: ["Java"],
        missingSkills: ["Spring", "Docker"],
      },
      portfolioAnalysis: {
        isPositive: false,
        summary: "배포 경험을 보강하면 더 좋아요",
      },
    },
  };

  return {
    success: true,
    data: detailMap[Number(reportId)] || detailMap[550],
  };
};

export const api_reportDelete = async (reportId) => {
  // NOTE: API 서버 연결 불가로 실제 요청은 잠시 주석 처리
  // try {
  //   const response = await api.delete(`/api/v1/reports/${reportId}`);
  //
  //   if (response?.data?.status === "SUCCESS") {
  //     return {
  //       success: true,
  //       message: response?.data?.message || "리포트가 성공적으로 삭제되었습니다.",
  //     };
  //   }
  //
  //   return {
  //     success: false,
  //     message: response?.data?.message || "리포트 삭제에 실패했습니다.",
  //     errorCode: response?.data?.errorCode,
  //   };
  // } catch (err) {
  //   return {
  //     success: false,
  //     message: err?.response?.data?.message || "리포트 삭제에 실패했습니다.",
  //     errorCode: err?.response?.data?.errorCode,
  //   };
  // }

  return {
    success: true,
    message: `리포트(${reportId})가 성공적으로 삭제되었습니다. (더미)`,
  };
};
