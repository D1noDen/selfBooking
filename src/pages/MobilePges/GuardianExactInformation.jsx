import { useForm } from "react-hook-form";
import SelfBookingStore from "../../store/SelfBookingStore";
import { useEffect, useState } from "react";
import PhoneNumberField from "../components/PhoneNumberField";
import {
  DEFAULT_COUNTRY_CODE,
  joinPhoneByCountryCode,
  splitPhoneByCountryCode,
} from "../helpers/phoneCountry";

import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";

const GuardianExactInformation = () => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const guardianInfo = SelfBookingStore((state) => state.guardianInfo);
  const setGuardianInfo = SelfBookingStore((state) => state.setGuardianInfo);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isParent: "true",
    },
  });
  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState(
    DEFAULT_COUNTRY_CODE
  );

  const emailRegExp =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  const onSubmit = async (data) => {
    const { phoneNumberCountryCode, ...rest } = data;
    const payload = {
      ...rest,
      phoneNumber: joinPhoneByCountryCode(
        phoneNumberCountryCode || selectedPhoneCountryCode,
        data.phoneNumber
      ),
    };
    setGuardianInfo(payload);
    setAppPage("for patient mobile");
  };

  useEffect(() => {
    if (Object.keys(guardianInfo).length === 0) return;
    setValue("pesel", guardianInfo.pesel || "");
    setValue("firstName", guardianInfo.firstName || "");
    setValue("lastName", guardianInfo.lastName || "");
    setValue("email", guardianInfo.email || "");
    setValue("comments", guardianInfo.comments || "");
    setValue(
      "isParent",
      guardianInfo.isParent === false || guardianInfo.isParent === "false"
        ? "false"
        : "true"
    );
    const parsedPhone = splitPhoneByCountryCode(guardianInfo.phoneNumber || "");
    setSelectedPhoneCountryCode(parsedPhone.countryCode);
    setValue("phoneNumber", parsedPhone.localNumber || "");
    setValue("phoneNumberCountryCode", parsedPhone.countryCode);
  }, [guardianInfo, setValue]);

  return (
    <div>
      <section className="mobileBG h-[100px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-full max-w-[290px]">
            <p className="text-[24px] text-white text-center leading-normal">
              Enter Guardian exact <br /> information
            </p>
            <img
              onClick={() => {
                setAppPage("for who mobile");
              }}
              className="absolute top-[6px] left-0 h-[16px] w-[16px]"
              src={chevronLeft}
            />
          </div>
        </div>
      </section>
      <section>
        <form
          className="flex flex-col pt-[18px] items-center gap-[12px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={`w-full max-w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              PESEL/PASSPORT
            </div>
            {
              <input
                type="text"
                placeholder="Input PESEL/PASSPORT"
                id={"pesel"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("pesel", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("pesel") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div>
          <div className={`w-full max-w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              First name
            </div>
            {
              <input
                type="text"
                placeholder="First name"
                id={"firstName"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("firstName", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("firstName") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div>

          <div className={`w-full max-w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Last name
            </div>
            {
              <input
                type="text"
                placeholder="Last name"
                id={"lastName"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("lastName", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("lastName") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div>

          <div className={`w-full max-w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Email
            </div>
            {
              <input
                type="email"
                placeholder="example@gmail.com"
                id={"email"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("email", {
                  required: true,
                  pattern: emailRegExp,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("email") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
            {errors?.email?.type === "pattern" && (
              <p
                className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
              >
                Wrong email format!
              </p>
            )}
            {errors?.email?.type === "required" && (
              <p
                className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
              >
                Field is required!
              </p>
            )}
          </div>

          <PhoneNumberField
            label="Phone Number"
            widthClass="w-full max-w-[340px]"
            phoneFieldName="phoneNumber"
            countryFieldName="phoneNumberCountryCode"
            placeholder="000000000"
            register={register}
            setValue={setValue}
            trigger={trigger}
            errors={errors}
            selectedCountryCode={selectedPhoneCountryCode}
            setSelectedCountryCode={setSelectedPhoneCountryCode}
            className="mb-0"
          />

          <div className={`w-full max-w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Comments or special requests
            </div>
            <textarea
              id="comments"
              {...register("comments")}
              className="text-[15px] border border-solid rounded-[4px] h-[80px] border-[#11111333] text-[#111113] p-[12px] "
            ></textarea>
          </div>

          <div className="flex flex-col items-center gap-[26px] my-[12px]">
            <p className="text-[#111113] text-[15px] text-center">
              Are you the parent or legal guardian of the <br /> patient?
            </p>
            <div className="radio-input">
              <div className="flex gap-[12px]">
                <label className="label">
                  <input
                    type="radio"
                    {...register("isParent", { required: true })}
                    value="true"
                  />
                  <span className="check"></span>
                </label>
                <span>Yes</span>
              </div>
              <div className="flex gap-[12px]">
                <label className="label">
                  <input
                    type="radio"
                    {...register("isParent", { required: true })}
                    value="false"
                  />
                  <span className="check"></span>
                </label>
                <span>No</span>
              </div>
            </div>
          </div>

          <button className="mt-[10px] w-full max-w-[340px] h-[44px] font-medium rounded-[12px] bg-[#7C67FF] text-white">
            Book Appointment
          </button>
          <button
            type="button"
            onClick={() => {
              setAppPage("for who mobile");
            }}
            className="mb-[10px] w-full max-w-[340px] h-[44px] font-medium rounded-[12px] border border-solid border-[#7C67FF] bg-white text-[#7C67FF]"
          >
            Cancel
          </button>
        </form>
      </section>
    </div>
  );
};

export default GuardianExactInformation;
