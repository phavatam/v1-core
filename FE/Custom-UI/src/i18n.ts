import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import vi from "./locales/vi/translation.json";
import ja from "./locales/ja/translation.json";

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  ja: { translation: ja }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang")?.replace("lang_", "") || "vi",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
