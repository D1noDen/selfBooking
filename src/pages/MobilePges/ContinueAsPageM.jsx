import { useForm } from "react-hook-form";
import SelfBookingStore from "../../store/SelfBookingStore";

import backArrow from "../../assets/images/self-booking/backArrow.svg";
import { useEffect, useRef, useState } from "react";
import guestLogo from "../../assets/images/self-booking/guest.png";
import userLogo from "../../assets/images/self-booking/user.png";
import clinicLogo from "../../assets/images/self-booking/clinicLogo.png";
import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";

const ContinueAsPageM = () => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setHumanStatus = SelfBookingStore((state) => state.setHumanStatus);
  const user = SelfBookingStore((state) => state.user);
  const setUser = SelfBookingStore((state) => state.setUser);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  const guestAction = () => {
    setAppPage("for who mobile");
    setHeaderPage(3);
    setHumanStatus("guest");
    setUser(false);
  };

  const userAction = () => {
    setUser(true);
    setHumanStatus("logUser");
    setAppPage("continue as mobile");
  };

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  return (
    <div className={`continueAsWrapper`}>
      <div className={`mainBlock h-[700px]`}>
        {user ? (
          <SignIn
            setUser={setUser}
            setHumanStatus={setHumanStatus}
            setAppPage={setAppPage}
            setHeaderPage={setHeaderPage}
          />
        ) : (
          <ChoseStatus
            setAppPage={setAppPage}
            setHeaderPage={setHeaderPage}
            setUser={setUser}
            guestAction={guestAction}
            userAction={userAction}
            setHumanStatus={setHumanStatus}
          />
        )}
      </div>
    </div>
  );
};

const ContinueButton = ({ label, guestAction, userAction, setUser }) => {
  return (
    <div
      className={`w-[193px] h-10 py-[10px] bg-[#8380FF] hover:bg-[#6765de] duration-300 rounded-[5px] mx-auto text-[15px]/[20px] text-white font-semibold tracking-[0.675px] text-center cursor-pointer`}
      onClick={() => (label === "user" ? userAction(setUser) : guestAction())}
    >
      {"Continue"}
    </div>
  );
};

const ChoseStatus = ({
  setAppPage,
  setHeaderPage,
  setUser,
  user,
  guestAction,
  userAction,
  setHumanStatus,
}) => {
  let _width = window.innerWidth;
  let _height = window.innerHeight;
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  const widthStatusBlockRef = useRef(0);

  const [arrowPosition, setArrowPosition] = useState(0);

  useEffect(() => {
    setArrowPosition(
      (widthBlock - widthStatusBlockRef.current.clientWidth * 2) / 2 -
        (_width < 1280 ? 20 : 30)
    );
  }, [widthStatusBlockRef.current.clientWidth, _width, _height]);

  return (
    <div
      className={`choseStatusPage  mx-auto font-nunito h-[700px] pt-[27px] px-[16px] pb-[23px]`}
    >
      <div className="flex justify-center w-full relative mb-[12px]">
        <img
          src={chevronLeft}
          onClick={() => {
            setAppPage("choose a convenient time");
          }}
          className="h-[16px] w-[16px] absolute left-0"
        />
        <div className="w-[90px] h-[90px] rounded-[50%] bg-black">
          <img src={clinicLogo} className="w-[90px] h-[90px]" />
        </div>
      </div>
      <div className={`cardBlock flex text-[#E8EAFF] flex-col gap-[10px] `}>
        <div
          className={`selectGuestM flex flex-col items-center   w-[350px] rounded-[10px] px-[25px] `}
          ref={widthStatusBlockRef}
        >
          <p className="text-[24px]">Guest</p>
          <img className="w-[86px] h-[83px]" src={guestLogo} />
          <p className="text-center mb-[10px]">
            Opting for the 'Guest' login allows you to schedule appointments
            seamlessly, skipping the registration process.
          </p>
          <ContinueButton guestAction={guestAction} label={"guest"} />
        </div>
        <div
          className={`selectUserM flex flex-col items-center w-[350px] rounded-[10px] px-[25px]  `}
        >
          <p className="text-[24px]">User</p>
          <img className="w-[86px] h-[83px]" src={userLogo} />
          <p className="text-center mb-[10px]">
            Sign up and gain access to your medical records. Register with us
            for your personal health journey.
          </p>
          <ContinueButton
            userAction={userAction}
            label={"user"}
            setUser={setUser}
            user={user}
          />
        </div>
      </div>
      <div className={`flex justify-center items-center`}>
        <div
          className={`text-white mt-[10px] text-[15px]/[20px] font-normal tracking-[0.675px] text-center`}
        >
          {"Do you have an account?"}
          <span
            className={`text-[#77DEFF] hover:underline cursor-pointer duration-150`}
            onClick={() => {
              setUser(true);
              setHumanStatus("logUser");
            }}
          >
            {" Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

const SignIn = ({ setUser, setHumanStatus, setAppPage, setHeaderPage }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setHumanStatus("logUser");
    setAppPage("for who mobile");
    setHeaderPage(3);
  };

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  return (
    <div className={`flex items-center h-full`}>
      <div
        className={`signInBlock ${
          _height <= 850 ? "w-[320px]" : "w-[353px]"
        }  rounded-[10px] ${
          _height <= 850 ? "py-5" : "py-11"
        }  mx-auto relative`}
      >
        <div
          className={`text-[32px]/[44px] text-[#E8EAFF] font-nunito font-semibold tracking-[1.44px] text-center ${
            _height <= 850 ? "mb-[13px]" : "mb-[25px]"
          }  cursor-default`}
        >
          Sign in
        </div>
        <form className={`w-[265px] mx-auto`} onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`flex flex-col text-white ${
              _height <= 850 ? "mb-[10px]" : "mb-[15px]"
            } `}
          >
            <label
              htmlFor="email"
              className={`text-[15px]/[18px] text-[#BBAFFF] font-inter font-normal tracking-[0.675px]`}
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              className={`rounded-[5px] bg-[rgba(53,34,140,0.37)] h-9 pl-[15px]`}
              {...register("email", { required: true })}
            />
            {errors.email?.type === "required" && (
              <p role="alert" className={`text-white`}>
                Email is required
              </p>
            )}
          </div>
          <div
            className={`flex flex-col ${
              _height <= 850 ? "mb-[10px]" : "mb-[15px]"
            }`}
          >
            <label
              htmlFor="password"
              className={`text-[15px]/[18px] text-[#BBAFFF] font-inter font-normal tracking-[0.675px]`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`rounded-[5px] bg-[rgba(53,34,140,0.37)] h-9 pl-[15px] text-white`}
              {...register("password", { required: true })}
            />
          </div>
          <input
            value={"Sign in"}
            type="submit"
            className={`w-full h-10 rounded-[5px] bg-[#8380FF] text-white text-[15px]/[20px] font-nunito font-semibold tracking-[0.675px] ${
              _height <= 850 ? "mb-[15px]" : "mb-[20px]"
            } cursor-pointer hover:bg-[#6765de] duration-300`}
          />
        </form>
        <div
          className={`flex justify-center items-center ${
            _height <= 850 ? "mb-[15px]" : "mb-5"
          }`}
        >
          <hr className={`w-[70px] border-[2px] border-[#6858CC]`} />
          <span
            className={`text-[14px]/[17px] text-[#BBAFFF] font-inter font-medium mx-3 cursor-default`}
          >
            Or Continue With
          </span>
          <hr className={`w-[70px] border-[2px] border-[#6858CC]`} />
        </div>
        <div className={`flex justify-center`}>
          <div
            className={`googleLogin w-[83px] h-[41px] rounded-lg bg-[rgba(53,34,140,0.37)] mx-[10px] cursor-pointer hover:scale-110 duration-300`}
          ></div>
          <div
            className={`appleLogin w-[83px] h-[41px] rounded-lg bg-[rgba(53,34,140,0.37)] mx-[10px] cursor-pointer hover:scale-110 duration-300`}
          ></div>
        </div>
        <img
          className={` absolute top-0 -left-[76px] cursor-pointer hover:scale-125 duration-300`}
          src={backArrow}
          alt="back"
          onClick={() => setUser(false)}
        />
      </div>
    </div>
  );
};

export default ContinueAsPageM;
