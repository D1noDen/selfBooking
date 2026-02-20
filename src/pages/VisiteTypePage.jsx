import SelfBookingStore from "../store/SelfBookingStore";
import { useEffect, useRef, useState } from "react";
import { useAppTranslation } from "../i18n/useAppTranslation";
import { getLocalizedVisitTypeLabel } from "../i18n/visitTypeLabel";

// const visitTypeArr = [
//     'Cosmetic Consultation',
//     'Emergency Consultation',
//     'Orthodontic Consultation',
//     'Whitening',
//     'Broken Tooth/ Crown/Inlay/ Filling',
//     'Prosthetics',
// ];

const VisiteTypePage = ({ visitTypeArr, setSesionStorage }) => {
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const { t, language } = useAppTranslation();

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
        className={`appointment sm:h-[60px] sm:w-[250px] lg:w-[360px] xl:w-[380px] lg:h-10 xl:h-[50px] flex items-center rounded-lg pl-5 font-nunito text-[18px]/[25px] text-white tracking-[0.81px]  cursor-pointer bg-[rgba(53,34,140,0.37)] ${
          swype[i] ? "hover:text-white" : ""
        } hover:text-[#b6aafd] relative z-[5] overflow-hidden duration-500 ${
          _height <= 810 ? " scale-90 mb-4" : " scale-100 lg:mb-5 xl:mb-10"
        }`}
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
                label: item.label,
                ukrLabel: item.ukrLabel,
                polLabel: item.polLabel,
              },
            });
            setHeaderPage(1);
            setAppPage("scheduler");
          }, 500);
        }}
      >
        <div className={`z-[4] ${swype[i] ? "text-white" : ""}`}>
          {getLocalizedVisitTypeLabel(item, language)}
        </div>
        <div
          className={`${
            (window, innerWidth < 700 ? "" : "activeAnimation")
          } absolute top-0 ${
            swype[i] ? "left-0" : "-left-[380px]"
          } w-full h-full z-[3] duration-500`}
        ></div>
      </div>
    );
  });

  const mainBlock = useRef(0);

  return (
    <>
      <div
        className={`visitTypePage rounded-[10px] screen-520:my-[0] screen-1440:w-[1360px] screen-1920:w-[1420px] screen-520:mx-[auto] min-h-[600px] h-fit lg:w-[944px]  sm:mb-[10px] xl:mb-0 sm:mt-[20px] xl:mt-[0px] sm:m-0 sm:w-auto sm:text-[20px] lg:text-[32px] py-[70px] mb-5 mx-auto flex flex-col lg:justify-center `}
        ref={mainBlock}
        style={{ width: window.innerWidth < 600 ? "w-auto" : widthBlock }}
      >
        <h1
          className={`lg:w-[600px] sm:pt-[20px] sm:text-[20px] lg:mx-auto lg:text-[32px]/[44px] font-nunito font-semibold text-white text-center tracking-[1.44px] mb-10 mt-0 lg:scale-90 xl:scale-100`}
        >
          {t("visit_type_title", "What type of appointment would you like to schedule?")}
        </h1>
        <div
          className={` ${
            _height <= 810
              ? "w-[760px]"
              : "sm:w-[410px]  lg:w-[780px] xl:w-[860px]"
          } sm:flex-col sm:items-center lg:flex-row sm:gap-[30px] lg:gap-[0px] lg:items-baseline  sm:justify-normal sm:flex-nowrap mx-auto flex lg:flex-wrap lg:justify-between`}
        >
          {visitTypeList}
        </div>
      </div>
    </>
  );
};

export default VisiteTypePage;
