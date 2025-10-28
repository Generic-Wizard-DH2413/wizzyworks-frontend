import { FIREWORK_TYPES } from "@/data/fireworkTypes";
import { useFireworkStore } from "@/store/useFireworkStore";
import {
  DEFAULT_COLOR_PRIMARY,
  DEFAULT_COLOR_SECONDARY,
  buildFireworkImagePath,
} from "@/utils/fireworkAssets";
import { useText } from "@/i18n/useText"; 


export default function TypeDesign({ onCancel, onTypeDone }) {
  const text = useText();
  const draft = useFireworkStore((state) => state.draft);
  const selectedTypeIdx = draft?.type?.idx ?? null;
  const primaryColor = draft?.color1 ?? DEFAULT_COLOR_PRIMARY;
  const secondaryColor = draft?.color2 ?? DEFAULT_COLOR_SECONDARY;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={onCancel}>{text("cancel")}</button>
      </div>
      <h1 className="text-2xl font-extrabold mb-4">
        {text("selectTypeTitle")}
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {FIREWORK_TYPES.map((fw) => {
          const secondaryImg = fw.boolCol2
            ? buildFireworkImagePath(fw.idx, secondaryColor, "secondary")
            : null;
          const primaryImg = buildFireworkImagePath(fw.idx, primaryColor);
          const isSelected = fw.idx === selectedTypeIdx;

          return (
            <button
              key={fw.idx}
              onClick={() => onTypeDone(fw)}
              className={[
                "flex flex-col items-center bg-zinc-800 rounded-md p-2 transition-transform active:scale-95 hover:opacity-90 border-2",
                isSelected ? "border-orange-500/70" : "border-transparent",
              ].join(" ")}
            >
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden relative">
                {secondaryImg ? (
                  <img
                    src={secondaryImg}
                    alt=""
                    className="absolute inset-0 object-contain max-h-full max-w-full"
                  />
                ) : null}
                {primaryImg ? (
                  <img
                    src={primaryImg}
                    alt={fw.name}
                    className="relative object-contain max-h-full max-w-full"
                  />
                ) : null}
                {fw.boolDraw ? (<div
                className="z-10 h-6 w-6 "
                ><img src="src\assets\paint.png" className="absolute -bottom-0 -right-0 w-6 h-6"></img></div>):null}
              </div>
              <span className="mt-2 text-sm font-medium text-white">
                {text(fw.name)}
              </span>
              <span className="text-xs text-gray-400">
                {fw.boolDraw ? text("paintable") : ""}
              </span>
              
            </button>
          
          );
        })}
      </div>
    </div>
  );
}
