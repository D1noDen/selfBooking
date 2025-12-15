import { useEffect, useState } from "react";
import SelfBookingStore from "../store/SelfBookingStore";

const Header = () => {
  const headerPage = SelfBookingStore((state) => state.headerPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  let pointPositions = [
    "left-[calc(16%-6px)]",
    "left-[calc(33%-6px)]",
    "left-[calc(50%-6px)]",
    "left-[calc(67%-6px)]",
    "left-[calc(84%-6px)]",
  ];

  const points = pointPositions.map((item, i) => {
    return (
      <span
        className={`${item} absolute -top-[3px] ${
          i < headerPage ? "h-0 w-0" : "h-3 w-3"
        } rounded-md bg-[#8380FF]`}
        key={i}
      ></span>
    );
  });

  return (
    <div
      className="headerWrapper bg-white sm:mb-[25px] sm:w-auto lg:h-[70px] xl:h-[104px] shadow-[0_4px_17px_0_rgba(0,0,0,0.08)] xl:mb-[10px] flex justify-center items-center mx-auto"
      style={{ width: window.innerWidth < 600 ? "w-auto" : widthBlock }}
    >
      <div className=" w-[90%] h-2 bg-[#BAC9FF] rounded-lg relative lg:px-6 xl:px-0">
        {points}
        <div
          className={`absolute h-2 ${
            headerPage === 0
              ? "w-[16%]"
              : headerPage === 1
              ? "w-[33%]"
              : headerPage === 2
              ? "w-[50%]"
              : headerPage === 3
              ? "w-[67%]"
              : headerPage === 4
              ? "w-[100%]"
              : ""
          } duration-700 left-0 top-[0px] bg-[#8380FF] rounded-md`}
        ></div>
        <div
          className={`absolute sm:w-[90px] sm:text-[12px] xl:text-[15px] xl:w-[125px] h-9 -top-[14px] ${
            headerPage === 0
              ? "left-[calc(16%-64px)]"
              : headerPage === 1
              ? "left-[calc(33%-64px)]"
              : headerPage === 2
              ? "left-[calc(50%-64px)]"
              : headerPage === 3
              ? "left-[calc(67%-64px)]"
              : headerPage === 4
              ? "left-[calc(84%-64px)]"
              : ""
          } duration-700 bg-[#7C67FF] rounded-[18px] flex justify-center items-center text-white text-[15px]/[20px] font-medium font-hebrew tracking-[0.675px]`}
        >
          {headerPage === 0
            ? "Visite type"
            : headerPage === 1
            ? "Schelude"
            : headerPage === 2
            ? "Continue as"
            : headerPage === 3
            ? "Booking"
            : headerPage === 4
            ? "Complete"
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Header;
