import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./hook/useScrollTop";
import Error404Page from "./page/ErrorPages/Error404Page";
import MainPage from "./page/MainPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />

        {/* 404에러 */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </>
  );
}

export default App;
