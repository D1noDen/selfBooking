import SelfBookingStore from "../../store/SelfBookingStore";

import clinicLogo from "../../assets/images/self-booking/clinicLogo.png";
import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";

const ForWhoM = ({ setSesionStorage }) => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);

  return (
    <div className="visitTypePageMobile py-[26px] px-[15px] screen-520:my-[0] gap-[16px] screen-520:mx-[auto] h-[600px] sm:m-0 sm:w-auto sm:text-[20px] mx-auto flex flex-col relatice">
      <img
        src={chevronLeft}
        onClick={() => {
          setAppPage("upcoming schedule");
        }}
        className="absolute z-[10] top-[30px] left-[auto] h-[16px] w-[16px]"
      />
      <div className="flex justify-center w-full relative mb-[12px]">
        <div className="w-[90px] h-[90px] rounded-[50%] bg-black">
          <img src={clinicLogo} className="w-[90px] h-[90px]" />
        </div>
      </div>
      <p
        className={`text-[24px] px-[15px] font-nunito font-semibold text-white text-center tracking-[1.44px]`}
      >
        Are you scheduling this appointment for you, or someone else?
      </p>
      <div className={`flex-col gap-[12px] justify-normal flex-nowrap flex`}>
        <div
          className={`appointment h-[44px] flex items-center rounded-lg pl-5 font-nunito text-[18px]/[25px] text-white tracking-[0.81px] cursor-pointer bg-[rgba(53,34,140,0.37)] hover:text-[#b6aafd] relative z-[5] overflow-hidden duration-500`}
          onClick={() => {
            setAppPage("for patient mobile");
          }}
        >
          <div className={`z-[4]`}>Scheduling for me</div>
          <div
            className={`${
              (window, innerWidth < 1020 ? "" : "activeAnimation")
            } absolute top-0 w-full h-full z-[3] duration-500`}
          ></div>
        </div>
        <div
          className={`appointment h-[44px] flex items-center rounded-lg pl-5 font-nunito text-[18px]/[25px] text-white tracking-[0.81px] cursor-pointer bg-[rgba(53,34,140,0.37)] hover:text-[#b6aafd] relative z-[5] overflow-hidden duration-500`}
          onClick={() => {
            setAppPage("for someone else guardian mobile");
          }}
        >
          <div className={`z-[4]`}>Scheduling for someone else</div>
          <div
            className={`${
              (window, innerWidth < 1020 ? "" : "activeAnimation")
            } absolute top-0 w-full h-full z-[3] duration-500`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ForWhoM;
