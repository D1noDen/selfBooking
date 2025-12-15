import { useForm } from "react-hook-form";
import SelfBookingStore from "../store/SelfBookingStore";

import backArrow from "../assets/images/self-booking/backArrow.svg";
import { useEffect, useRef, useState } from "react";

const ContinueAsPage = () => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setHumanStatus = SelfBookingStore((state) => state.setHumanStatus);
  const user = SelfBookingStore((state) => state.user);
  const setUser = SelfBookingStore((state) => state.setUser);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  const guestAction = () => {
    setAppPage("for who");
    setHeaderPage(3);
    setHumanStatus("guest");
    setUser(false);
  };

  const userAction = () => {
    setUser(true);
    setHumanStatus("logUser");
    setAppPage("continue as");
  };

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  return (
    <div
      className={`continueAsWrapper mx-auto mb-3`}
      style={{
        width: widthBlock,
        minHeight: 370,
      }}
    >
      <div
        className={`mainBlock max-w-[1420px] h-[656px]`}
        style={{
          height:
            _height >= 1080
              ? 690
              : _height - (_height > 1000 ? 390 : _width >= 1280 ? 360 : 390),
          minHeight: 370,
        }}
      >
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
    <div className={`choseStatusPage  mx-auto font-nunito h-full`}>
      <h1
        className={`text-[32px]/[44px] text-[#E8EAFF] font-semibold text-center relative h-[20%] flex items-center justify-center`}
      >
        Continue as:
        <div
          className={` absolute flex items-center`}
          style={{
            left: arrowPosition,
          }}
        >
          <img
            className={`cursor-pointer hover:scale-125 duration-300`}
            src={backArrow}
            alt="back"
            onClick={() => {
              setAppPage("scheduler");
              setHeaderPage(1);
            }}
          />
        </div>
      </h1>
      <div className={`cardBlock flex justify-center items-center h-[65%]`}>
        <div
          className={`selectGuest mx-[33px] max-h-[420px] rounded-[10px] px-[25px] lg:scale-[.90] xl:scale-100 ${
            _height < 840 ? "pb-3" : "lg:pb-3 xl:pb-8"
          } ${
            _height < 960
              ? _height < 900
                ? "pt-[100px] w-[300px]"
                : "pt-[150px] w-[320px]"
              : "pt-[214px] lg:w-[300px] xl:w-[360px]"
          }`}
          ref={widthStatusBlockRef}
        >
          <div
            className={`text-center text-[24px]/[33px] text-[#E8EAFF] font-bold ${
              _height < 840 ? "mb-2" : "mb-[15px]"
            }  tracking-[1.08px]`}
          >
            Guest
          </div>
          <p
            className={`text-[15px]/[20px] text-[#E8EAFF] font-normal tracking-[0.675px] text-center ${
              _height < 840 ? "mb-3" : "mb-[26px]"
            } `}
          >
            Opting for the 'Guest' login allows you to schedule appointments
            seamlessly, skipping the registration process.
          </p>
          <ContinueButton guestAction={guestAction} label={"guest"} />
        </div>
        <div
          className={`selectUser  mx-[33px] max-h-[420px] rounded-[10px] px-[25px] ${
            _height < 840 ? "pb-3" : "lg:pb-3 xl:pb-8"
          } lg:scale-[.90] xl:scale-100 ${
            _height < 960
              ? _height < 900
                ? "pt-[100px] w-[300px]"
                : "pt-[150px] w-[320px]"
              : "pt-[214px] lg:w-[300px] xl:w-[360px]"
          }`}
        >
          <div
            className={`text-center text-[24px]/[33px] text-[#E8EAFF] font-bold ${
              _height < 840 ? "mb-2" : "mb-[15px]"
            } tracking-[1.08px]`}
          >
            User
          </div>
          <p
            className={`text-[15px]/[20px] text-[#E8EAFF] font-normal tracking-[0.675px] text-center ${
              _height < 840 ? "mb-3" : "mb-[26px]"
            } mx-auto ${
              _height < 960 ? "w-[235px]" : "lg:w-[240px] xl:w-auto"
            }`}
          >
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
      <div className={`flex justify-center items-center h-[15%]`}>
        <div
          className={`text-white text-[15px]/[20px] font-normal tracking-[0.675px] text-center`}
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
    setAppPage("for who");
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

export default ContinueAsPage;
