const ButtonCP = ({ bg, color, children, fontSize }) => {
  return <div className={`${bg} ${color} ${fontSize || "B4"} w-full max-w-105 h-13 flexCenter  cursor-pointer rounded-lg px-4`}>{children}</div>;
};
export default ButtonCP;
