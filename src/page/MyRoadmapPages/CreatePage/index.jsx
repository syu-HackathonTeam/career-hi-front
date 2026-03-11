import SearchBarCP from "../../../component/_common/searchBarCP";
import { useInput } from "../../../hook/useInput";
import HeaderPc from "../../../layout/Header_PC";
import MainContentLayout from "../../../layout/MainLayout";
import { data_univLevel, data_univList, data_univType, data_univSituation, data_hopeJobGroup, data_hopeJobDetail } from "../../../data/univ";
import { data_qualificationsList } from "../../../data/qualifications";
import { data_p_languages, data_languageQualifications } from "../../../data/language";
import SelectCP from "../../../component/_common/selectCP";
import { useCallback, useEffect, useState } from "react";
import { useLoginInfo } from "../../../context/LoginInfoContext";
import useAlertCP from "../../../hook/useAlertCP";
import { useNavigate } from "react-router-dom";
import AlertCP from "../../../component/_common/alertCP";
import HeaderCP from "../../../component/_common/headerCP";
import { useMedia } from "../../../hook/useMedia";
import InputCP from "../../../component/_common/inputCP";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../layout/Footer";
import FileUploadCP from "../../../component/_common/fileUploadCP";
import ButtonCP from "../../../component/_common/buttonCP";
import logo_3d from "../../../assets/image/3d_logo.png";
import {
  api_profileCreate,
  api_profilePatch,
  api_reportAnalyze,
  buildProfilePatchRequest,
  buildProfileRequestFromCreateForm,
  api_profileGet,
} from "../../../api/roadmap";
import { api_uploadFile } from "../../../api/file";
import { BarLoader } from "react-spinners";

const MyRoadmapCreatePage = () => {
  const [isAlertOpen, alertTitleText, alertButtonText, setAlertTitleText, setAlertButtonText, closeAlert, openAlert] = useAlertCP();
  const isPc = useMedia().isPc;

  // 수정모드
  const [isEdit, setIsEdit] = useState(false);
  const [isEditData, setIsEditData] = useState(null);
  // 이름
  const [name, onChangeName, setName] = useInput("");
  const [nameError, setNameError] = useState(false);

  // 학력 입력 활성화
  const [isUnivInputDisabled, setIsUnivInputDisabled] = useState(false);

  // 최종 학력
  const [univLevel, setUnivLevel] = useState("");
  // 구분
  const [univType, setUnivType] = useState("");
  // 대학
  const [univ, onChangeUniv, setUniv] = useInput("");
  // 전공
  const [department, onChangeDepartment, setDepartment] = useInput("");
  // 상태
  const [univSituation, setUnivSituation] = useState("");
  // 학적 오류
  const [univError, setUnivError] = useState(false);

  // 직업정보
  const [hopeJobGroup, setHopeJobGroup] = useState(0);
  const [hopeJobDetail, setHopeJobDetail] = useState([]);
  const [hopeJobDetailError, setHopeJobDetailError] = useState(false);

  // 자격증
  const [qualifications, onChangeQualifications, setQualifications] = useInput("");
  const [qualificationsList, setQualificationsList] = useState([]);

  // 사용 언어
  const [planguages, onChangePLanguages, setPLanguages] = useInput("");
  const [planguagesList, setPLanguagesList] = useState([]);

  // 어학점수
  const [languageQualifications, setLanguageQualifications] = useState([
    {
      testName: null, // 검색: 자격증이름
      grade: null, // 입력
      score: null, // 입력
    },
  ]);

  // 수상 내역
  const [premiers, setPremiers] = useState([
    {
      category: null, // 드롭다운: 공모전, 대회 등
      title: null, // 입력
      rank: null, // 입력
    },
  ]);

  // 선택된 파일
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [portfolioFileUrl, setPortfolioFileUrl] = useState("");
  const [isPortfolioUploading, setIsPortfolioUploading] = useState(false);

  // 동의
  const [isAgree, setIsAgree] = useState(false);

  // 최종 학력 변경 시 다른 항목 초기화 및 비활성화
  useEffect(() => {
    if (univLevel === "초등학교 졸업" || univLevel === "중학교 졸업") {
      setUnivType("");
      setUniv("");
      setDepartment("");
      setUnivSituation("");

      setIsUnivInputDisabled(true);
    } else if (univLevel === "고등학교 졸업" && univType === "대학교 진학X") {
      setUniv("");
      setDepartment("");
      setUnivSituation("");

      setIsUnivInputDisabled(true);
    } else if (univType === "대학교 진학X") {
      setUniv("");
      setDepartment("");
      setUnivSituation("");
      setIsUnivInputDisabled(true);
    } else {
      setIsUnivInputDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [univLevel]);

  const handleFileSelect = async (files) => {
    setSelectedFiles(files);

    const selectedFile = files?.[0]?.file;
    if (!selectedFile) {
      setPortfolioFileUrl("");
      return;
    }

    setIsPortfolioUploading(true);

    const uploadResult = await api_uploadFile(selectedFile);
    setIsPortfolioUploading(false);

    if (!uploadResult?.success || !uploadResult?.fileUrl) {
      setPortfolioFileUrl("");
      alert(uploadResult?.message || "포트폴리오 파일 업로드에 실패했습니다.");
      return;
    }

    setPortfolioFileUrl(uploadResult.fileUrl);
  };

  const updatePremier = (index, patch) => {
    // 리뷰: 불변성을 유지해 특정 인덱스만 안전하게 갱신합니다.
    setPremiers((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handleCategoryChange = (index, value) => {
    // 수상 내역의 교내/교외 구분 업데이트
    updatePremier(index, { category: value });
  };

  const handleTitleChange = (index, value) => {
    // 수상 내역의 대회명 업데이트
    updatePremier(index, { title: value });
  };

  const handleRankChange = (index, value) => {
    // 수상 내역의 수상 등급 업데이트
    updatePremier(index, { rank: value });
  };

  // 수상 내역 추가 함수
  const addPremiers = () => {
    setPremiers((prev) => [
      ...prev,
      {
        category: "", // 드롭다운: 공모전, 대회 등
        title: "", // 입력
        rank: "", // 입력
      },
    ]);
  };

  const updateLanguageQualification = (index, patch) => {
    // 리뷰: 언어/시험/점수 갱신을 한 곳에서 처리해 중복을 줄입니다.
    setLanguageQualifications((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handleExamNameChange = (index, value) => {
    // 시험명 변경 시 점수/등급을 초기화합니다.
    updateLanguageQualification(index, { testName: value, grade: "", score: "" });
  };

  const handleGradeChange = (index, value) => {
    // 등급 입력 시 score는 비웁니다.
    updateLanguageQualification(index, { grade: value, score: "" });
  };

  const handleScoreChange = (index, value) => {
    // 점수/등급 입력값 업데이트
    updateLanguageQualification(index, { score: value });
  };

  // 어학점수 추가 함수
  const addLanguageQualifications = () => {
    setLanguageQualifications((prev) => [
      ...prev,
      {
        testName: null, // 검색: 자격증이름
        grade: null, // 입력
        score: null, // 입력
      },
    ]);
  };

  // 자격증 추가 함수
  const handleQualificationsList = (data) => {
    // 리뷰: 중복 추가를 방지합니다.
    if (qualificationsList.includes(data)) return;

    setQualificationsList([...qualificationsList, data]);
    setQualifications("");
  };

  const removeQualificationsList = (item) => {
    // 선택한 자격증을 목록에서 제거합니다.
    setQualificationsList(qualificationsList.filter((qualification) => qualification !== item));
  };

  // 사용 언어 추가 함수
  const handlePLanguagesList = (data) => {
    if (planguagesList.includes(data)) return;

    setPLanguagesList([...planguagesList, data]);
    setPLanguages("");
  };

  const removePLanguagesList = (item) => {
    setPLanguagesList(planguagesList.filter((language) => language !== item));
  };

  // 직군 변경 함수
  const handleGroupChange = (value) => {
    // 희망 직군 변경 시 세부 직군 선택을 초기화합니다.
    setHopeJobGroup(value);
    setHopeJobDetail([]);
  };

  // 세부 직군 추가 함수
  const toggleHopeJobDetail = (detail) => {
    // 리뷰: 체크/해제 토글을 한 줄로 처리합니다.
    setHopeJobDetail((prev) => (prev.includes(detail) ? prev.filter((item) => item !== detail) : [...prev, detail]));
  };

  const { loginInfo, loginCheck, setRoadmapReportId } = useLoginInfo();

  const nav = useNavigate();

  const currentHopeJobDetails = data_hopeJobDetail[hopeJobGroup] || [];
  const languageQualificationExamList = Object.keys(data_languageQualifications || {});

  // FIXME: 이부분 수정하기
  const [aiReqLoading, setAiReqLoading] = useState(false);

  // 제출 함수
  const handleSubmit = useCallback(async () => {
    console.log("실행");
    let isValid = true;
    setNameError(false);
    setUnivError(false);
    setHopeJobDetailError(false);

    // 이름 유효성 검사
    if (name.includes(" ") || /[^가-힣]/.test(name) || name.length < 2 || name.length > 6) {
      setNameError(true);
      isValid = false;
    }

    // 학력 유효성 검사
    if (univLevel === "초등학교 졸업" || univLevel === "중학교 졸업") {
      if (univType || univ || department || univSituation) {
        setUnivError(true);
        isValid = false;
      }
      // 학력 정보가 모두 비어 있어야 함
    } else if (univLevel === "고등학교 졸업" && univType === "대학교 진학X") {
      // 학력 정보가 모두 비어 있어야 함
      if (univ || department || univSituation) {
        setUnivError(true);
        isValid = false;
      } else {
        setUnivError(false);
        isValid = true;
      }
    } else {
      // 학력 정보가 모두 채워져 있어야 함
      if (!univLevel || !univType || !univ || !univSituation) {
        setUnivError(true);
        isValid = false;
      }
    }

    // 희망직군 세부사항 선택 확인
    if (hopeJobDetail.length === 0) {
      setHopeJobDetailError(true);
      isValid = false;
    }

    if (!isAgree) {
      alert("AI 로드맵 생성 동의가 필요합니다.");
      return;
    }

    if (isPortfolioUploading) {
      alert("포트폴리오 파일 업로드 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (selectedFiles.length > 0 && !portfolioFileUrl) {
      alert("포트폴리오 파일 업로드가 완료되지 않았습니다. 파일을 다시 업로드해 주세요.");
      return;
    }

    if (isValid === false) return alert("입력한 내용을 다시 확인해 주세요.");

    const profileRequest = buildProfileRequestFromCreateForm({
      //FIXME: 포트폴리오 url 저장
      univLevel,
      univType,
      name,
      univ,
      department,
      univSituation,
      hopeJobGroupLabel: data_hopeJobGroup[hopeJobGroup],
      hopeJobDetail,
      qualificationsList,
      languageQualifications,
      premiers,
      planguagesList,
      portfolioFileUrl,
    });

    console.log(profileRequest);

    // 업데이트 분기
    if (isEdit) {
      const patchRequest = buildProfilePatchRequest({
        previousProfile: isEditData,
        currentProfileRequest: profileRequest,
      });

      const patchResult = await api_profilePatch({
        patchRequest,
      });

      if (!patchResult?.success) {
        alert(patchResult?.message || "프로필 수정에 실패했습니다.");
        return;
      }
    } else {
      const createProfileResult = await api_profileCreate({
        profileRequest,
      });

      if (!createProfileResult?.success) {
        alert(createProfileResult?.message || "프로필 저장에 실패했습니다.");
        return;
      }
    }

    setAiReqLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 10000));
    const analyzeResult = await api_reportAnalyze();
    if (!analyzeResult?.success || !analyzeResult?.reportId) {
      alert(analyzeResult?.message || "로드맵 생성에 실패했습니다.");
      return;
    }

    setRoadmapReportId(String(analyzeResult.reportId));
    nav("/roadmap/result");
  }, [
    name,
    univLevel,
    univType,
    hopeJobDetail,
    isAgree,
    isEdit,
    isEditData,
    univ,
    department,
    univSituation,
    hopeJobGroup,
    qualificationsList,
    languageQualifications,
    premiers,
    planguagesList,
    portfolioFileUrl,
    isPortfolioUploading,
    selectedFiles,
    setRoadmapReportId,
    nav,
  ]);

  useEffect(() => {
    setHopeJobDetail([]);
    setHopeJobGroup(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_hopeJobGroup]);

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

  // 정보 불러오기
  const loadProfileData = useCallback(async () => {
    const result = await api_profileGet();
    if (!result) {
      return alert("프로필 정보를 불러오는데 실패했습니다\n저장된 내용이 없을 수 있습니다.");
    } else {
      setIsEditData(result);
      setIsEdit(true);
      console.log(result);

      // 이름
      setName(result.basicInfo.name || "");

      // FIXME:
      setUnivLevel(result.basicInfo.educationLevel);
      setUnivType(result.basicInfo.schoolType);
      setUniv(result.basicInfo.schoolName || "");
      setDepartment(result.basicInfo.major || "");
      setUnivSituation(result.basicInfo.academicStatusKr || result.basicInfo.academicStatus || "");

      setHopeJobDetail(result.jobInfo.subRoles || []);
      setQualificationsList(result.specInfo.certificates || []);
      setPLanguagesList(result.specInfo.codingLanguages || []);

      const mappedLanguageTests = (result.specInfo.languageTests || []).map((item) => {
        const testName = item.testName || item.examName || "";
        const scoreType = testName ? data_languageQualifications[testName] : null;
        return {
          testName,
          grade: scoreType === "grade" ? item.grade || item.score || "" : "",
          score: scoreType === "score" ? item.score || item.grade || "" : "",
        };
      });

      setLanguageQualifications(
        mappedLanguageTests.length > 0
          ? mappedLanguageTests
          : [
              {
                testName: null,
                grade: null,
                score: null,
              },
            ],
      );

      const mappedPremiers = (result.specInfo.awards || []).map((item) => ({
        category: null,
        title: item.contestName || "",
        rank: item.awardName || "",
      }));

      setPremiers(
        mappedPremiers.length > 0
          ? mappedPremiers
          : [
              {
                category: null,
                title: null,
                rank: null,
              },
            ],
      );

      setPortfolioFileUrl(result?.portfolio?.FileUrl || result?.portfolio?.fileUrl || "");

      setIsAgree(true);
    }
  }, [setDepartment, setName, setUniv]);

  return (
    <div>
      {isAlertOpen && (
        <AlertCP
          titleText={alertTitleText}
          buttonText={alertButtonText}
          okButton={() => {
            closeAlert();
            nav("/login");
          }}
        />
      )}
      <div className="w-full h-full" style={isAlertOpen ? { position: "absolute", top: 0, left: 0 } : {}}>
        <div className="w-full h-fit hidden md:block fixed z-850">
          <HeaderPc />
        </div>
        {!isPc && <HeaderCP>기본 정보</HeaderCP>}
        <div className="pt-20.5 relative h-full flex flex-col gap-9 px-8 sm:px-0">
          <MainContentLayout page="roadmap" fixed={true} scroll={true} footer={true}>
            {aiReqLoading && (
              <div className="w-full sm:pb-14 h-full flex flex-col items-center justify-center select-none relative gap-4 sm:gap-8">
                <img src={logo_3d} alt="이미지를 불러올 수 없습니다." className="h-2/10 sm:h-6/10 max-h-90 pb-1/5 mb-[18vh] sm:mb-0 sm:mt-[18vh]" />
                <p className="H3_bold leading-7 text-center">
                  {name} 님에게 딱 맞는
                  <br />
                  취준 로드맵을 생성하고 있습니다..
                </p>
                <BarLoader color="#FE7BA0" width={160} />
              </div>
            )}
            {!aiReqLoading && (
              <div className="MyRoadmapCreatePage z-50 flex flex-col justify-start w-full gap-12 ">
                <div className="flex justify-between items-center">
                  <p className="H2_bold hidden sm:block">{loginInfo.userData?.userName} 님의 스펙 정보를 작성해 주세요</p>
                  {isPc && (
                    <span onClick={loadProfileData} className="text-point-main B4 cursor-pointer">
                      정보 불러오기
                    </span>
                  )}
                </div>

                <div>
                  <div className="inputForm">
                    <p className="H3_bold">
                      기본 정보
                      {!isPc && (
                        <span onClick={loadProfileData} className="text-point-main B4 cursor-pointer absolute right-8">
                          정보 불러오기
                        </span>
                      )}
                    </p>

                    {/* 이름 DIV */}
                    <div>
                      <p className="B3_bold">
                        이름<span>*</span>
                      </p>
                      <InputCP
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChangeValue={onChangeName}
                        errorText="특수문자 X, 띄어쓰기 X, 2~6자리"
                        error={nameError}
                      />
                    </div>

                    {/* 학력 DIV */}
                    <div>
                      <p className="B3_bold">
                        학력<span>*</span>
                      </p>
                      {/* INPUT DIV */}
                      <div className="flex gap-4 flex-col">
                        {/* INPUT COL 1 */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:grid sm:grid-cols-3">
                          {/* 최종 학력 */}
                          <div className="">
                            <SelectCP value={univLevel} setValue={setUnivLevel} selectList={data_univLevel} placeholder={"최종 학력"} />
                          </div>
                          {/* 구분 */}
                          <div className="">
                            <SelectCP value={univType} setValue={setUnivType} selectList={data_univType} placeholder={"구분"} disabled={isUnivInputDisabled} />
                          </div>
                          {/* 학교 명 */}
                          <div className="">
                            <SearchBarCP
                              value={univ}
                              onChangeValue={onChangeUniv}
                              setValue={setUniv}
                              selectList={data_univList}
                              placeholder={"학교명"}
                              disabled={isUnivInputDisabled}
                            />
                          </div>
                        </div>
                        {/* INPUT COL 2 */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:grid sm:grid-cols-3">
                          {/* 전공 */}
                          <div className="col-span-2">
                            <InputCP placeholder="전공" value={department} onChangeValue={onChangeDepartment} disabled={isUnivInputDisabled} />
                          </div>
                          {/* 상태 */}
                          <div>
                            <SelectCP
                              value={univSituation}
                              setValue={setUnivSituation}
                              selectList={data_univSituation}
                              placeholder={"학적 상태"}
                              disabled={isUnivInputDisabled}
                            />
                          </div>
                        </div>
                      </div>
                      {univError && (
                        <p className="text-[12px] text-point-error pt-1">
                          대학교 정보를 모두 채워 주세요
                          <br />
                          (최종학력이 초, 중학교 졸업 이거나, 고등학교 졸업이면서 대학교 진학을 하지 않았을 경우에는 대학교 정보를 입력할 수 없습니다.)
                        </p>
                      )}
                    </div>

                    <p className="H3_bold">직업 정보</p>

                    {/* 희망 직군 DIV */}
                    <div>
                      <p className="B3_bold">
                        희망 직군<span>*</span>
                      </p>
                      <div className="flex gap-4">
                        {data_hopeJobGroup.map((group, index) => (
                          <div
                            key={group}
                            className="cursor-pointer p-1 hover:bg-[#FFF1F5] hover:rounded-sm hover:text-point-sub-bold transition-colors duration-100">
                            <input
                              type="radio"
                              id={`hopeJobGroup_${index}`}
                              name="hopeJobGroup"
                              className="cursor-pointer accent-point-main hover:accent-point-sub-bold transition-colors duration-100"
                              value={index}
                              checked={hopeJobGroup === index}
                              onChange={() => handleGroupChange(index)}
                            />
                            <label htmlFor={`hopeJobGroup_${index}`} className="radioLabelCP cursor-pointer pl-2 B3">
                              {group}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 세부 직군 DIV */}
                    <div>
                      <p className="B3_bold">
                        세부사항<span>*</span>
                      </p>
                      <div className="flex gap-4 flex-wrap">
                        {currentHopeJobDetails.map((detail, index) => (
                          <div key={detail} className="cursor-pointer p-1">
                            <input
                              type="checkbox"
                              id={`hopeJobDetail_${index}`}
                              name="hopeJobDetail"
                              className="cursor-pointer accent-point-main"
                              checked={hopeJobDetail.includes(detail)}
                              onChange={() => toggleHopeJobDetail(detail)}
                            />
                            <label htmlFor={`hopeJobDetail_${index}`} className="radioLabelCP cursor-pointer pl-2 B3">
                              {detail}
                            </label>
                          </div>
                        ))}
                      </div>
                      {hopeJobDetailError && <p className="text-[12px] text-point-error pt-1">하나 이상 선택하세요</p>}
                    </div>

                    <p className="H3_bold">스펙 정보</p>

                    {/* 자격증 DIV */}
                    <div>
                      <p className="B3_bold">자격증</p>
                      <div className="mb-6">
                        <SearchBarCP
                          value={qualifications}
                          onChangeValue={onChangeQualifications}
                          setValue={handleQualificationsList}
                          selectList={data_qualificationsList}
                          placeholder={"이름 입력"}
                          zIndexClass="z-50"
                        />
                      </div>
                      <div className="min-h-4 flex flex-wrap gap-x-2 gap-y-3">
                        {qualificationsList === 0 && <p className="B4 text-gray-500">자격증을 입력해 주세요</p>}
                        {qualificationsList.map((item) => {
                          return (
                            <span
                              key={item}
                              className="B4 bg-[#F0F9EB] p-2 px-3 cursor-pointer rounded-full text-point-main"
                              onClick={() => removeQualificationsList(item)}>
                              {item}
                              <FontAwesomeIcon icon={faXmark} className="ml-2 text-[12px]" />
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* 수상 내역 */}
                    <div>
                      <div className="B3_bold plusForm">
                        수상 내역
                        <div className="B4_bold plusButton" onClick={addPremiers}>
                          추가 +
                        </div>
                      </div>
                      <div className="flex flex-col gap-6">
                        {premiers.map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row gap-4 sm:grid sm:grid-cols-3">
                            {/* 교내/교외 */}
                            <div className="">
                              <SelectCP
                                value={item.category || ""}
                                setValue={(value) => handleCategoryChange(index, value)}
                                selectList={["교내", "교외"]}
                                placeholder={"교내/교외"}
                              />
                            </div>
                            {/* 대회 이름 */}
                            <div>
                              <InputCP placeholder="대회명" value={item.title || ""} onChangeValue={(e) => handleTitleChange(index, e.target.value)} />
                            </div>
                            <div>
                              <InputCP
                                placeholder="수상 등급 (ex: 최우수상)"
                                value={item.rank || ""}
                                onChangeValue={(e) => handleRankChange(index, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 자격증 DIV */}
                    <div>
                      <div className="B3_bold plusForm">
                        어학 성적
                        <div className="B4_bold plusButton" onClick={addLanguageQualifications}>
                          추가 +
                        </div>
                      </div>
                      <div className="flex flex-col gap-6">
                        {languageQualifications.map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row gap-x-4 gap-y-2 sm:grid sm:grid-cols-3">
                            {/* 자격증 이름 */}
                            <div className="">
                              <SearchBarCP
                                value={item.testName || ""}
                                onChangeValue={(e) => handleExamNameChange(index, e.target.value)}
                                setValue={(value) => handleExamNameChange(index, value)}
                                selectList={languageQualificationExamList}
                                placeholder={"시험명"}
                              />
                            </div>
                            {/* 점수 */}
                            <div className="col-span-2">
                              {(() => {
                                const scoreType = item.testName ? data_languageQualifications[item.testName] : null;

                                if (!item.testName) {
                                  return (
                                    <InputCP placeholder="점수" value={item.score || ""} onChangeValue={(e) => handleScoreChange(index, e.target.value)} />
                                  );
                                }

                                if (scoreType === "grade") {
                                  return (
                                    <InputCP placeholder="등급" value={item.grade || ""} onChangeValue={(e) => handleGradeChange(index, e.target.value)} />
                                  );
                                }

                                return <InputCP placeholder="점수" value={item.score || ""} onChangeValue={(e) => handleScoreChange(index, e.target.value)} />;
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 사용 언어 DIV */}
                    <div>
                      <p className="B3_bold">사용 언어</p>
                      <div className="mb-6">
                        <SearchBarCP
                          value={planguages}
                          onChangeValue={onChangePLanguages}
                          setValue={handlePLanguagesList}
                          selectList={data_p_languages}
                          placeholder={"이름 입력"}
                          zIndexClass="z-40"
                        />
                      </div>
                      <div className="min-h-4 flex flex-wrap gap-x-2 gap-y-3">
                        {planguagesList.length === 0 && <p className="B4 text-gray-500">사용 언어를 입력해 주세요</p>}
                        {planguagesList.map((item) => {
                          return (
                            <span
                              key={item}
                              className="B4 bg-[#F0F9EB] p-2 px-3 cursor-pointer rounded-full text-point-main"
                              onClick={() => removePLanguagesList(item)}>
                              {item}
                              <FontAwesomeIcon icon={faXmark} className="ml-2 text-[12px]" />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <p className="H3_bold">포트폴리오</p>
                    <div>
                      <p className="B3_bold">첨부</p>
                      <div>
                        <FileUploadCP
                          onFileSelect={handleFileSelect}
                          accept=".pdf,.doc,.docx"
                          multiple={false}
                          placeholder="문서 선택"
                          maxFiles={1}
                          maxSizeMB={10}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* 구분선 */}
                <div className="w-full h-px bg-gray-300"></div>
                {/* 버튼 DIV */}
                <div className="flex justify-between items-center mb-32 sm:mb-64 flex-col sm:flex-row gap-4">
                  {/* 동의 */}
                  <form>
                    <input
                      type="checkbox"
                      id="isAgree"
                      name="isAgree"
                      className="cursor-pointer accent-point-main"
                      checked={isAgree}
                      onChange={(e) => setIsAgree(e.target.checked)}
                    />
                    <label htmlFor="isAgree" className="radioLabelCP cursor-pointer pl-2 B3">
                      AI를 활용해 로드맵을 생성하는 데에 동의합니다.<span className="text-point-error ml-1">*</span>
                    </label>
                  </form>

                  {/* 버튼 */}
                  <div className="w-full sm:w-3/10" onClick={handleSubmit}>
                    <ButtonCP
                      bg={"transition-colors duration-100 bg-[#ddf2d2] sm:bg-[#ddf2d2] sm:hover:bg-[#d4edc8]"}
                      color={"text-point-main"}
                      fontSize={"B3 hover:B3_bold"}>
                      나의 로드맵 생성하기
                    </ButtonCP>
                  </div>
                </div>
              </div>
            )}
          </MainContentLayout>
        </div>
        <div className="block sm:hidden">
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default MyRoadmapCreatePage;
