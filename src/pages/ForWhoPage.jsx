import { useState } from "react";
import SelfBookingStore from "../store/SelfBookingStore";
import '../assets/scss/SelfBooking/BookingAppointment.scss';
import { useAppTranslation } from "../i18n/useAppTranslation";

const ForWhoPage = () => {

    const setAppPage = SelfBookingStore(state => state.setAppPage);
    const setHeaderPage = SelfBookingStore(state => state.setHeaderPage);
    const humanStatus = SelfBookingStore(state => state.humanStatus);
    const setUser = SelfBookingStore(state => state.setUser);
    const widthBlock = SelfBookingStore(state => state.widthBlock);
    const { t } = useAppTranslation();

    const [swype, setSwype] = useState([false, false]);

    const nextStep = (mode) => {

        setTimeout(() => {
            if (mode === "me") {
                setAppPage('for user');
            } else if (mode === "other") {
                setAppPage('for someone else');
            }
        }, 500);


    };

    const prevStep = (status) => {
        if (status === 'logUser') {
            setUser(true);
            setAppPage('sheduler');
        } else {
            setUser(false);
            setAppPage('scheduler');
        }
    };

    const options = [
      { key: "me", label: t("scheduling_for_me", "Scheduling for me") },
      {
        key: "other",
        label: t("scheduling_for_someone_else", "Scheduling for someone else"),
      },
    ];

    let _height = window.innerHeight;
    let _width = window.innerWidth;

    return (
        <div
            className={`forWhoPage mx-auto mb-4`}
            style={{
                width: widthBlock,
                height: window.innerHeight >= 1080 ? 700 : window.innerHeight >= 1000 ? window.innerHeight - 381 : window.innerHeight - 350,
                minHeight: 418,
            }}
        >
            <div
                className={`mainBlock w-full font-nunito  justify-center items-center h-full ${_height < 1050 ? 'flex pt-0' : 'lg:flex xl:block lg:pt-0 xl:pt-[194px]'}`}
            >
                <div>
                    <h1 className={`text-[32px]/[44px] text-white font-semibold tracking-[1.44px] max-w-[587px] mx-auto text-center lg:mb-5 xl:mb-10`}>
                        {t("for_who_title", "Are you scheduling this appointment for you, or someone else?")}
                    </h1>
                    {
                        options.map((item, i) => {
                            return (
                                <ChoseButton
                                  text={item.label}
                                  mode={item.key}
                                  nextStep={nextStep}
                                  humanStatus={humanStatus}
                                  key={i}
                                  swype={swype[i]}
                                  swypeArr={swype}
                                  setSwype={setSwype}
                                  index={i}
                                />
                            )
                        })
                    }
                    <BackButton prevStep={prevStep} setHeaderPage={setHeaderPage} humanStatus={humanStatus} />
                </div>

            </div>
        </div>
    );
};

const BackButton = ({ prevStep, setHeaderPage, humanStatus }) => {
    const { t } = useAppTranslation();

    return (
        <div
            className={`w-[380px] h-[45px] rounded-[10px] bg-white text-[16px]/[22px] text-[#7C67FF] font-sans font-semibold tracking-[0.72px] mx-auto flex justify-center items-center cursor-pointer hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.11)]`}
            onClick={() => { prevStep(humanStatus); setHeaderPage(1) }}
        >
            {t("back", "Back")}
        </div>
    );
};

const ChoseButton = ({ text, mode, nextStep, setSwype, swype, swypeArr, index }) => {

    const setSomeOneElsePage = SelfBookingStore(state => state.setSomeOneElsePage);

    return (
        <div
            className={`w-[380px] h-[50px] rounded-lg bg-[rgba(53,34,140,0.37)] mx-auto text-[18px]/[25px] text-white hover:text-[#b6aafd] font-nunito tracking-[0.81px] flex items-center pl-5 lg:mb-4 xl:mb-[30px] cursor-pointer duration-500 relative overflow-hidden`}
            onClick={() => {
                nextStep(mode);
                let newArr = JSON.parse(JSON.stringify(swypeArr));
                newArr[index] = !swype;
                setSwype(newArr);
                mode === "other" ? setSomeOneElsePage(true) : setSomeOneElsePage(false);
            }}
        >
            <div className={`z-[4] ${swype ? 'text-white' : ''}`}>
                {text}
            </div>
            <div className={`activeAnimation absolute top-0 ${swype ? 'left-0' : '-left-[380px]'} w-full h-full z-[3] duration-500`}>

            </div>
        </div>
    );
};

export default ForWhoPage;
