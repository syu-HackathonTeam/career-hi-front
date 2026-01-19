import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const HeaderCP = ({ children }) => {
  const nav = useNavigate();

  return (
    <header className="w-full text-[22px] border-b border-gray-200 relative caret-transparent">
      <FontAwesomeIcon icon={faAngleLeft} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => nav(-1)} />
      <p className="font-semibold text-center py-4.5 text-point-text">{children}</p>
    </header>
  );
};
export default HeaderCP;
