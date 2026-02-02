import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useMedia } from "../../../hook/useMedia";
import ButtonCP from "../../_common/buttonCP";
import { useNavigate } from "react-router-dom";

const RoadmapChartCP = ({ data }) => {
  const isPc = useMedia().isPc;
  const [state] = useState({
    series: [
      {
        name: "점수",
        data: data.rate.length !== 0 ? data.rate : [5, 10, 20],
      },
    ],
    options: {
      chart: {
        height: 350, // 차트 높이
        type: "area", // 차트 유형
        toolbar: {
          show: false, // 툴바 숨김
        },
        zoom: {
          enabled: false, // 줌 비활성화
        },
      },
      dataLabels: {
        enabled: false, // 데이터 라벨 숨김
      },
      stroke: {
        curve: "straight", // 선 곡선
        colors: [`#146247`], // 선 색상
        width: 1, // 선 두께
      },
      grid: {
        xaxis: {
          lines: {
            show: false, // 세로 그리드 선 숨김
          },
        },
        yaxis: {
          lines: {
            show: true, // 가로 그리드 선 표시
          },
        },
      },
      xaxis: {
        type: "category", // 축 유형
        categories: data.rate.length !== 0 ? data.date : ["", "", ""], // X축 라벨
        tickPlacement: isPc ? "between" : "no", // 틱 배치
        labels: {
          style: {
            colors: "#828797", // 라벨 색상
            fontSize: "12px", // 폰트 크기
            fontFamily: "Pretendard, sans-serif", // 폰트
            fontWeight: 300,
          },
        },
        tooltip: {
          enabled: false, // X축 툴팁 숨김
        },
      },
      yaxis: {
        show: isPc, // Y축 표시 여부
        tickAmount: 5, // Y축 라벨 수 제한
        labels: {
          style: {
            colors: "#171C20", // 라벨 색상
            fontSize: "16px", // 폰트 크기
            fontFamily: "Pretendard, sans-serif", // 폰트
            fontWeight: 300,
          },
        },
      },
      tooltip: {
        enabled: true, // 툴팁 활성화

        custom: function ({ series, seriesIndex, dataPointIndex }) {
          const value = series[seriesIndex][dataPointIndex];
          return (
            '<div style="color:#FE7BA0; background-color: #FFF1F5; border-radius: 999px; position: relative; font-size: 14px; padding: 7px 12px; font-family: Inter; font-weight:900; margin: 14px;">' +
            value +
            "%</div>"
          );
        }, // 커스텀 툴팁
      },
      // 범례 설정
      // legend: {
      //   show: true, // 범례 표시 여부
      //   position: "bottom", // 위치: 'top', 'right', 'bottom', 'left'
      //   // 기타 옵션: width, height, formatter, tooltipHoverFormatter, customLegendItems, offsetX, offsetY, markers, itemMargin, containerMargin, onItemClick, onItemHover
      // },
      colors: ["#14613B99"], // 시리즈 색상
      fill: {
        type: "gradient", // 채우기 유형
        gradient: {
          shade: "light", // 음영
          type: "vertical", // 방향
          shadeIntensity: 0.25, // 강도
          gradientToColors: ["#93F55600"], // 끝 색상
          inverseColors: false, // 반전
          opacityFrom: 0.65, // 시작 불투명도
          opacityTo: 0, // 끝 불투명도
          stops: [10, 100], // 정지점
        },
      },
      markers: {
        size: 9, // 마커 크기
        colors: "#FE7BA0", // 마커 색상
        strokeColors: "#FFF1F5", // 테두리 색상
        strokeWidth: 5, // 테두리 두께
        strokeOpacity: 1, // 테두리 불투명도
        fillOpacity: 1, // 채우기 불투명도
        discrete: [], // 개별 마커
        shape: "circle", // 모양
        radius: 2, // 반지름
        offsetX: 0, // X 오프셋
        offsetY: 0, // Y 오프셋
        onClick: undefined, // 클릭 이벤트
        onDblClick: undefined, // 더블클릭 이벤트
        showNullDataPoints: true, // null 데이터 표시
        hover: {
          size: 11, // 호버 크기
          sizeOffset: 3, // 크기 오프셋
        },
      },
    },
  });

  const nav = useNavigate();

  return (
    <div className="relative">
      {data.rate.length === 0 && (
        <div className="absolute z-30 w-full h-full bg-linear-to-b from-gray-400/30 to-white/80 rounded-t-2xl">
          <div className="relative w-full h-full flexCenter">
            <div className="mt-12">
              <p className="pb-3">아직 만들어진 로드맵이 없어요</p>
              <div onClick={() => nav("/roadmap/create")} className="cursor-pointer">
                <ButtonCP bg="bg-point-text" color="text-white">
                  나의 로드맵 알아보기
                </ButtonCP>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default RoadmapChartCP;
