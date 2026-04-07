import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
import { useAppTranslation } from "../i18n/useAppTranslation";
import useAuth from "../store/useAuth";

const BookingLayoutMobile = ({
  types,
  setSesionStorage,
  paddingB,
  appPage,
  headerPage,
}) => {
  const {t} = useAppTranslation();
  const mainBlock = useRef(0);
  const pageSize = useResize();
  const flashMessage = SelfBookingStore((state) => state.flashMessage);
  const setFlashMessage = SelfBookingStore((state) => state.setFlashMessage);
  const { auth } = useAuth();
  const authHandledRef = useRef(false);
  const apiErrorHandledRef = useRef(false);

  useEffect(() => {
    if (authHandledRef.current) return;
    if (auth) return;
    authHandledRef.current = true;
    setFlashMessage(
      t(
        "invalid_booking_link",
        "Your booking link is invalid or has expired. Please start over."
      )
    );
  }, [auth, setFlashMessage, t]);

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (apiErrorHandledRef.current) {
          return Promise.reject(error);
        }
        const status = error?.response?.status;
        let message = "";
        if (status === 404) {
          message = t(
            "invalid_booking_link",
            "Your booking link is invalid or has expired. Please start over."
          );
        } else if (!error?.response) {
          message = t(
            "api_unavailable",
            "The server is not responding. Please try again."
          );
        } else {
          message =
            error?.response?.data?.DisplayMessage ||
            t("api_error", "Something went wrong. Please try again.");
        }
        apiErrorHandledRef.current = true;
        setFlashMessage(message);
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [setFlashMessage, t]);

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
            <div className="bg-white flex flex-col rounded-2xl justify-center items-center text-center w-max px-[33.5px] py-[32px]" style={{boxShadow: '0px 15px 25px -12px #0000001F'}}>
              <svg className="animate-pulse" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="72" height="72" rx="36" fill="#FFDBDB"/>
                <rect x="4" y="4" width="72" height="72" rx="36" stroke="#FFF0F0" stroke-width="8"/>
                <path d="M40 60C51.0457 60 60 51.0457 60 40C60 28.9543 51.0457 20 40 20C28.9543 20 20 28.9543 20 40C20 51.0457 28.9543 60 40 60Z" stroke="#E7000B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M40 32V40" stroke="#E7000B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M40 48H40.02" stroke="#E7000B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div className="flex flex-col mt-[12px] gap-2 max-w-[390px]">
                <h2 className="text-[#101828] text-[20px] font-[600] font-hebrew">
                  {t("invalid_booking_link_title", "Booking Link Invalid")}
                </h2>
                <p className='text-[#4A5565] text-[16px] font-[400] font-hebrew'>
                  {flashMessage}
                </p>
                <button 
                  style={{boxShadow: '0px 2px 8px 0px #0000001A'}}
                  className="bg-[#8380FF] rounded-[10px] p-[15.5px] text-white text-[16px] font-[600] font-hebrew"
                >
                  {t("start_over", "Start Over")}
                </button>
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
