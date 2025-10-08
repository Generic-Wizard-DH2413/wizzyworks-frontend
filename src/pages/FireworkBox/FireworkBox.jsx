//TODO: add pics of types for alr set fw

export default function FireworkBox({ //props
    slotsAmount,
    slots,        // lifted state
    handleClearSlot,     
    handleBoxCancel,
    handleEditSlot
}) {

    // Count how many are done (non-null)
    const fwDoneCount = slots.filter(Boolean).length;     // true or object counts as done
    const remaining   = slotsAmount - fwDoneCount;

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

    return (
        <div className="min-h-screen bg-white text-black p-6 md:p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between text-xl font-medium mb-10">
            <button className="active:opacity-70" onClick={onBoxCancel}>Cancel</button>
            <button className="active:opacity-70" onClick={() => onFinish(slots)}>Finish</button>
        </div>

        {/* Title + counters */}
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
            {slotsAmount} Pack Firework Box
        </h1>
        <p className="text-sm text-gray-600 mb-4">
            {fwDoneCount} done • {remaining} left
        </p>

        {/* Box */}
        <div className="bg-zinc-700 rounded-md p-4 md:p-6 w-full max-w-[520px]">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
            {slots.map((s, i) => {
                const filled = s !== null;
                const imgSrc = filled ? s.type?.img : null;

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
                        'relative w-full aspect-square rounded-full border-2 transition-transform active:scale-95',
                        filled ? 'border-white' : 'border-white/80 bg-white/60',
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
        <div className="mt-12">
            <button
            onClick={onAddOne}
            disabled={remaining === 0}
            className="mx-auto block text-lg disabled:opacity-40 active:opacity-80"
            >
            Add another firework!
            </button>
        </div>
        </div>
  );
}


