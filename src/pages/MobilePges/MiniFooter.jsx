import dentaSoftLogo from "../../assets/images/self-booking/dentaSoftLogo.png";
import chevronDown from "../../assets/images/self-booking/chevronDown.png";

const MiniFooter = () => {
  return (
    <div className="py-[24px] px-[16px] flex flex-col gap-[12px]  ">
      <div className="flex gap-[8px] justify-center ">
        <img src={dentaSoftLogo} className="w-[38px] h-[25px]" />
        <p className="text-[#535061] text-[20px]">Denta Soft</p>
      </div>
      <div className="flex justify-between w-full ">
        <div className="flex gap-[12px]">
          <p>English</p>
          <img src={chevronDown} />
        </div>
        <p>2034 © All rights reserved</p>
      </div>
    </div>
  );
};

export default MiniFooter;
