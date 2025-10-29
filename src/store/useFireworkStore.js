import { create } from "zustand";

import {
  DEFAULT_COLOR_PRIMARY,
  DEFAULT_COLOR_SECONDARY,
  DEFAULT_SLIDER_VALUE,
} from "@/utils/fireworkAssets";

const createEmptyDraft = () => ({
  type: null,
  color1: DEFAULT_COLOR_PRIMARY,
  color2: DEFAULT_COLOR_SECONDARY,
  launchWobble: DEFAULT_SLIDER_VALUE,
  launchSpeed: DEFAULT_SLIDER_VALUE,
  specialFxStr: DEFAULT_SLIDER_VALUE,
  drawing: null,
});

export const useFireworkStore = create(
  (set, get) => ({
  slotsAmount: 9,
  slots: Array(9).fill(null),
  editingSlotIdx: null,
  draft: null,
  shouldLaunch:false,
  canLaunch: false,
  setShouldLaunch: (shouldLaunch) => set({ shouldLaunch }),
  setCanLaunch: (canLaunch) => set({ canLaunch }),


  setSlotsAmount: (amount) =>
    set((state) => {
      if (amount === state.slotsAmount) {
        return state;
      }

      const nextSlots = Array(amount).fill(null);
      for (let i = 0; i < Math.min(amount, state.slots.length); i += 1) {
        nextSlots[i] = state.slots[i];
      }

      return {
        slotsAmount: amount,
        slots: nextSlots,
        editingSlotIdx:
          state.editingSlotIdx != null && state.editingSlotIdx < amount
            ? state.editingSlotIdx
            : null,
        draft:
          state.editingSlotIdx != null && state.editingSlotIdx < amount
            ? state.draft
            : null,
      };
    }),

  beginDesignForSlot: (idx) => {
    const { slots } = get();
    const slot = slots[idx];

    set({
      editingSlotIdx: idx,
      draft: slot
        ? { ...slot } //edit  existing
        : {
            ...createEmptyDraft(), //add a new empty w default  settings
          },
    });
  },

  updateDraft: (updates) =>
    set((state) => {
      if (!state.draft) {
        return state;
      }

      return {
        draft: {
          ...state.draft,
          ...updates,
        },
      };
    }),

  cancelDraft: () =>
    set({
      editingSlotIdx: null,
      draft: null,
    }),

  commitDraft: () => {
    const { editingSlotIdx, draft, slots } = get();

    if (editingSlotIdx == null || !draft) {
      return false;
    }

    const nextSlots = [...slots];
    nextSlots[editingSlotIdx] = {
      type: draft.type,
      color1: draft.color1,
      color2: draft.color2 ?? null,
      launchWobble: draft.launchWobble,
      launchSpeed: draft.launchSpeed,
      specialFxStr: draft.specialFxStr,
      drawing: draft.drawing ?? null,
    };

    set({
      slots: nextSlots,
      editingSlotIdx: null,
      draft: null,
    });

    return true;
  },

  clearSlot: (idx) =>
    set((state) => {
      if (state.slots[idx] == null) {
        return state;
      }

      const nextSlots = [...state.slots];
      nextSlots[idx] = null;

      return { slots: nextSlots };
    }),

  resetSlots: () =>
    set((state) => ({
      slots: Array(state.slotsAmount).fill(null),
      editingSlotIdx: null,
      draft: null,
    })),
})
  
);
