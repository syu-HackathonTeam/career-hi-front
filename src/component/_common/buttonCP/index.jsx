const ButtonCP = ({ bg, color, children, fontSize }) => {
  return <div className={`${bg} ${color} ${fontSize} w-full max-w-[420px] h-13 flexCenter  cursor-pointer rounded-lg `}>{children}</div>;
};
export default ButtonCP;
