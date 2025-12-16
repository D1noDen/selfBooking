import { useEffect } from "react";
import SelfBookingStore from "../store/SelfBookingStore";

import FinalPageImage from "../assets/images/self-booking/finalPageImage.gif";

const FinalPage = () => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setUser = SelfBookingStore((state) => state.setUser);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const setGuardianInfo = SelfBookingStore((state) => state.setGuardianInfo);
  const setChosenDoctor = SelfBookingStore((state) => state.setChosenDoctor);
  const setPatientInfo = SelfBookingStore((state) => state.setPatientInfo);
  const setAppointmentTime = SelfBookingStore(
    (state) => state.setAppointmentTime
  );

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  useEffect(() => {
    setGuardianInfo({});
    setPatientInfo({});
    setAppointmentTime({});
    setChosenDoctor({});
  }, []);

  return (
    <div
      className={`pb-[30px] mx-auto flex justify-center`}
      style={{
        width: widthBlock,
        height: _height >= 1080 ? 1080 - 114 : 780,
        minHeight: 688,
      }}
    >
      <div
        className={`bg-white ${
          _width < 1024
            ? "shadow-none"
            : "shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]"
        } w-full h-full flex flex-col ${
          _height <= 850 ? "justify-around" : "justify-center"
        } `}
      >
        <div
          className={`text-[36px]/[49px] text-[#7C67FF] font-hebrew font-semibold tracking-[1.62px] text-center`}
        >
          Thank you for your booking!
        </div>
        <div className={`flex justify-center`}>
          <img
            src={FinalPageImage}
            alt="gif"
            style={{
              height: _height <= 850 ? 300 : 400,
            }}
          />
        </div>
        <div
          className={`max-w-[600px] mx-auto text-center text-[18px]/[25px] text-[#5E5E5E] font-hebrew tracking-[0.81px] ${
            _height <= 850 ? "mb-0" : "mb-[25px]"
          } `}
        >
          Your appointment request has been received. Our team will be in touch
          with you to confirm details and finalize the process.
        </div>
        <div
          className={`${
            _width < 620 ? "w-full" : "w-[540px]"
          }  h-[50px] rounded-[5px] bg-[#7C67FF] hover:bg-[#7059F6] duration-300 mx-auto flex justify-center items-center text-[16px]/[22px] text-white font-nunito font-bold tracking-[0.72px] cursor-pointer`}
          onClick={() => {
            if (_width < 1000) {
              setAppPage("visit type mobile");
            } else {
              setAppPage("visit type");
            }
            setHeaderPage(0);
            setUser(false);
            sessionStorage.removeItem("selfBooking-storage");
          }}
        >
          Complete
        </div>
      </div>
    </div>
  );
};

export default FinalPage;
