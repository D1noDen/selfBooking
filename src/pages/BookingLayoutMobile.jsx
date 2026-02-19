import { useEffect, useRef, useState } from "react";
import useResize from "./pageSize";

import ChooseACompanyM from "./MobilePges/ChooseACompanyM";
import ContinueAsPageM from "./MobilePges/ContinueAsPageM";
import VisitTypePageM from "./MobilePges/VisitTypePageM";
import PatientExactInformation from "./MobilePges/PatientExactInformation";
import GuardianExactInformation from "./MobilePges/GuardianExactInformation";
import AppointmentInformation from "./MobilePges/AppointmentInformation";
import ForWhoM from "./MobilePges/ForWhoM";
import UpcomingScheduleM from "./MobilePges/UpcomingScheduleM";
import ChooseAConvinientTimeM from "./MobilePges/ChooseAConvinientTimeM";
import FinalPage from "./FinalPage";
import Footer from "./Footer";

const BookingLayoutMobile = ({
  types,
  setSesionStorage,
  paddingB,
  appPage,
  headerPage,
}) => {
  const mainBlock = useRef(0);
  const pageSize = useResize();

  let _width = window.innerWidth;
  let _height = window.innerHeight;
  return (
    <div
      className={`bookingAppointmentPage pt-[0px] w-full ${
        _width < 1024 ? "bg-[#FFF]" : "bg-[#F4F7FF]"
      } ${paddingB ? "pb-[260px]" : ""}`}
      style={{
        height: _height < mainBlock.current.scrollHeight ? `100%` : `100vh`,
        minHeight: 768,
      }}
      ref={mainBlock}
      onClick={() => {}}
    >
      <div className="bookingAppointmentWrapper mx-auto h-full">
        {appPage === "visit type mobile" ? (
          <VisitTypePageM
            visitTypeArr={types}
            setSesionStorage={setSesionStorage}
          />
        ) : appPage === "upcoming schedule" ? (
          <UpcomingScheduleM setSesionStorage={setSesionStorage} />
        ) : appPage === "choose a convenient time" ? (
          <ChooseAConvinientTimeM setSesionStorage={setSesionStorage} />
        ) : appPage === "continue as mobile" ? (
          <ContinueAsPageM />
        ) : appPage === "for who mobile" ? (
          <ForWhoM setSesionStorage={setSesionStorage} />
        ) : appPage === "for patient mobile" ||
          appPage === "patient exact information" ? (
          <PatientExactInformation mainBlock={mainBlock} />
        ) : appPage === "for someone else guardian mobile" ||
          appPage === "guardian exact information" ? (
          <GuardianExactInformation />
        ) : appPage === "appointment information mobile" ||
          appPage === "appointment information" ? (
          <AppointmentInformation />
        ) : appPage === "complete mobile" ? (
          <FinalPage />
        ) : (
          ""
        )}
        {appPage === "visit type mobile" ||
        appPage === "continue as mobile" ||
        appPage === "for who mobile" ? (
          <Footer />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default BookingLayoutMobile;
