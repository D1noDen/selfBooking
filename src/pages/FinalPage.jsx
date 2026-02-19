import { useEffect } from "react";
import SelfBookingStore from "../store/SelfBookingStore";
import { clearBookingInformation } from "../helpers/bookingStorage";

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

  const whatsNewList = [{text: "You'll receive a confirmation email with all appointment details"}, {text: "Please arrive 10 minutes before your scheduled time"}, {text:"Bring a valid ID and insurance card (if applicable)"}, {text:"You can reschedule or cancel up to 24 hours before your appointment"}]

  useEffect(() => {
    setGuardianInfo({});
    setPatientInfo({});
    setAppointmentTime({});
    setChosenDoctor({});
  }, []);

  return (
    <div
      className={`pb-[30px] mx-auto`}
      style={{
        width: widthBlock,
        height: _height >= 1080 ? 1080 - 114 : 780,
        minHeight: 688,
      }}
    >
      <div
        className={`bg-white shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]
        rounded-[10px] w-full h-full flex flex-col`}
      >
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
          className={`text-[30px] text-[#8380FF] font-sans font-medium tracking-[1.62px] text-center`}
        >
          Appointment Confirmed!
        </div>
        <div
          className={`max-w-[600px] mx-auto text-center text-[18px] text-[#4A5565] font-sans font-[400] tracking-[0.81px] ${
            _height <= 850 ? "mb-0" : "mb-[25px]"
          } `}
        >
          Your appointment has been successfully booked. A confirmation email has been sent to your inbox.
        </div>
        <div style={{boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.06)"}} className='p-[25px] w-full max-w-[600px] mx-auto rounded-[10px] bg-white mb-[25px] mt-[30px] flex flex-col justify-start items-start'>
          <p className="text-[#101828] font-sans text-[18px]">What's Next?</p>
          <div className="flex flex-col text-[#4A5565] text-[13px] mt-[14px] font-sans">
            {whatsNewList?.map((content, index) => (
              <div className="flex gap-2" key={index}>
                <span className="text-[#8380FF] text-[16px] font-sans">•</span>
                <span>{content.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`w-full max-w-[600px] p-[16px] rounded-[8px] bg-[#8380FF] hover:bg-[#7059F6] duration-300 mx-auto flex justify-center items-center text-[14px] text-white font-sans font-medium tracking-[0.72px] cursor-pointer`}
          onClick={() => {
            if (_width < 1000) {
              setAppPage("visit type mobile");
            } else {
              setAppPage("visit type");
            }
            setHeaderPage(0);
            setUser(false);
            localStorage.removeItem("selfBooking-storage");
            clearBookingInformation();
          }}
        >
          Book another appointment
        </div>
      </div>
    </div>
  );
};

export default FinalPage;
