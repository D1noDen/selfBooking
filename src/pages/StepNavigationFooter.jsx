import SelfBookingStore from "../store/SelfBookingStore";

const StepNavigationFooter = () => {
  const headerPage = SelfBookingStore((state) => state.headerPage);
  const appPage = SelfBookingStore((state) => state.appPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const confirmationData = SelfBookingStore((state) => state.confirmationData);
  const forSomeoneElseConsent = SelfBookingStore(
    (state) => state.forSomeoneElseConsent
  );
  const schedulerHasSelection = SelfBookingStore(
    (state) => state.schedulerHasSelection
  );

  const pageByHeaderStep = [
    "visit type",
    "scheduler",
    "for who",
    "appointment confirmation",
    "complete",
  ];

  const navigateToStep = (nextStep) => {
    if (nextStep < 0 || nextStep > 4) return;
    setHeaderPage(nextStep);
    setAppPage(pageByHeaderStep[nextStep]);
  };

  const handleBack = () => {
    if (headerPage <= 0) return;

    if (
      appPage === "for user" ||
      appPage === "for someone else" ||
      appPage === "for guest page"
    ) {
      setHeaderPage(2);
      setAppPage("for who");
      return;
    }

    if (appPage === "appointment confirmation") {
      const previousBookingPage =
        confirmationData?.source === "for someone else"
          ? "for someone else"
          : "for user";
      setHeaderPage(2);
      setAppPage(previousBookingPage);
      return;
    }

    navigateToStep(headerPage - 1);
  };

  const isBackDisabled = headerPage === 0;
  const isStepBackDisabled = headerPage === 0;
  const isStepNextDisabled = headerPage === 4;
  const isForUserPage = appPage === "for user";
  const isForWhoPage = appPage === "for who";
  const isForSomeoneElsePage = appPage === "for someone else";
  const isSchedulerPage = appPage === "scheduler";
  const isContinueDisabled =
    (isForSomeoneElsePage && !forSomeoneElseConsent) ||
    (isSchedulerPage && !schedulerHasSelection);

  const handleContinue = () => {
    if (isSchedulerPage) {
      setHeaderPage(2);
      setAppPage("for who");
      return;
    }

    const formId = isForUserPage
      ? "for-user-form"
      : isForWhoPage
      ? "for-who-form"
      : isForSomeoneElsePage
      ? "for-someone-else-form"
      : "";
    const form = formId ? document.getElementById(formId) : null;
    if (!form) return;
    if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
      return;
    }
    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };

  const handleTempStepSwitch = (direction) => {
    navigateToStep(headerPage + direction);
  };

  return (
    <div
      className="bg-white mt-[24px] mx-auto rounded-[10px] min-h-[88px] flex items-center"
      style={{
        width: window.innerWidth < 600 ? "auto" : widthBlock,
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)",
      }}
    >
      <div className="w-[95%] mx-auto flex items-center justify-between">
        <button
          type="button"
          className={`h-[44px] px-5 rounded-[8px] text-[15px] font-sans font-[500] flex items-center gap-[10px] duration-300 ${
            isBackDisabled
              ? "cursor-not-allowed text-gray-400 bg-[#F6F7FB]"
              : "text-[#0A0A0A] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]"
          }`}
          style={{boxShadow: "0px 2px 12px 0px #0000000F"}}
          onClick={handleBack}
          disabled={isBackDisabled}
        >
          <svg
            className="my-auto"
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.6665 8.66699L0.666504 4.66699L4.6665 0.666992"
              stroke={isBackDisabled ? "#9AA1C2" : "#0A0A0A"}
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back</span>
        </button>

        {/* Temp without pick time */}
        {/* <div className="flex items-center gap-2">
          <button
            type="button"
            className={`h-[36px] px-3 rounded-[8px] text-[13px] font-sans font-[500] duration-150 ${
              isStepBackDisabled
                ? "bg-[#F6F7FB] text-gray-400 cursor-not-allowed"
                : "bg-[#FFFFFF] text-[#0A0A0A] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]"
            }`}
            onClick={() => handleTempStepSwitch(-1)}
            disabled={isStepBackDisabled}
          >
            Prev step
          </button>
          <button
            type="button"
            className={`h-[36px] px-3 rounded-[8px] text-[13px] font-sans font-[500] duration-150 ${
              isStepNextDisabled
                ? "bg-[#F6F7FB] text-gray-400 cursor-not-allowed"
                : "bg-[#FFFFFF] text-[#0A0A0A] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]"
            }`}
            onClick={() => handleTempStepSwitch(1)}
            disabled={isStepNextDisabled}
          >
            Next step
          </button>
        </div> */}

        {(isSchedulerPage || isForUserPage || isForSomeoneElsePage) && (
          <button
            type="button"
            className={`h-[44px] px-6 rounded-[8px] text-white text-[14px]/[18px] font-semibold duration-150 ${
              isContinueDisabled
                ? "bg-[#B9B4E9] cursor-not-allowed"
                : "bg-[#7C67FF] hover:bg-[#7059F6]"
            }`}
            onClick={handleContinue}
            disabled={isContinueDisabled}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigationFooter;
