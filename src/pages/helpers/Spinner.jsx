import "../../assets/scss/SelfBooking/BookingAppointment.scss";
// import { InterceptorsStore } from '../store/Interceptors';
// import {GlobalHookWindowSummary} from "../helpers/GlobalHookWindowSummary.js";
// import withLoyout from "../store/headerStore.js";
import React, { useEffect, useState } from "react";
const Spinner = () => {
  // const {screenSize} = GlobalHookWindowSummary();
  // const {openSide, openMidleSide} = withLoyout();
  // const {Interceptors , setInterceptors} = InterceptorsStore();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 300);

    return () => clearTimeout(timer);
  });
  return (
    showSpinner && (
      <>
        <div className="bg-slate-300 opacity-75 h-full w-full fixed left-0 top-0 z-[9999]">
          <div className="lds-spinner z-50">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </>
    )
  );
};

export default Spinner;
