import clinicLogo from "../assets/images/self-booking/clinicLogo.png";
import clockIcon from "../assets/images/self-booking/clock.svg";
import geoPointIcon from "../assets/images/self-booking/geoPoint.svg";
import phoneIcon from "../assets/images/self-booking/phoneIcon.svg";
import SelfBookingStore from "../store/SelfBookingStore";
import MiniFooter from "./MobilePges/MiniFooter";

const Footer = () => {
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  let _width = window.innerWidth;

  const footerForBigScreen = (
    <div
      className={`flex sm:w-auto sm:flex-col lg:flex-row bg-white items-center mx-auto z-10 shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]`}
      style={{ width: innerWidth < 600 ? "w-auto" : widthBlock }}
    >
      <div
        className={`flex sm:gap-[20px] gap-0 lg:w-1/2 xl:w-[52%]  lg:flex-row`}
      >
        <div
          className={`sm:flex sm:items-center xl:block xl:items-baseline xl:pt-0 lg:pt-[10px] xl:pl-[30px] lg:pl-[20px]`}
        >
          <img
            className={`sm:h-[70px] sm:w-[70px] lg:w-[90px] lg:h-[90px]`}
            src={clinicLogo}
            alt="clinic logo"
          />
        </div>
        <div
          className={`xl:pt-5 lg:pt-3 xl:pl-[35px] lg:pl-[30px] flex flex-col`}
        >
          <h2
            className={`sm:text-[18px] lg:text-[20px]/[27px] text-[#64697E] font-nunito font-semibold lg:mb-2 xl:mb-5`}
          >
            Warsaw Dental Center
          </h2>
          <div
            className={`sm:text-[10px] flex font-nunito lg:text-[15px] xl:text-[16px]/[22px] text-[#64697E] tracking-[0.72px]`}
          >
            <div
              className={`sm:max-w-[140px] flex flex-col xl:max-w-[200px] lg:mr-8 xl:mr-[76px] lg:mb-3 xl:mb-0`}
            >
              <img
                className={`w-5  h-5 xl:mb-[13px] lg:mb-2`}
                src={clockIcon}
                alt="clock"
              />
              <span>Pon. — Pt. 9.00 — 21.00</span>
              <span>ul. Topiel 11, 00-342 Warszawa</span>
            </div>
            <div
              className={`sm:max-w-[140px] flex flex-col xl:max-w-[184px] items-start`}
            >
              <img
                className={`h-5 xl:mb-[13px] lg:mb-2`}
                src={geoPointIcon}
                alt="geo point"
              />
              <span>Warsaw Dental Center Leończak Kupryś Sp.k.</span>
              <span>NIP: 1182180875</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`p-3 pr-5 lg:w-1/2 xl:w-[48%]`}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=21.02241396903992%2C52.23806317354728%2C21.02595448493958%2C52.23953814682495&amp;layer=mapnik&marker=52.23880,21.02452"
          width="100%"
          height="215"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={`mx-auto lg:h-[250px] xl:h-[220px]`}
        ></iframe>
      </div>
    </div>
  );

  const footerForSmallScreen = (
    <div className="py-[24px] px-[16px] flex flex-col gap-[12px]">
      <p className="text-[20px] text-[#64697E] text-center">
        Warsaw Dental Center
      </p>
      <div className="text-[#272626] text-[13px] flex justify-between">
        <div className="flex flex-col gap-[6px] items-start">
          <img className={`h-5 `} src={geoPointIcon} alt="geo point" />
          <div className="flex flex-col w-[160px]">
            <span>Warsaw Dental Center Leończak Kupryś Sp.k.</span>
            <span>ul.Topiel 11</span>
            <span>00-342 Warszawa</span>
            <span>NIP: 1182180875</span>
          </div>
        </div>
        <div className="flex flex-col gap-[4px] items-end">
          <img className={`h-5 `} src={clockIcon} alt="geo point" />
          <div className="flex flex-col">
            <span>Pon.-Pt. 9.00-21.00</span>
            <span>00-342 Warszawa</span>
          </div>
          <img className={`h-5 `} src={phoneIcon} alt="geo point" />
          <div className="flex flex-col">
            <span>+48 632 369 258</span>
            <span>+48 632 785 654</span>
          </div>
        </div>
      </div>
      <div className="footerMap">
        <iframe
          width="340"
          height="200"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={`mx-auto rounded-[20px] `}
          src="https://www.openstreetmap.org/export/embed.html?bbox=21.02241396903992%2C52.23806317354728%2C21.02595448493958%2C52.23953814682495&amp;layer=mapnik&marker=52.23880,21.02452"
        ></iframe>
      </div>
      <MiniFooter />
    </div>
  );

  return <>{_width < 1024 ? footerForSmallScreen : footerForBigScreen}</>;
};

export default Footer;
