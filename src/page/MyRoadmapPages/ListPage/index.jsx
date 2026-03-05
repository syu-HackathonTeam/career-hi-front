import { useNavigate } from "react-router-dom";
import AlertCP from "../../../component/_common/alertCP";
import HeaderCP from "../../../component/_common/headerCP";
import { useMedia } from "../../../hook/useMedia";
import MainContentLayout from "../../../layout/MainLayout";
import useAlertCP from "../../../hook/useAlertCP";
import HeaderPc from "../../../layout/Header_PC";
import RoadmapChartCP from "../../../component/roadmapCP/roadmapChartCP";
import { useEffect, useState } from "react";
import { useLoginInfo } from "../../../context/LoginInfoContext";
import { api_roadmapListGet, api_roadmapListGrowthGet } from "../../../api/roadmap";
import SpinnersCP from "../../../component/_common/spinnersCP/spinnersCP";
import ButtonCP from "../../../component/_common/buttonCP";
import MainLayout from "../../../layout";

const MyRoadmapListPage = () => {
  const isPc = useMedia().isPc;
  const nav = useNavigate();

  // Alert 관련 상태
  const [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert] = useAlertCP();

  const [listData, setListData] = useState([]);
  const [graphData, setGraphData] = useState({ date: [], rate: [] });
  const [chartAnalysis, setChartAnalysis] = useState("");
  const [loading, setLoading] = useState(true);

  // 스펙 클릭 핸들러
  const onClickGotoReports = (reportId) => {
    setRoadmapReportId(String(reportId));
    nav("/roadmap/result");
  };

  // 로그인 체크 및 데이터 로드
  const { loginInfo, loginCheck, setRoadmapReportId } = useLoginInfo();
  useEffect(() => {
    const fetchData = async () => {
      const result = await loginCheck();
      if (!result?.isLogin) {
        setAlertTitleText("로그인이 필요합니다.");
        setAlertButtonText("로그인/회원가입");
        openAlert();
        setLoading(false);
      } else {
        const resData = await api_roadmapListGet();
        if (!resData?.success) {
          setAlertTitleText(resData?.message || "로드맵 목록을 불러오지 못했습니다.");
          setAlertButtonText("확인");
          openAlert();
          setLoading(false);
          return;
        }

        setListData(resData?.reportHistory || []);

        const growthData = await api_roadmapListGrowthGet();
        setGraphData(growthData?.success ? growthData : { date: [], rate: [] });
        setChartAnalysis(growthData?.chartAnalysis || resData?.chartAnalysis || "");

        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 첫 마운트 때만 실행

  console.log(loginInfo);

  return (
    <div className="relative">
      {/* AlertCP */}
      {isAlertOpen && (
        <AlertCP
          titleText={alertTitleText}
          buttonText={alertButtonText}
          closeButton={closeAlert}
          okButton={() => {
            closeAlert();
            nav("/login");
          }}
        />
      )}
      <div className="fixed hidden w-full h-fit md:block z-999">
        <HeaderPc />
      </div>
      <MainLayout mobile_block={true} page="roadmap_list">
        {!isPc && <HeaderCP>로드맵 보관함</HeaderCP>}
        <div className="pt-18 relative h-full flex flex-col gap-9 py-8 sm:py-0">
          <MainContentLayout page="roadmap_list" fixed={true} scroll={true} footer={true}>
            {loading && <SpinnersCP height={isPc ? "calc(100vh - 5.125rem - 10.25rem)" : "calc(100vh - 22px - 32px)"} size="26" />}
            {!loading && <RoadmapChartCP data={graphData} />}
            {!loading && (
              <div className="w-full p-5.25 mt-8 mb-18 bg-gray-100 rounded-lg">
                <p className="mb-4 B2 text-point-main">그래프 분석</p>
                <p className="text-gray-500 B3">{chartAnalysis || "아직 분석 내용이 없습니다."}</p>
              </div>
            )}

            {!loading && (
              <div>
                <p className="mb-4 H2_bold">이전 로드맵</p>
                {listData.length === 0 && <div className="w-full px-5.25 B3 text-gray-500">생성된 로드맵이 없습니다.</div>}
                {listData.length !== 0 &&
                  listData.map((data, index) => (
                    <div
                      key={index}
                      className="relative flex flex-wrap items-center justify-between w-full h-fit sm:h-full p-4 mb-6 bg-gray-100 rounded-lg sm:p-8">
                      <div className="flex flex-col justify-between h-fit sm:h-full gap-2">
                        <p className="font-bold">
                          {loginInfo?.userData?.userName + "ㆍ"}
                          {data.title?.split(" - ")?.[1] || data.title}
                        </p>
                        <p className="B4 text-point-main">{data.date}</p>
                      </div>
                      <div onClick={() => onClickGotoReports(data.reportId)} className="">
                        <ButtonCP bg="bg-point-main" color="text-white">
                          보고서{isPc && " 다시 보기"}
                          {/* FIXME: 보고서 다시보기 만들기 */}
                        </ButtonCP>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </MainContentLayout>
        </div>
      </MainLayout>
    </div>
  );
};
export default MyRoadmapListPage;
