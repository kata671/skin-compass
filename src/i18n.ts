import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pl: { translation: { appName: "Skin Compass", start_now: "Zacznij teraz" } },
  en: { translation: { appName: "Skin Compass", start_now: "Start now" } }
};
i18n.use(initReactI18next).init({ resources, lng: "pl", fallbackLng: "en", interpolation: { escapeValue: false } });
export default i18n;
