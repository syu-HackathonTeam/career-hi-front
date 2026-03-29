import { MoonLoader } from "react-spinners";

const SpinnersCP = ({ color = "#fe7ba0", size = 16, height = "100%" }) => {
  return (
    <div className="absolute w-full flexCenter" style={{ height }}>
      <MoonLoader color={color} size={size} speedMultiplier={0.8} />
    </div>
  );
};
export default SpinnersCP;
