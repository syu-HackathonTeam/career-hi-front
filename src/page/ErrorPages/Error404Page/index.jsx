import "./style.css";
import { useEffect, useState } from "react";

const Error404Page = () => {
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    const timer = setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/"; // 또는 원하는 경로
      }
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="error404Page flexCenter">
      <div className="error404Page-content">
        <div>{/* 이미지 */}</div>
        <p>잘못된 주소입니다</p>
        <p className="explanation">
          <span>{seconds}</span>초 뒤 기존 주소로 돌아갑니다.
        </p>
      </div>
    </section>
  );
};
export default Error404Page;
