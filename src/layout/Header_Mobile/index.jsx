import { faFolder, faHouse, faPaste } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const HeaderMobile = ({ page }) => {
  const nav = useNavigate();
  return (
    <header style={{ boxShadow: "0 0 10.9px 0 #E1E4EE" }} className="w-full h-1/10 bg-white flex justify-around items-center z-800">
      <div
        onClick={() => nav("/")}
        className={`${page === "main" ? "text-point-sub" : "text-gray-400 cursor-pointer caret-transparent"} text-3xl flex flex-col items-center w-fit gap-1.5`}>
        <FontAwesomeIcon icon={faHouse} /> <span className="B3">홈 화면</span>
      </div>
      <div
        onClick={() => nav("/roadmap/create")}
        className={`${page === "roadmap" ? "text-point-sub" : "text-gray-400 cursor-pointer caret-transparent"} text-3xl flex flex-col items-center w-fit gap-1.5`}>
        <FontAwesomeIcon icon={faPaste} /> <span className="B3">로드맵</span>
      </div>
      <div
        onClick={() => nav("/roadmap/list")}
        className={`${page === "roadmap_list" ? "text-point-sub" : "text-gray-400 cursor-pointer caret-transparent"} text-3xl flex flex-col items-center w-fit gap-1.5`}>
        <FontAwesomeIcon icon={faFolder} /> <span className="B3">보관함</span>
      </div>
    </header>
  );
};
export default HeaderMobile;
