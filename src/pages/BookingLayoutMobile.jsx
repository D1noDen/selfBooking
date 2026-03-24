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
import SelfBookingStore from "../store/SelfBookingStore";

const BookingLayoutMobile = ({
  types,
  setSesionStorage,
  paddingB,
  appPage,
  headerPage,
}) => {
  const mainBlock = useRef(0);
  const pageSize = useResize();
  const flashMessage = SelfBookingStore((state) => state.flashMessage);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (mainBlock.current && typeof mainBlock.current.scrollTo === "function") {
      mainBlock.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [appPage]);

  useEffect(() => {
    if (!flashMessage) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const prevBody = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overscrollBehavior: document.body.style.overscrollBehavior,
      height: document.body.style.height,
    };
    const prevHtml = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
      height: document.documentElement.style.height,
    };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";
    const preventScroll = (event) => {
      event.preventDefault();
    };
    const preventKeys = (event) => {
      const blocked = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar",
      ];
      if (blocked.includes(event.key)) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys);
    document.addEventListener("wheel", preventScroll, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchmove", preventScroll, {
      passive: false,
      capture: true,
    });
    return () => {
      document.body.style.overflow = prevBody.overflow;
      document.body.style.position = prevBody.position;
      document.body.style.top = prevBody.top;
      document.body.style.width = prevBody.width;
      document.body.style.overscrollBehavior = prevBody.overscrollBehavior;
      document.body.style.height = prevBody.height;
      document.documentElement.style.overflow = prevHtml.overflow;
      document.documentElement.style.overscrollBehavior =
        prevHtml.overscrollBehavior;
      document.documentElement.style.height = prevHtml.height;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
      document.removeEventListener("wheel", preventScroll, { capture: true });
      document.removeEventListener("touchmove", preventScroll, {
        capture: true,
      });
      window.scrollTo(0, scrollY);
    };
  }, [flashMessage]);

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
        {flashMessage && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-6">
            <div className="w-full max-w-[520px] rounded-[16px] bg-white px-6 py-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              <div className="text-[16px] font-semibold text-[#1F2937]">
                {flashMessage}
              </div>
            </div>
          </div>
        )}
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
