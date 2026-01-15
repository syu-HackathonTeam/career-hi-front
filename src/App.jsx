import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./hook/useScrollTop";
import Error404Page from "./page/ErrorPages/Error404Page";
import MainPage from "./page/MainPage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import ChangePasswordPage from "./page/ChangePasswordPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignUpPage />} />
        {/* 비밀번호 찾기 */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* 404 에러 */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </>
  );
}

export default App;
