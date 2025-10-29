import { useMemo } from "react";
import { useFireworkStore } from "@/store/useFireworkStore";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { buildFireworkImagePath } from "@/utils/fireworkAssets";
import { useText } from "@/i18n/useText"; 


//TODO: add pics of types for alr set fw

export default function FireworkBox({ onFinishBox }) {
  
    const text = useText(); 

  
    const { slots, slotsAmount, beginDesignForSlot, clearSlot, resetSlots } =
    useFireworkStore((state) => ({
      slots: state.slots,
      slotsAmount: state.slotsAmount,
      beginDesignForSlot: state.beginDesignForSlot,
      clearSlot: state.clearSlot,
      resetSlots: state.resetSlots,
    }));
  const { navigateTo } = useAppNavigation();

  const fwDoneCount = useMemo(
    () => slots.filter(Boolean).length,
    [slots]
  );
  const remaining = slotsAmount - fwDoneCount;

  const startDesignForSlot = (idx) => {
    beginDesignForSlot(idx);
    navigateTo("/design");
  };

  const onAddOne = () => {
    const idx = slots.findIndex((slot) => slot == null);
    if (idx === -1) {
      return;
    }

    startDesignForSlot(idx);
  };

  const onClearSlot = (idx) => {
    clearSlot(idx);
  };

  const onSlotClick = (idx) => {
    startDesignForSlot(idx);
  };

  const onBoxCancel = () => {
    resetSlots();
    navigateTo("/");
  };

  const onFinish = () => {
    if (fwDoneCount === 0) {
      return;
    }

    onFinishBox?.();
    navigateTo("/launch");
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Top bar */}
      <div className="flex items-center justify-between text-xl font-medium mb-1">
        <button className="active:opacity-70" onClick={onBoxCancel}>
          {text("cancel")}
        </button>
        {fwDoneCount > 0 ? (
          
          <button className="bg-orange-500/80 hover:bg-orange-500 text-white font-medium  py-2 px-6 rounded-xl underline underline-offset-4
                                 transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-400/30 shadow-[0_0px_50px_rgba(255,140,0,0.5)]"  
                  onClick={onFinish}>
            {text("finish")}
          </button>
          
        ) : (
          <button className="  text-white font-medium  py-2 px-6 rounded-xl 
                                 transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-400/30 opacity-20" disabled>
            {text("finish")}
          </button>
        )}
      </div>

      {/* Title + counters */}
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
        {text("packTitle", { n: slotsAmount })}

      </h1>
      <p className="text-lg text-gray-300 mb-4">
         {text("statusLine", {
          done: fwDoneCount,
          left: remaining,
        })}
      </p>

      {/* Box */}
      <div className="bg-zinc-800 rounded-md p-4 md:p-6 w-full max-w-[520px] border-5 border-zinc-700 ">
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          {slots.map((slot, idx) => {
            const filled = slot !== null;
            const primaryImg =
              filled && slot.type
                ? buildFireworkImagePath(slot.type.idx, slot.color1)
                : null;
            const secondaryImg =
              filled && slot.type?.boolCol2 && slot.color2
                ? buildFireworkImagePath(
                    slot.type.idx,
                    slot.color2,
                    "secondary"
                  )
                : null;

            return (
              <div key={idx} className="relative">
                {/* Delete button (only when filled) */}
                {filled && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onClearSlot(idx);
                    }}
                    aria-label="Delete firework"
                    title="Delete firework"
                    className="absolute -top-1 -right-1 z-10 h-6 w-6 rounded-full bg-black/80 text-white text-sm leading-6 text-center"
                  >
                    ×
                  </button>
                )}
                {/* Slot button */}
                <button
                  onClick={() => onSlotClick(idx)}
                  className={[
                    "relative w-full aspect-square rounded-full border-4 transition-transform active:scale-95 overflow-hidden",
                    filled
                      ? "border-orange-500/50"
                      : "border-zinc-500 bg-zinc-900",
                  ].join(" ")}
                  aria-label={filled ? "Edit firework" : "Create firework"}
                  title={filled ? "Edit firework" : "Create firework"}
                >
                  {primaryImg ? (
                    <img
                      src={primaryImg}
                      alt={slot.type?.name ?? "Firework"}
                      className="absolute inset-0 w-full h-full rounded-full object-cover z-10"
                      loading="lazy"
                      draggable={false}
                    />
                  ) : null}
                  {secondaryImg ? (
                    <img
                      src={secondaryImg}
                      alt={slot.type?.name ?? "Firework"}
                      className="absolute inset-0 w-full h-full rounded-full object-cover pointer-events-none"
                      loading="lazy"
                      draggable={false}
                    />
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add button + remaining */}
      <div className="flex justify-center mt-12">
        <button
          onClick={onAddOne}
          disabled={remaining === 0}
          className="bg-orange-500/80 hover:bg-orange-500 text-white font-medium text-xl py-2 px-6 rounded-xl 
                                 transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-400/30"
        >
          {text("addAnother")}
        </button>
      </div>
    </div>
  );
}
