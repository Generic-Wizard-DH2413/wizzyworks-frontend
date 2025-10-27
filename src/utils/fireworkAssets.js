export const DEFAULT_COLOR_PRIMARY = "#FF0000";
export const DEFAULT_COLOR_SECONDARY = "#FF9220";
export const DEFAULT_SLIDER_VALUE = 55;

export const FIREWORK_COLOR_KEYS = [
  "#FF0000",
  "#FF9220",
  "#FFc71d",
  "#bfff00",
  "#00d062",
  "#5bbce4",
  "#5A70CD",
  "#A35ACD",
  "#FC8EAC",
];

export const FIREWORK_COLOR_CLASSES = {
  "#FF0000": "bg-[#FF0000] rounded-md h-8",
  "#FF9220": "bg-[#FF9220] rounded-md h-8",
  "#FFc71d": "bg-[#FFc71d] rounded-md h-8",
  "#bfff00": "bg-[#bfff00] rounded-md h-8",
  "#00d062": "bg-[#00d062] rounded-md h-8",
  "#5bbce4": "bg-[#5bbce4] rounded-md h-8",
  "#5A70CD": "bg-[#5A70CD] rounded-md h-8",
  "#A35ACD": "bg-[#A35ACD] rounded-md h-8",
  "#FC8EAC": "bg-[#FC8EAC] rounded-md h-8",
};

export const getFireworkColorIndex = (color) => {
  const idx = FIREWORK_COLOR_KEYS.indexOf(color);
  return idx === -1 ? 1 : idx + 1;
};

export const buildFireworkImagePath = (typeIdx, color, variant = "primary") => {
  if (!typeIdx || !color) {
    return null;
  }

  const colorIdx = getFireworkColorIndex(color);
  const secondarySuffix = variant === "secondary" ? "Secondary" : "";

  try {
    return new URL(
      `../assets/fireworkTypes/fwType${typeIdx}${secondarySuffix}c${colorIdx}.png`,
      import.meta.url
    ).href;
  } catch {
    return null;
  }
};
