//HELPER HOOK
import { useI18nStore } from "@/store/useI18nStore";
import { t } from "./i18nStrings";

export function useText() {
  const lang = useI18nStore((state) => state.lang);

  // returns a function you call with a key and optional replacements
  return (key, replacements) => {
    const entry = t[key];
    if (!entry) {
      console.warn(`Missing i18n key: ${key}`);
      return key;
    }

    let str = entry[lang] ?? entry.en ?? "";

    if (replacements) {
      // simple {placeholder} replace
      Object.entries(replacements).forEach(([token, value]) => {
        str = str.replace(`{${token}}`, String(value));
      });
    }

    return str;
  };
}