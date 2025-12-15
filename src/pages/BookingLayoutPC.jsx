import { useEffect, useRef, useState } from "react";
import useResize from "./pageSize";

import Header from "./Header";
import Footer from "./Footer";
import VisiteTypePage from "./VisiteTypePage";
import SchedulerPage from "./SchedulerPage";
import ContinueAsPage from "./ContinueAsPage";
import ForWhoPage from "./ForWhoPage";
import ForSomeoneElsePage from "./ForSomeoneElsePage";
import ForUserPage from "./ForUserPage";
import ForGuestPage from "./ForGuestPage";
import FinalPage from "./FinalPage";

const BookingLayoutPC = ({
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
      className={`bookingAppointmentPage  pt-[0px] w-screen ${
        _width < 1024 ? "bg-[#FFF]" : "bg-[#F4F7FF]"
      } ${paddingB ? "pb-[260px]" : ""}`}
      style={{
        height: _height < mainBlock.current.scrollHeight ? `100%` : `100vh`,
        minHeight: 768,
      }}
      ref={mainBlock}
      onClick={() => {}}
    >
     
      <div className="bookingAppointmentWrapper max-w-[1420px]  h-full">
        <Header />
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
        ) : appPage === "continue as" ? (
          <ContinueAsPage />
        ) : appPage === "for who" ? (
          <ForWhoPage />
        ) : appPage === "for guest page" ? (
          <ForGuestPage mainBlock={mainBlock} />
        ) : appPage === "for someone else" ? (
          <ForSomeoneElsePage />
        ) : appPage === "for user" ? (
          <ForUserPage />
        ) : appPage === "complete" ? (
          <FinalPage />
        ) : (
          ""
        )}
        {(headerPage === 0 ||
          headerPage === 2 ||
          (headerPage === 3 && appPage === "for who")) && <Footer />}
      </div>
    </div>
  );
};

export default BookingLayoutPC;
