import SelfBookingStore from "../../store/SelfBookingStore";

import clinicLogo from "../../assets/images/self-booking/clinicLogo.png";
import geoPointIcon from "../../assets/images/self-booking/geoPoint.svg";
import phoneIcon from "../../assets/images/self-booking/phoneIcon.svg";

const ChooseACompanyM = () => {
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  let _width = window.innerWidth;
  let _height = window.innerHeight;
  return (
    <div>
      <div
        className={`visitTypePageMobile gap-[24px] pt-[30px] px-[20px]  w-auto h-[750px] text-[20px] mx-auto flex flex-col `}
      >
        <div className="flex flex-col gap-[32px] ">
          <div className="flex justify-center">
            <div className="w-[90px] h-[90px] rounded-[50%] bg-black">
              <img src={clinicLogo} className="w-[90px] h-[90px]" />
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-[12px]">
            <p className="text-white text-[32px]">Choose a company</p>
            <p className="text-[#CDCDEB] text-center ">
              Choose the company under which you want to log in to the account
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[12px] text-white items-center">
          <div className="clinicContainer">
            <p className="text-[18px]">Dental Clinic</p>
            <div className="flex gap-[16px]">
              <div className="flex gap-[8px]">
                <img src={geoPointIcon} className="w-[14px] h-[20px]" />
                <div className="text-[13px]">
                  Topiel 11 street <br />
                  00-342 Warszawa
                </div>
              </div>
              <div className="flex gap-[8px]">
                <img className="w-[20px] h-[20px]" src={phoneIcon} />
                <div className="text-[13px]">
                  +48 632 369 258 <br />
                  +48 632 785 654
                </div>
              </div>
            </div>
          </div>
          <div className="clinicContainer">
            <p className="text-[18px]">Dental Clinic</p>
            <div className="flex gap-[16px]">
              <div className="flex gap-[8px]">
                <img src={geoPointIcon} className="w-[14px] h-[20px]" />
                <div className="text-[13px]">
                  Topiel 11 street <br />
                  00-342 Warszawa
                </div>
              </div>
              <div className="flex gap-[8px]">
                <img className="w-[20px] h-[20px]" src={phoneIcon} />
                <div className="text-[13px]">
                  +48 632 369 258 <br />
                  +48 632 785 654
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseACompanyM;
