import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import SelfBookingStore from "../../store/SelfBookingStore";

import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";
import { values } from "lodash";

const GuardianExactInformation = () => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setGuardianInfo = SelfBookingStore((state) => state.setGuardianInfo);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [submit, setSubmit] = useState(false);

  const emailRegExp =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  const onSubmit = async (data) => {
    setSubmit(!submit);
    console.log(data);
    setGuardianInfo(data);
    setAppPage("for patient mobile");
  };

  return (
    <div>
      <section className="mobileBG h-[100px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-[290px]">
            <p className="text-[24px] text-white text-center leading-normal">
              Enter Guardian exact <br /> information
            </p>
            <img
              onClick={() => {
                setAppPage("for who mobile");
              }}
              className="absolute top-[6px] left-[-18px] h-[16px] w-[16px]"
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
          <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              PESEL
            </div>
            {
              <input
                type="text"
                placeholder="Input PESEL"
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
          <div className={`w-[340px] flex flex-col relative`}>
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

          <div className={`w-[340px] flex flex-col relative`}>
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

          <div className={`w-[340px] flex flex-col relative`}>
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

          <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Phone Number
            </div>
            {
              <input
                type="tel"
                placeholder="(000) 000 0000"
                id={"phoneNumber"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={9}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                onInput={(event) => {
                  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 9);
                }}
                {...register("phoneNumber", {
                  required: true,
                  minLength: 9,
                  maxLength: 9,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("phoneNumber") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
            {errors?.phoneNumber?.type === "required" && (
              <p
                className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
              >
                Field is required!
              </p>
            )}
            {(errors?.phoneNumber?.type === "minLength" ||
              errors?.phoneNumber?.type === "maxLength") && (
              <p
                className={`absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
              >
                Must be 9 digit!
              </p>
            )}
          </div>

          <div className={`w-[340px] flex flex-col relative`}>
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
                    name="radio"
                    checked
                    {...register("isParent")}
                    value={true}
                  />
                  <span className="check"></span>
                </label>
                <span>Yes</span>
              </div>
              <div className="flex gap-[12px]">
                <label className="label">
                  <input
                    type="radio"
                    name="radio"
                    {...register("isParent")}
                    value={false}
                  />
                  <span className="check"></span>
                </label>
                <span>No</span>
              </div>
            </div>
          </div>

          <button className="mt-[10px] w-[340px] h-[44px] font-medium rounded-[12px] bg-[#7C67FF] text-white">
            Book Appointment
          </button>
          <button
            onClick={() => {
              setAppPage("for who mobile");
            }}
            className="mb-[10px] w-[340px] h-[44px] font-medium rounded-[12px] border border-solid border-[#7C67FF] bg-white text-[#7C67FF]"
          >
            Cancel
          </button>
        </form>
      </section>
    </div>
  );
};

export default GuardianExactInformation;
