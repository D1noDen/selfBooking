import SelfBookingStore from "../store/SelfBookingStore";

const Header = () => {
  const headerPage = SelfBookingStore((state) => state.headerPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  let pointPositions = [
    "left-[calc(20%-6px)]",
    "left-[calc(40%-6px)]",
    "left-[calc(60%-6px)]",
    "left-[calc(80%-6px)]",
    "left-[calc(92%-6px)]",
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
      className="headerWrapper bg-white mb-[24px] sm:w-auto lg:h-[70px] xl:h-[104px] flex justify-center items-center mx-auto rounded-[10px]"
      style={{ width: window.innerWidth < 600 ? "auto" : widthBlock, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)" }}
    >
      <div className="w-[90%] flex items-center gap-3">
        <div className="flex-1 h-2 bg-[#BAC9FF] rounded-lg relative lg:px-6 xl:px-0">
          {points}
          <div
            className={`absolute h-2 ${
              headerPage === 0
                ? "w-[20%]"
                : headerPage === 1
                ? "w-[40%]"
                : headerPage === 2
                ? "w-[60%]"
                : headerPage === 3
                ? "w-[80%]"
                : headerPage === 4
                ? "w-[100%]"
                : ""
            } duration-700 left-0 top-[0px] bg-[#8380FF] rounded-md`}
          ></div>
          <div
            className={`absolute sm:w-[90px] sm:text-[12px] xl:text-[15px] xl:w-[125px] h-9 -top-[14px] ${
              headerPage === 0
                ? "left-[calc(20%-64px)]"
                : headerPage === 1
                ? "left-[calc(40%-64px)]"
                : headerPage === 2
                ? "left-[calc(60%-64px)]"
                : headerPage === 3
                ? "left-[calc(80%-64px)]"
                : headerPage === 4
                ? "left-[calc(92%-64px)]"
                : ""
            } duration-700 bg-[#7C67FF] rounded-[18px] flex justify-center items-center text-white text-[15px]/[20px] font-medium font-hebrew tracking-[0.675px]`}
          >
            {headerPage === 0
              ? "Visite type"
              : headerPage === 1
              ? "Schelude"
              : headerPage === 2
              ? "Booking"
              : headerPage === 3
              ? "Confirmation"
              : headerPage === 4
              ? "Complete"
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
