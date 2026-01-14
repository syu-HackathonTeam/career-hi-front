import { useMedia } from "../hook/useMedia";
import HeaderPc from "./Header_PC";

const MainLayout = ({ children }) => {
  const isPc = useMedia().isPc;
  return (
    <main className="w-full h-full">
      {isPc && <HeaderPc />}
      {children}
    </main>
  );
};
export default MainLayout;
