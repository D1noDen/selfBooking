import { useForm } from "react-hook-form";
//import useAuth from "../../../Routes/useAuth";
import { useState, useRef, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useOnClickOutside } from "../helpers/helpers";
import SelfBookingStore from "../../store/SelfBookingStore";

import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";

const PatientExactInformation = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all" });

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const patientInfo = SelfBookingStore((state) => state.patientInfo);
  const setPatientInfo = SelfBookingStore((state) => state.setPatientInfo);

  const [activeCity, setActiveCity] = useState("Warshaw");
const auth = {
    clinicId: 1,
    companyId: "4b731791-d6f4-4f46-7363-08db9ce8963d",
  }
  const emailRegExp =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  const onSubmit = (data) => {
    setPatientInfo(data);
    setAppPage("appointment information mobile");
  };

  useEffect(() => {
    if (Object.keys(patientInfo).length > 0) {
      setValue("gender", patientInfo.Gender);
      setValue("pesel", patientInfo.pesel);
      setValue("firstName", patientInfo.firstName);
      setValue("lastName", patientInfo.lastName);
      setValue("dateOfBirth", patientInfo.dateOfBirth);
      setValue("email", patientInfo.email);
      setValue("phoneNumber", patientInfo.phoneNumber);
      setValue("problem", patientInfo.problem);
      setValue("adress", patientInfo.adress);
      setValue("nameInsuranceCompany", patientInfo.nameInsuranceCompany);
      setValue("numberInsurancePolicy", patientInfo.numberInsurancePolicy);
      setActiveCity(patientInfo.city);
    }
  }, []);

  return (
    <div>
      <section className="mobileBG h-[100px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-[290px]">
            <p className="text-[24px] text-white text-center leading-normal">
              Enter patient exact <br /> information
            </p>
            <img
              className="absolute top-[6px] left-[-18px] h-[16px] w-[16px]"
              src={chevronLeft}
              onClick={() => {
                setAppPage("for who mobile");
              }}
            />
          </div>
        </div>
      </section>
      <section>
        <form
          className="flex flex-col pt-[18px] items-center gap-[12px] px-[16px]"
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

          <div className="w-[340px] flex flex-col relative">
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Gender
            </div>
            <Dropdown
              id="Gender"
              register={register}
              errors={errors}
              options={["Male", "Female"]}
              activeOption={"Male"}
            />
          </div>

          <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Date of birth
            </div>
            {
              <input
                type="date"
                id={"dateOfBirth"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("dateOfBirth", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("date") && (
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
                type="number"
                placeholder="(000) 000 0000"
                id={"phoneNumber"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
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

          {/* <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Name insurance company
            </div>
            {
              <input
                type="text"
                placeholder="Name insurance company"
                id={"nameInsuranceCompany"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("nameInsuranceCompany", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("nameInsuranceCompany") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div> */}
          {/* <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Number insurance policy
            </div>
            {
              <input
                type="number"
                placeholder="Number insurance policy"
                id={"numberInsurancePolicy"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("numberInsurancePolicy", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("numberInsurancePolicy") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div> */}
          <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              City
            </div>
            {
              <input
                type="text"
                placeholder="City"
                id={"city"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("city", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("city") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div>
          {/* <div className="w-[340px] flex flex-col relative">
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>City</div>
            <Dropdown
              id="City"
              register={register}
              errors={errors}
              options={["City1", "Warshaw", "City2"]}
              activeOption={activeCity}
            />
          </div> */}

          <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Address
            </div>
            {
              <input
                type="text"
                placeholder="Address"
                id={"adress"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("adress", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("adress") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div>
          {/* <div className={`w-[340px] flex flex-col relative`}>
            <div className={`text-[14px] text-[#5E5E5E] font-medium`}>
              Problem
            </div>
            {
              <input
                type="text"
                placeholder="Broken tooth"
                id={"problem"}
                className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px] "
                {...register("problem", {
                  required: true,
                })}
              />
            }
            {errors
              ? Object.keys(errors).includes("problem") && (
                  <p
                    className={` absolute top-[70px]  bg-white  text-red-500 text-[12px]/[14px]`}
                  >
                    Field is requaired!
                  </p>
                )
              : null}
          </div> */}

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

export default PatientExactInformation;

const Dropdown = ({ id, register, errors, options, activeOption }) => {
  const [selectedCity, setSelectedCity] = useState(activeOption);
  const [visibleAppList, setVisibleAppList] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [hover, setHover] = useState(false);
  const appointmentList = useRef(null);

  useOnClickOutside(appointmentList, () => {
    if (visibleAppList) {
      setRotate(!rotate);
      setVisibleAppList(!visibleAppList);
    }
  });

  return (
    <div
      className={`text-[16px]/[22px] text-[#64697E] font-nunito tracking-[0.72px] w-full `}
    >
      <input
        id={id}
        {...register(id, {
          required: false,
        })}
        value={selectedCity}
        className="hidden"
      />
      <Listbox
        as={"div"}
        value={selectedCity}
        className={`relative`}
        ref={appointmentList}
        onFocus={() => console.log("focus")}
      >
        <Listbox.Button
          className={`w-full h-[49px] px-[10px] border-[1px] border-[#11111333] rounded-[4px] text-left relative z-[10] hover:border-[#CACACA] hover: bg-no-repeat bg-[90%_20px] bg-white`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            setRotate(!rotate);
            setVisibleAppList(!visibleAppList);
          }}
        >
          {selectedCity}
          <div
            className={` absolute top-[calc(50%-10px)] right-[10px] w-[18px] h-[18px] bg-[url("./assets/images/self-booking/arrowDownBlack.svg")] ${
              rotate ? "rotate-180" : "rotate-0"
            } duration-500`}
          ></div>
        </Listbox.Button>
        <Transition
          as={"div"}
          show={rotate}
          className={`relative -top-[50px] z-[1] `}
          enter="transition duration-500 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-500 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options
            className={`absolute top-[39px] w-full left-0 pt-3 z-[1] bg-white rounded-[10px] border-[1px] border-[#E8E8E9]`}
          >
            {options?.map((item, i) => {
              return (
                <Listbox.Option
                  key={i}
                  value={item}
                  className={`h-[49px] px-[10px] w-full  flex items-center cursor-pointer hover:bg-[#F3F3FF]`}
                  onClick={() => {
                    setRotate(!rotate);
                    setVisibleAppList(false);
                    setSelectedCity(item);
                  }}
                >
                  {item}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};
