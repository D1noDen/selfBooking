import dentaSoftLogo from "../../assets/images/self-booking/dentaSoftLogo.png";
import LanguageSelector from "./LanguageSelector";
import { useAppTranslation } from "../../i18n/useAppTranslation";

const MiniFooter = () => {
  const { t } = useAppTranslation();
  const year = new Date().getFullYear();
  return (
    <div className="py-[24px] px-[16px] flex flex-col gap-[12px]  ">
      <div className="flex gap-[8px] justify-center ">
        <img src={dentaSoftLogo} className="w-[38px] h-[25px]" />
        <p className="text-[#535061] text-[20px]">Denta Soft</p>
      </div>
      <div className="flex justify-between w-full ">
        <LanguageSelector showFlags={false} />
        <p>{year} © {t("all_rights_reserved", "All rights reserved")}</p>
      </div>
    </div>
  );
};

export default MiniFooter;
