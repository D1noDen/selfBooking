import { useEffect, useRef } from "react";

import Header from "./Header";
import Footer from "./Footer";
import StepNavigationFooter from "./StepNavigationFooter";
import VisiteTypePage from "./VisiteTypePage";
import SchedulerPage from "./SchedulerPage";
import ForWhoPage from "./ForWhoPage";
import ForSomeoneElsePage from "./ForSomeoneElsePage";
import ForUserPage from "./ForUserPage";
import FinalPage from "./FinalPage";
import AppointmentConfirmationPage from "./AppointmentConfirmationPage";
import SelfBookingStore from "../store/SelfBookingStore";
import { useAppTranslation } from "../i18n/useAppTranslation";

const BookingLayoutPC = ({
  types,
  setSesionStorage,
  appPage,
  headerPage,
}) => {
  const mainBlock = useRef(0);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const flashMessage = SelfBookingStore((state) => state.flashMessage);
  const { t } = useAppTranslation();
  const isDesktopNarrow = window.innerWidth < 1024;
  const isVisitTypePage = appPage === "visit type";

  useEffect(() => {
    if (appPage === "continue as") {
      setAppPage("for who");
      setHeaderPage(2);
    }
  }, [appPage, setAppPage, setHeaderPage]);

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

  return (
    <div
      className={`bookingAppointmentPage w-full ${
        isDesktopNarrow ? "bg-[#FFF]" : "bg-[#F4F7FF]"
      } ${
        isVisitTypePage ? "min-h-[100dvh] overflow-visible" : "h-[100dvh] overflow-hidden"
      }`}
      ref={mainBlock}
      onClick={() => {}}
    >
      <div
        className={`bookingAppointmentWrapper mx-auto flex flex-col pt-[33px] pb-[35px] ${
          isVisitTypePage ? "h-auto" : "h-full min-h-0"
        }`}
        style={{ width: window.innerWidth < 600 ? "auto" : widthBlock }}
      >
        {appPage !== "complete" && (
          <div className="flex-shrink-0">
            <Header />
          </div>
        )}
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
        <main
          className={`scrollmainContent ${
            isVisitTypePage
              ? "overflow-visible"
              : "flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
          }`}
        >
          {appPage === "visit type" ? (
            <VisiteTypePage
              visitTypeArr={types}
              setSesionStorage={setSesionStorage}
            />
          ) : appPage === "scheduler" ? (
            <SchedulerPage
              setSesionStorage={setSesionStorage}
              visitTypeArr={types}
            />
          ) : appPage === "for who" ? (
            <ForWhoPage />
          ) : appPage === "for guest page" ? (
            <ForUserPage />
          ) : appPage === "for someone else" ? (
            <ForSomeoneElsePage />
          ) : appPage === "for user" ? (
            <ForUserPage />
          ) : appPage === "appointment confirmation" ? (
            <AppointmentConfirmationPage />
          ) : appPage === "complete" ? (
            <FinalPage />
          ) : (
            ""
          )}
        </main>
        <div className="flex-shrink-0">
          {headerPage === 0 && <Footer />}
          {appPage !== "complete" && <StepNavigationFooter />}
        </div>
      </div>
    </div>
  );
};

export default BookingLayoutPC;
