import "./style.css";
import logo from "../../assets/image/logo.png";

const Footer = () => {
  return (
    <footer className="w-full h-87.25 bg-point-footerBG p-[5%] flex flex-col justify-between select-none">
      {/* 이름 */}
      <div className="flex flex-col items-center gap-4 sm:flex-row justify-between">
        <div className="flex gap-5 text-gray-500">
          <p className="B3_bold">FE</p>
          <p className="flex gap-3 B3 text-gray-400">
            <a href="https://github.com/iyeonggyu0" target="_blank" className="cursor-pointer">
              IYEONG
            </a>
          </p>
        </div>
        <div className="flex gap-5 text-gray-500">
          <p className="B3_bold">BE</p>
          <p className="flex gap-3 B3 text-gray-400">
            <a href="https://github.com/lovesome-gy" target="_blank" className="cursor-pointer">
              가연
            </a>
            <a href="https://github.com/Wangjonghui" target="_blank" className="cursor-pointer">
              종휘
            </a>
          </p>
        </div>
        <div className="flex gap-5 text-gray-500">
          <p className="B3_bold">DE</p>
          <p className="flex gap-3 B3 text-gray-400">
            <a href="" target="_blank" className="cursor-pointer">
              YUN HYEWON
            </a>
          </p>
        </div>
      </div>
      <div className="flexWidthCenter gap-12">
        {/* 카피라이트 */}
        <p className="B4 text-gray-400 text-center">
          Copyright 2026. team Career-Hi. All right reserved.
          <br />
          Title font. 한국기계연구원, kimm.re.kr
        </p>
        <img src={logo} alt="LOGO" className="w-8 h-8" />
      </div>
    </footer>
  );
};
export default Footer;
