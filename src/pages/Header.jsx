import SelfBookingStore from "../store/SelfBookingStore";

const Header = () => {
  const headerPage = SelfBookingStore((state) => state.headerPage);
  const appPage = SelfBookingStore((state) => state.appPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const confirmationData = SelfBookingStore((state) => state.confirmationData);
  const forSomeoneElseConsent = SelfBookingStore(
    (state) => state.forSomeoneElseConsent
  );

  const pageByHeaderStep = [
    "visit type",
    "scheduler",
    "for who",
    "appointment confirmation",
    "complete",
  ];

  let pointPositions = [
    "left-[calc(20%-6px)]",
    "left-[calc(40%-6px)]",
    "left-[calc(60%-6px)]",
    "left-[calc(80%-6px)]",
    "left-[calc(92%-6px)]",
  ];

  const points = pointPositions.map((item, i) => {
    return (
      <span
        className={`${item} absolute -top-[3px] ${
          i < headerPage ? "h-0 w-0" : "h-3 w-3"
        } rounded-md bg-[#8380FF]`}
        key={i}
      ></span>
    );
  });

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
  const isForUserPage = appPage === "for user";
  const isForWhoPage = appPage === "for who";
  const isForSomeoneElsePage = appPage === "for someone else";
  const isContinueDisabled = isForSomeoneElsePage && !forSomeoneElseConsent;

  const handleContinue = () => {
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
  // const isContinueDisabled = headerPage === 4;

  return (
    <div
      className="headerWrapper bg-white mb-[24px] sm:w-auto lg:h-[70px] xl:h-[104px] flex justify-center items-center mx-auto rounded-[10px]"
      style={{ width: window.innerWidth < 600 ? "auto" : widthBlock, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)" }}
    >
      <div className="w-[90%] flex items-center gap-3">
        <button
          type="button"
          className={`font-sans font-[500] text-[15px] gap-[14px] flex items-center ${
            isBackDisabled
              ? "cursor-not-allowed text-gray-400"
              : "text-[#0A0A0A]"
          } duration-300`}
          onClick={handleBack}
          disabled={isBackDisabled}
        >
          <svg className="my-auto" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.6665 8.66699L0.666504 4.66699L4.6665 0.666992" stroke={isBackDisabled ? "#9AA1C2" : "#0A0A0A"} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Back</span>
        </button>
        <div className="flex-1 h-2 bg-[#BAC9FF] rounded-lg relative lg:px-6 xl:px-0">
          {points}
          <div
            className={`absolute h-2 ${
              headerPage === 0
                ? "w-[20%]"
                : headerPage === 1
                ? "w-[40%]"
                : headerPage === 2
                ? "w-[60%]"
                : headerPage === 3
                ? "w-[80%]"
                : headerPage === 4
                ? "w-[100%]"
                : ""
            } duration-700 left-0 top-[0px] bg-[#8380FF] rounded-md`}
          ></div>
          <div
            className={`absolute sm:w-[90px] sm:text-[12px] xl:text-[15px] xl:w-[125px] h-9 -top-[14px] ${
              headerPage === 0
                ? "left-[calc(20%-64px)]"
                : headerPage === 1
                ? "left-[calc(40%-64px)]"
                : headerPage === 2
                ? "left-[calc(60%-64px)]"
                : headerPage === 3
                ? "left-[calc(80%-64px)]"
                : headerPage === 4
                ? "left-[calc(92%-64px)]"
                : ""
            } duration-700 bg-[#7C67FF] rounded-[18px] flex justify-center items-center text-white text-[15px]/[20px] font-medium font-hebrew tracking-[0.675px]`}
          >
            {headerPage === 0
              ? "Visite type"
              : headerPage === 1
              ? "Schelude"
              : headerPage === 2
              ? "Booking"
              : headerPage === 3
              ? "Confirmation"
              : headerPage === 4
              ? "Complete"
              : ""}
          </div>
        </div>
        {(isForUserPage || isForWhoPage || isForSomeoneElsePage) && (
          <button
            type="button"
            className={`h-[40px] px-4 rounded-[8px] text-white text-[14px]/[18px] font-semibold duration-150 ${
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
        {/* <button
          type="button"
          className={`min-w-[90px] h-9 rounded-md text-[14px]/[18px] font-semibold ${
            isContinueDisabled
              ? "bg-[#E4E7F7] text-[#9AA1C2] cursor-not-allowed"
              : "bg-[#8380FF] hover:bg-[#6f6ce7] text-white"
          } duration-300`}
          onClick={() => navigateToStep(headerPage + 1)}
          disabled={isContinueDisabled}
        >
          Continue
        </button> */}
      </div>
    </div>
  );
};

export default Header;
