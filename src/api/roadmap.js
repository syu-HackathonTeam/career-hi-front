import { api } from "./index.js";

export const api_roadmapListGet = async () => {
  // try {
  //   const response = await api.get(`/api/v1/reports`);

  //   if (response?.data?.status === "SUCCESS") {
  //     return response?.data?.reports || [];
  //   } else {
  //     alert(response?.data?.message || "로드맵 목록을 불러오는데 실패했습니다.");
  //     return [];
  //   }

  //   // eslint-disable-next-line no-unused-vars
  // } catch (error) {
  //   alert("로드맵 목록을 불러오는데 실패했습니다.");
  //   return [];
  // }

  // FIXME: 임시 데이터 반환 (실제 API 호출 시 제거)
  return [
    {
      reportId: 550,
      userName: "신가연",
      targetJob: "데이터 엔지니어",
      matchRate: 40,
      generatedAt: "2026.01.03",
      links: {
        specDetail: "/api/v1/users/me/profile",
        reportDetail: "/api/v1/reports/result/550",
      },
    },
    {
      reportId: 410,
      targetJob: "데이터 엔지니어",
      matchRate: 25,
      generatedAt: "2025.11.27",
      links: {
        specDetail: "/api/v1/users/me/profile",
        reportDetail: "/api/v1/reports/result/410",
      },
    },
    {
      reportId: 320,
      targetJob: "데이터 엔지니어",
      matchRate: 13,
      generatedAt: "2025.11.02",
      links: {
        specDetail: "/api/v1/users/me/profile",
        reportDetail: "/api/v1/reports/result/320",
      },
    },
  ];
};

export const api_roadmapListGrowthGet = async () => {
  // try {
  //   const response = await api.get(`/api/v1/reports/growth`);

  //   if (response?.status === "SUCCESS") {
  // const processedData = {
  //   date: response?.data.growthChart.map((item) => item.date),
  //   rate: response?.data.growthChart.map((item) => item.rate),
  // };
  //     return processedData || { date: [], rate: [] };
  //   } else {
  //     return [];
  //   }
  // } catch (error) {
  //   console.error("Error fetching roadmap growth data:", error);
  //   return [];
  // }

  const rawData = [
    // 그래프 렌더링용 데이터 (최신순 3개)
    { date: "2025.11.02", rate: 13 },
    { date: "2025.11.27", rate: 25 },
    { date: "2026.01.03", rate: 40 },
  ];

  // 데이터를 가공
  const processedData = {
    date: rawData.map((item) => item.date),
    rate: rawData.map((item) => item.rate),
  };

  return processedData || { date: [], rate: [] };
};

export const api_roadmapDetailGet = async () => {};
