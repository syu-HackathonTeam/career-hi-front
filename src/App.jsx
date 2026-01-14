import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./hook/useScrollTop";
import Error404Page from "./page/ErrorPages/Error404Page";
import MainPage from "./page/MainPage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 로그인 페이지 */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* 404 에러 */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </>
  );
}

export default App;
