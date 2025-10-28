import { create } from "zustand";

export const useI18nStore = create((set) => ({
  lang: "en", // default language
  setLang: (lang) => set({ lang }),

  dontShowAgain: false,
  setDontShowAgain: (dontShowAgain)=> set({dontShowAgain}),



}));