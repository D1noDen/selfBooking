import { useState } from "react";
import SelfBookingStore from "../store/SelfBookingStore";
import '../assets/scss/SelfBooking/BookingAppointment.scss';

const ForWhoPage = () => {

    const setAppPage = SelfBookingStore(state => state.setAppPage);
    const setHeaderPage = SelfBookingStore(state => state.setHeaderPage);
    const humanStatus = SelfBookingStore(state => state.humanStatus);
    const setUser = SelfBookingStore(state => state.setUser);
    const widthBlock = SelfBookingStore(state => state.widthBlock);

    const [swype, setSwype] = useState([false, false]);

    const nextStep = (text, status) => {

        setTimeout(() => {
            if (text === 'Scheduling for me') {
                setAppPage('for user');
            } else if ( text === 'Scheduling for someone else') {
                setAppPage('for someone else');
            } else if ( text === 'Scheduling for me') {
                setAppPage('for guest page');
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

    const buttonText = ['Scheduling for me', 'Scheduling for someone else'];

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
                        Are you scheduling this appointment for you, or someone else?
                    </h1>
                    {
                        buttonText.map((item, i) => {
                            return (
                                <ChoseButton text={item} nextStep={nextStep} humanStatus={humanStatus} key={i} swype={swype[i]} swypeArr={swype} setSwype={setSwype} index={i} />
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

    return (
        <div
            className={`w-[380px] h-[45px] rounded-[10px] bg-white text-[16px]/[22px] text-[#7C67FF] font-nunito font-semibold tracking-[0.72px] mx-auto flex justify-center items-center cursor-pointer hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.11)]`}
            onClick={() => { prevStep(humanStatus); setHeaderPage(1) }}
        >
            Back
        </div>
    );
};

const ChoseButton = ({ text, nextStep, humanStatus, setSwype, swype, swypeArr, index }) => {

    const setSomeOneElsePage = SelfBookingStore(state => state.setSomeOneElsePage);

    return (
        <div
            className={`w-[380px] h-[50px] rounded-lg bg-[rgba(53,34,140,0.37)] mx-auto text-[18px]/[25px] text-white hover:text-[#b6aafd] font-nunito tracking-[0.81px] flex items-center pl-5 lg:mb-4 xl:mb-[30px] cursor-pointer duration-500 relative overflow-hidden`}
            onClick={() => {
                nextStep(text, humanStatus);
                let newArr = JSON.parse(JSON.stringify(swypeArr));
                newArr[index] = !swype;
                setSwype(newArr);
                text === 'Scheduling for someone else' ? setSomeOneElsePage(true) : setSomeOneElsePage(false);
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