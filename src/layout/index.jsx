import { useMedia } from "../hook/useMedia";
import HeaderMobile from "./Header_Mobile";
import HeaderPc from "./Header_PC";

const MainLayout = ({ children, mobile_block = false, page = "main" }) => {
  const isPc = useMedia().isPc;

  if (!isPc) {
    return (
      <main className="w-full h-screen relative">
        <div className={`w-full ${mobile_block ? "h-9/10" : "h-full"} px-8 relative overflow-y-auto`}>{children}</div>
        {mobile_block && <HeaderMobile page={page} />}
      </main>
    );
  }

  return (
    <main className="w-full h-full">
      <HeaderPc />
      {children}
    </main>
  );
};
export default MainLayout;
