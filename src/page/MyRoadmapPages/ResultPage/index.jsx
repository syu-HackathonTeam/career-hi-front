import { useNavigate } from "react-router-dom";
import { useMedia } from "../../../hook/useMedia";
import useAlertCP from "../../../hook/useAlertCP";
import AlertCP from "../../../component/_common/alertCP";
import HeaderPc from "../../../layout/Header_PC";
import HeaderCP from "../../../component/_common/headerCP";
import MainContentLayout from "../../../layout/MainLayout";
import { useEffect, useState } from "react";
import SpinnersCP from "../../../component/_common/spinnersCP/spinnersCP";
import { useLoginInfo } from "../../../context/LoginInfoContext";
import { api_roadmapDetailGet } from "../../../api/roadmap";

import percentage_0 from "../../../assets/image/percentage/0.svg";
import percentage_10 from "../../../assets/image/percentage/10.svg";
import percentage_20 from "../../../assets/image/percentage/20.svg";
import percentage_30 from "../../../assets/image/percentage/30.svg";
import percentage_40 from "../../../assets/image/percentage/40.svg";
import percentage_50 from "../../../assets/image/percentage/50.svg";
import percentage_60 from "../../../assets/image/percentage/60.svg";
import percentage_70 from "../../../assets/image/percentage/70.svg";
import percentage_80 from "../../../assets/image/percentage/80.svg";
import percentage_90 from "../../../assets/image/percentage/90.svg";
import percentage_100 from "../../../assets/image/percentage/100.svg";

import portfolio_img from "../../../assets/image/portfolio.png";
import ButtonCP from "../../../component/_common/buttonCP";

const MyRoadmapResultPage = () => {
  const percentageImages = {
    0: percentage_0,
    10: percentage_10,
    20: percentage_20,
    30: percentage_30,
    40: percentage_40,
    50: percentage_50,
    60: percentage_60,
    70: percentage_70,
    80: percentage_80,
    90: percentage_90,
    100: percentage_100,
  };
  const getPercentageKey = (rate) => {
    const n = Number(rate) || 0;
    return Math.max(0, Math.min(100, Math.round(n / 10) * 10));
  };
  const getRoundedTensPercent = (value) => {
    const n = Number(value) || 0;
    return Math.max(0, Math.min(100, Math.round(n / 10) * 10));
  };
  const isPc = useMedia().isPc;
  const nav = useNavigate();

  // Alert 관련 상태
  const [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert] = useAlertCP();
  const [alertUrl, setAlertUrl] = useState("/login");

  const [loading, setLoading] = useState(true);

  const [reportData, setReportData] = useState(null);

  const { loginCheck, roadmapReportId } = useLoginInfo();

  useEffect(() => {
    const fetchData = async () => {
      const result = await loginCheck();
      if (!result?.isLogin) {
        setAlertTitleText("로그인이 필요합니다.");
        setAlertButtonText("로그인/회원가입");
        setAlertUrl("/login");
        openAlert();
        setLoading(false);
      } else {
        const reportId = roadmapReportId;
        if (!reportId) {
          setAlertTitleText("올바르지 않은 접근입니다.");
          setAlertButtonText("로드맵 보관함으로 이동");
          setAlertUrl("/roadmap/list");
          openAlert();
          setLoading(false);
          return;
        }

        const resData = await api_roadmapDetailGet(reportId);

        if (!resData?.success) {
          setAlertTitleText("올바르지 않은 접근입니다.");
          setAlertButtonText("로드맵 보관함으로 이동");
          setAlertUrl("/roadmap/list");
          openAlert();
          setLoading(false);
          return;
        }

        setReportData(resData?.data);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginCheck, roadmapReportId, openAlert, setAlertButtonText, setAlertTitleText]);

  return (
    <div>
      {isAlertOpen && (
        <AlertCP
          titleText={alertTitleText}
          buttonText={alertButtonText}
          closeButton={closeAlert}
          okButton={() => {
            closeAlert();
            nav(alertUrl);
          }}
        />
      )}
      <div className="w-full h-full" style={isAlertOpen ? { position: "absolute", top: 0, left: 0 } : {}}>
        <div className="fixed hidden w-full h-fit md:block z-999">
          <HeaderPc />
        </div>
        {!isPc && <HeaderCP>로드맵 보관함</HeaderCP>}
        <div className="p-8 sm:p-0 sm:pt-20.5 relative h-full flex flex-col gap-9 px-8 sm:px-0">
          <MainContentLayout page="roadmap_list" fixed={true} scroll={true} footer={true}>
            {loading && <SpinnersCP height={isPc ? "calc(100vh - 5.125rem - 10.25rem)" : "calc(100vh - 22px - 32px)"} size="26" />}

            {/* 콘텐츠 - 시작 */}
            {!loading && reportData && (
              <section className="w-full h-full">
                <p className="text-orange-400 text-end B4">
                  {isPc && "AI를 통해 최신 공고를 분석해 만든 결과로 실제와 차이가 있을 수 있습니다."}
                  {!isPc && "AI를 통해 만들어진 결과로 실제와 차이가 있을 수 있습니다."}
                </p>

                {/* 그래프 - 시작 */}
                <div className="relative w-full my-24">
                  <p className="mx-auto leading-8 text-center w-fit H2_bold">
                    {reportData.userName}님은 <span className="text-point-main">{reportData.targetJob}</span>직군에
                    <br />
                    필요한 역량을 {reportData.matchRate}% 갖추었네요!
                  </p>
                  <div
                    style={{ backgroundPositionY: "-50%", backgroundImage: `url(${percentageImages[getPercentageKey(reportData.matchRate)]})` }}
                    className="mx-auto bg-no-repeat bg-cover w-full sm:w-6/10 h-65 sm:h-80 bg-[radial-gradient(circle, transparent_50%,white_100%)]"></div>
                  <div className="mt-4 p-6 text-gray-500 B3 leading-4.5 rounded-lg bg-gray-100">{reportData.overallComment}</div>
                </div>
                {/* 그래프 - 끝 */}

                {/* 자격증 - 시작 */}
                <div className="my-26">
                  <h2 className="H2_bold">{reportData.certificateAnalysis.title}</h2>
                  {/* 자격증 리스트 */}
                  <div className="flex gap-4 sm:gap-6 flex-wrap my-12">
                    {/* 보유 중 */}
                    {reportData.certificateAnalysis?.preferred?.map((item, idx) => (
                      <div className="h-18 sm:h-22 px-9 border rounded-lg border-point-sub  flexCenter bg-[#FFF1F5] text-point-sub-bold font-bold" key={idx}>
                        {item}
                      </div>
                    ))}
                    {/* 미보유 */}
                    {reportData.certificateAnalysis?.required?.map((item, idx) => (
                      <div className="h-18 sm:h-22 px-9 border rounded-lg border-gray-300 flexCenter" key={idx}>
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* 업계 동향, 방향성 */}
                  <div className="my-4 p-4 bg-gray-100 leading-5">
                    <p className="mb-3 text-point-main font-bold">업계 동향</p>
                    <div className="B3 text-gray-500">{reportData.certificateAnalysis.industryTrend || "내용이 존재하지 않습니다."}</div>
                  </div>
                  <div className="my-4 p-4 bg-[#FFF8FA] leading-5">
                    <p className="mb-3 text-point-sub-bold font-bold">방향성 코칭</p>
                    <div className="B3 text-gray-600">{reportData.certificateAnalysis.coaching || "내용이 존재하지 않습니다."}</div>
                  </div>
                </div>
                {/* 자격증 - 끝 */}

                {/* 취업시장 - 시작 */}
                <div className="my-26">
                  <h2 className="H2_bold">{reportData.awardAnalysis.title}</h2>
                  {/* 차트 - 시작 */}
                  <div>
                    {reportData.awardAnalysis.charts.map((chart, idx) => (
                      <div key={idx} className="flex flex-col my-12 gap-y-4">
                        {/* 그래프 */}
                        <div className="relative flex flex-row min-h-18 gap-4">
                          <div
                            style={{ flexBasis: `${getRoundedTensPercent(chart.userPercent)}%` }}
                            className="rounded-lg bg-point-main flex p-6 items-center text-white">
                            {chart.userPercent}%
                          </div>
                          <div
                            style={{ flexBasis: `${getRoundedTensPercent(chart.otherPercent)}%` }}
                            className="rounded-lg bg-[#F0F9EB] p-6 flex items-center text-gray-500">
                            {chart.otherPercent}%
                          </div>
                        </div>
                        {/* 설명 */}
                        <div className="flex gap-4">
                          <div className="flex gap-1">
                            <div className="rounded-full h-3 w-3 bg-point-main"></div>
                            <span className="B3">{chart.label}</span>
                          </div>
                          <div className="flex gap-1">
                            <div className="rounded-full h-3 w-3 bg-[#d9edcf]"></div>
                            <span className="B3">해당 없음</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* 차트 - 끝 */}
                  <div className="my-4 p-4 bg-gray-100 leading-5 text-gray-500">
                    <p className="mb-3 text-point-main font-bold">업계 동향</p>
                    <div className="B3 ">{reportData.awardAnalysis.industryTrend.summary || "내용이 존재하지 않습니다."}</div>
                    <ul className="mt-2 list-disc list-inside pl-5">
                      {reportData.awardAnalysis.industryTrend.details?.map((detail, idx) => (
                        <li className="B3 text-gray-500 bullet-list" key={idx} style={{ listStyleType: "disc", display: "list-item" }}>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="my-4 p-4 bg-[#FFF8FA] leading-5 text-gray-600">
                    <p className="mb-3 text-point-sub-bold font-bold">방향성 코칭</p>
                    <div className="B3">{reportData.awardAnalysis.coaching.summary || "내용이 존재하지 않습니다."}</div>
                    <ul className="mt-2 list-disc list-inside pl-5">
                      {reportData.awardAnalysis.coaching.details?.map((detail, idx) => (
                        <li className="B3 bullet-list" key={idx} style={{ listStyleType: "disc", display: "list-item" }}>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* 취업시장 - 끝 */}

                {/* 필수 수택 - 시작 */}
                <div className="my-26">
                  <h2 className="H2_bold my-12">{reportData.skillGap.title}</h2>
                  {/* 스택 */}
                  <div>
                    {reportData.skillGap.items.map((item, idx) => (
                      <div className="flex gap-4 min-h-20 sm:min-h-24" key={idx}>
                        <div className="basis-2/10 flexCenter flex-col gap-1 p-4 rounded-lg bg-[#EAFFE5] border border-[#38D255] text-[#38D255]">
                          <p className="B2_bold">{item.badgeTitle}</p>
                          <p className="B2">{item.badgeValue}</p>
                        </div>
                        <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-100 basis-8/10">
                          <p className="B3_bold text-point-main">{item.contentTitle}</p>
                          <p className="B3 text-gray-500 leading-5 ">{item.contentDescription}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 필수 수택 - 끝 */}

                {/* 포트폴리오 - 시작 */}
                <div>
                  <h2 className="text-center H2_bold mt-30">{reportData.portfolioAnalysis.title}</h2>

                  <img src={portfolio_img} alt="포트폴리오 분석 결과 이미지" className="w-45 h-45 mx-auto my-12" />

                  <div className="my-4 p-4 bg-gray-100 leading-5 text-gray-500">
                    <p className="mb-3 text-point-main font-bold">분석 결과</p>
                    <div className="B3 ">{reportData.portfolioAnalysis.analysisResult || "내용이 존재하지 않습니다."}</div>
                  </div>
                  <div className="my-4 p-4 bg-[#FFF8FA] leading-5 text-gray-600">
                    <p className="mb-3 text-point-sub-bold font-bold">피드백</p>

                    <ul className="mt-2 list-disc list-inside pl-5">
                      {reportData.portfolioAnalysis.feedbackList?.map((detail, idx) => (
                        <li className="B3 bullet-list" key={idx} style={{ listStyleType: "disc", display: "list-item" }}>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* 포트폴리오 - 끝 */}

                <div className="w-full flex justify-end mt-22 mb-32">
                  <div className="w-1/2 sm:w-2/10">
                    <ButtonCP bg="bg-point-text" color="text-white">
                      히스토리 열람
                    </ButtonCP>
                  </div>
                </div>
              </section>
            )}
            {/* 콘텐츠 - 끝 */}
          </MainContentLayout>
        </div>
      </div>
    </div>
  );
};
export default MyRoadmapResultPage;
