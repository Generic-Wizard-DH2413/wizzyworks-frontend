import { useState, useEffect } from "react";
//TODO: add pics of types for alr set fw

export default function FireworkBox({ //props
    slotsAmount,
    slots,        // lifted state
    handleClearSlot,     
    handleBoxCancel,
    handleEditSlot,
    handleFinishBox
}) {

    // Count how many are done (non-null)
    const fwDoneCount = slots.filter(Boolean).length;     // true or object counts as done
    const [remaining, setRemaining] = useState(slotsAmount - fwDoneCount);

    useEffect(() => {
    var fwdc = slots.filter(Boolean).length;     // true or object counts as done
    setRemaining(slotsAmount - fwdc);
    },[slots])
    

    // Take the first empty slot and start editing it
    const onAddOne = () => {
        const idx = slots.findIndex(s => s == null);
        if (idx === -1) return; // all full
        handleEditSlot(idx);        // parent marks used + navigates to /design
    };

    const onClearSlot = (idx) => {
        handleClearSlot(idx);
    };

    const onSlotClick = (idx) => {
        // Always edit exactly this slot
        handleEditSlot(idx); // App.jsx will ensure it's marked used if empty, then navigate
    };

    const onBoxCancel = () => {
        handleBoxCancel();
    }

    const onFinishBox = () => {
        handleFinishBox();
    }

    return (
        <div className="min-h-screen p-6 md:p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between text-xl font-medium mb-10">
            <button className="active:opacity-70" onClick={onBoxCancel}>Cancel</button>
            <button className="active:opacity-70" onClick={() => onFinishBox(slots)}>Finish</button>
        </div>

        {/* Title + counters */}
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            {slotsAmount} Pack Firework Box
        </h1>
        <p className="text-lg text-gray-300 mb-4">
            {fwDoneCount} done • {remaining} left
        </p>

        {/* Box */}
        <div className="bg-zinc-800 rounded-md p-4 md:p-6 w-full max-w-[520px] border-5 border-zinc-700 ">
            <div className="grid grid-cols-3 gap-2 md:gap-6">
            {slots.map((s, i) => {
                const filled = s !== null;
                const imgSrc = filled ? s.imgPath : null;

                return (
                <div key={i} className="relative">
                    {/* Delete button (only when filled) */}
                    {filled && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClearSlot(i); }}
                        aria-label="Delete firework"
                        title="Delete firework"
                        className="absolute -top-1 -right-1 z-10 h-6 w-6 rounded-full bg-black/80 text-white text-sm leading-6 text-center"
                    >
                        ×
                    </button>
                    )}
                    {/* This button is always here (x or no x button)*/}
                    <button
                        onClick={() => onSlotClick(i)}
                        className={[
                        'relative w-full aspect-square rounded-full border-4 transition-transform active:scale-95',
                        filled ? 'border-orange-500/50' : 'border-zinc-500 bg-zinc-900',
                        ].join(' ')}
                        aria-label={filled ? 'Edit firework' : 'Create firework'}
                        title={filled ? 'Edit firework' : 'Create firework'}
                    >
                        {imgSrc ? (
                        <img
                            src={imgSrc}
                            alt={s.type?.name ?? 'Firework'}
                            className="absolute inset-0 w-full h-full rounded-full object-cover"
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
            disabled={remaining == 0}
            className="bg-orange-500/80 hover:bg-orange-500 text-white font-medium text-base py-2 px-6 rounded-xl 
                                 transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-400/30"
            >
            Add another firework!
            </button>
        </div>
        </div>
  );
}


