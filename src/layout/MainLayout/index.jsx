import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMedia } from "../../hook/useMedia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faHouse, faPaste } from "@fortawesome/free-regular-svg-icons";
import Footer from "../Footer";
import { useLoginInfo } from "../../context/LoginInfoContext";

const MainContentLayout = ({ children, page = "main", fixed = false, scroll = false }) => {
  const nav = useNavigate();
  const { isPc } = useMedia();
  const [isAccountActionLoading, setIsAccountActionLoading] = useState(false);

  const { userDelete, logout } = useLoginInfo();

  if (!isPc) return children;

  return (
    <section
      className={`z-40 h-[calc(100vh-5.125rem)] min-h-[calc(100vh-5.125rem)] w-full bg-gray-100 flex items-stretch select-none overflow-hidden relative ${
        scroll ? "overflow-y-auto" : ""
      }`}>
      <div className="fixed bottom-8 left-8 gap-4 z-999">
        <p
          onClick={async () => {
            if (isAccountActionLoading) return;

            setIsAccountActionLoading(true);
            const result = await logout();
            setIsAccountActionLoading(false);

            if (result?.success) {
              alert(result?.message || "로그아웃 되었습니다.");
              nav("/login");
              return;
            }

            alert(result?.message || "로그아웃에 실패했습니다.\n나중에 다시 시도해주세요.");
          }}
          className={`B4 cursor-pointer transition-all duration-150 hover:opacity-70 active:scale-95 ${isAccountActionLoading ? "pointer-events-none opacity-50" : ""}`}>
          {isAccountActionLoading ? "처리 중..." : "로그아웃"}
        </p>
        <p
          onClick={async () => {
            if (isAccountActionLoading) return;

            if (window.confirm("정말 회원 탈퇴를 진행하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.")) {
              setIsAccountActionLoading(true);
              const result = await userDelete();
              setIsAccountActionLoading(false);

              if (result?.success) {
                alert(result?.message || "회원 탈퇴가 완료되었습니다.");
                nav("/login");
                return;
              }

              alert(result?.message || "회원 탈퇴에 실패했습니다.\n나중에 다시 시도해주세요.");
            }
          }}
          className={`B4 cursor-pointer text-point-sub-bold mt-4 transition-all duration-150 hover:opacity-70 active:scale-95 ${isAccountActionLoading ? "pointer-events-none opacity-50" : ""}`}>
          회원 탈퇴
        </p>
      </div>
      {/* 왼쪽 영역 (남는 공간의 절반) */}
      <aside className={`z-45 flex-1 box-border px-[2vw] pt-14 h-[calc(100vh-5.125rem)] ${fixed ? "fixed top-20.5 w-[calc(50vw/2)]" : "relative"}`}>
        <div className="flex flex-col gap-1.5">
          <div
            onClick={() => nav("/")}
            className={`isMobileHidden flex items-center transition-colors duration-200 w-full max-w-[16vw] cursor-pointer select-none hover:bg-white h-14 rounded-2xl px-[10%] B2_bold ${
              page === "main" ? "bg-white" : "bg-gray-100 text-gray-400"
            }`}>
            <FontAwesomeIcon icon={faHouse} className={`${page === "main" ? "text-point-sub" : ""} pr-3`} /> 홈 화면
          </div>
          <div
            onClick={() => nav("/roadmap/create")}
            className={`isMobileHidden flex items-center transition-colors duration-200 w-full max-w-[16vw] cursor-pointer select-none hover:bg-white h-14 rounded-2xl px-[10%] B2_bold ${
              page === "roadmap" ? "bg-white" : "bg-gray-100 text-gray-400"
            }`}>
            <FontAwesomeIcon icon={faPaste} className={`${page === "roadmap" ? "text-point-sub" : ""} pr-3`} /> 나의 로드맵 알아보기
          </div>
          <div
            onClick={() => nav("/roadmap/list")}
            className={`isMobileHidden flex items-center transition-colors duration-200 w-full max-w-[16vw] cursor-pointer select-none hover:bg-white h-14 rounded-2xl px-[10%] B2_bold ${
              page === "roadmap_list" ? "bg-white" : "bg-gray-100 text-gray-400"
            }`}>
            <FontAwesomeIcon icon={faFolder} className={`${page === "roadmap_list" ? "text-point-sub" : ""} pr-3`} />
            로드맵 보관함
          </div>
        </div>
      </aside>
      {fixed && <aside className={`flex-1 h-[calc(100vh-5.125rem)] box-border px-[2vw] pt-14 flex flex-col gap-1.5`}></aside>}
      {/* 가운데 콘텐츠 (min~max 사이로 유지) */}
      <div className="box-border flex-none w-full max-w-215">
        <main
          className={`z-50 relative box-border flex-none ${
            scroll ? "min-h-[calc(100vh-5.125rem)]" : "pb-0 h-[calc(100vh-5.125rem)]"
          } bg-white rounded-t-3xl p-14 w-full max-w-215`}>
          {children}
        </main>
        <Footer />
      </div>

      {/* 오른쪽 영역 (남는 공간의 절반) */}
      <div className="flex-1 h-full px-[2vw] pt-14" />
    </section>
  );
};

export default MainContentLayout;
