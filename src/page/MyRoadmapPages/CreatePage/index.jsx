import SearchBarCP from "../../../component/_common/searchBarCP";
import { useInput } from "../../../hook/useInput";
import HeaderPc from "../../../layout/Header_PC";
import MainContentLayout from "../../../layout/MainLayout";
import { data_univLevel, data_univList } from "../../../data/univ";
import SelectCP from "../../../component/_common/selectCP";
import { useEffect, useState } from "react";
import { useLoginInfo } from "../../../context/LoginInfoContext";
import useAlertCP from "../../../hook/useAlertCP";
import { useNavigate } from "react-router-dom";
import AlertCP from "../../../component/_common/alertCP";
import HeaderCP from "../../../component/_common/headerCP";
import { useMedia } from "../../../hook/useMedia";

const MyRoadmapCreatePage = () => {
  const [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert] = useAlertCP();
  const isPc = useMedia().isPc;
  const [univ, onChangeUniv, setUniv] = useInput("");
  const [univLevel, setUnivLevel] = useState("");
  const { loginInfo, loginCheck } = useLoginInfo();

  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await loginCheck();
      if (!result?.isLogin) {
        setAlertTitleText("로그인이 필요합니다.");
        setAlertButtonText("로그인/회원가입");
        openAlert();
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 첫 마운트 때만 실행

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
      <div className="w-full h-fit hidden md:block fixed z-999">
        <HeaderPc />
      </div>
      {!isPc && <HeaderCP>기본 정보</HeaderCP>}
      <div className="pt-20.5 relative h-full flex flex-col gap-9 px-8 sm:px-0">
        <MainContentLayout page="roadmap" fixed={true} scroll={true} footer={true}>
          <p className="H2_bold hidden sm:block">{loginInfo.userData?.userName} 님의 스펙 정보를 작성해 주세요</p>
          {/* <SearchBarCP value={univ} onChangeValue={onChangeUniv} setValue={setUniv} selectList={data_univList} placeholder={"학교명"} />
          <SelectCP value={univLevel} setValue={setUnivLevel} selectList={data_univLevel} placeholder={"최종 학력"} /> */}
        </MainContentLayout>
      </div>
    </div>
  );
};
export default MyRoadmapCreatePage;
