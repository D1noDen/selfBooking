import { useEffect, useRef, useState } from "react";
import SelfBookingStore from "../../store/SelfBookingStore";

import clinicLogo from "../../assets/images/self-booking/clinicLogo.png";
const VisiteTypePageM = ({ visitTypeArr, setSesionStorage }) => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);

  const [swype, setSwype] = useState([]);

  let arr = [];
  visitTypeArr?.forEach(() => {
    arr.push(false);
  });

  useEffect(() => {
    setSwype(arr);
  }, []);

  const reset = () => {
    let arr = [];
    visitTypeArr.forEach(() => {
      arr.push(false);
    });
    setSwype(arr);
  };

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  const visitTypeList = visitTypeArr?.map((item, i) => {
    return (
      <div
        className={`appointment h-[44px] flex items-center rounded-lg pl-5 font-nunito text-[18px]/[25px] text-white tracking-[0.81px] cursor-pointer bg-[rgba(53,34,140,0.37)] hover:text-[#b6aafd] relative z-[5] overflow-hidden duration-500`}
        key={i}
        onMouseEnter={() => {
          reset();
        }}
        onClick={() => {
          let newSwype = JSON.parse(JSON.stringify(swype));
          newSwype[i] = true;
          setSwype(newSwype);
          setTimeout(() => {
            setSesionStorage({
              apoimentTypeId: {
                id: item.id,
                lebel: item.label,
              },
            });
            setAppPage("upcoming schedule");
          }, 500);
        }}
      >
        <div className={`z-[4]`}>{item.label}</div>
        <div
          className={`${
            (window, innerWidth < 1020 ? "" : "activeAnimation")
          } absolute top-0 w-full h-full z-[3] duration-500`}
        ></div>
      </div>
    );
  });

  const mainBlock = useRef(0);

  return (
    <>
      <div
        className={`visitTypePageMobile py-[26px] px-[15px] screen-520:my-[0] gap-[16px] screen-520:mx-[auto] h-fit min-h-[600px] sm:m-0 sm:w-auto sm:text-[20px] mx-auto flex flex-col `}
      >
        <div className="flex justify-center w-full relative mb-[12px]">
          <div className="w-[90px] h-[90px] rounded-[50%] bg-black">
            <img src={clinicLogo} className="w-[90px] h-[90px]" />
          </div>
        </div>
        <p
          className={`text-[24px] font-nunito font-semibold text-white text-center tracking-[1.44px]`}
        >
          What type of appointment would you like to schedule?
        </p>
        <div className={`flex-col gap-[12px] justify-normal flex-nowrap flex`}>
          {visitTypeList}
        </div>
      </div>
    </>
  );
};

export default VisiteTypePageM;
