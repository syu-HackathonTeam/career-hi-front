import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/image/logo.png";

const LogoCP = () => {
  const nav = useNavigate();
  return (
    <div onClick={() => nav("/")} className="cursor-pointer font-normal rounded-[0.875rem] relative flex w-fit h-fit gap-2 items-center">
      {/* 로고 텍스트/이미지 삽입 */}
      <img src={logoImage} alt="Logo" className="bg-white md:p-1.5 p-0.5 rounded-[0.875rem] w-[2rem] h-[2rem] md:w-[3.25rem] md:h-[3.25rem]" />
      <span className="font-kimm whitespace-nowrap text-2xl select-none">Career-Hi</span>
    </div>
  );
};
export default LogoCP;
