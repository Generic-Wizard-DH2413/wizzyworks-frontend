//TODO: interact with the app.jsx data sending (see handleFinishBox)

import FireworkBox from '../FireworkBox/FireworkBox';
import { useAppNavigation } from "@/hooks/useAppNavigation";

export default function FireworkBoxPresenter({slotsAmount, slots, setSlots, selectedSlotIdx, setSelectedSlotIdx }) {
    const isComplete = slots.every(Boolean);
    const { navigateTo } = useAppNavigation();

    const handleEditSlot = (idx) => {
        setSelectedSlotIdx(idx); //!important
        navigateTo('/design');
    };

    const handleClearSlot = (idx) => {
        setSlots(prev => {
                const next = [...prev];
                next[idx] = null;
                return next;
                });
    };

    const handleBoxCancel = () => {
        setSlots(Array(slotsAmount).fill(null));
        navigateTo('/')
    }

    const handleFinishBox = () => {
        console.log('Finish FireworkBox:', slots);
        // navigate('/summary');
    };

    
    return <FireworkBox
                slotsAmount={slotsAmount}
                slots={slots}
                handleClearSlot={handleClearSlot}
                handleBoxCancel={handleBoxCancel}
                handleEditSlot={handleEditSlot}
                />;
}