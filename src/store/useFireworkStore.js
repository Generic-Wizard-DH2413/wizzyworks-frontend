import { create } from "zustand";

import {
  DEFAULT_COLOR_PRIMARY,
  DEFAULT_COLOR_SECONDARY,
  DEFAULT_SLIDER_VALUE,
} from "@/utils/fireworkAssets";

import { t } from "@/i18n/i18nStrings";
import { useI18nStore } from "@/store/useI18nStore";

// Helper to get translated error messages
const getErrorText = (key) => {
  const lang = useI18nStore.getState().lang;
  return t[key]?.[lang] || t[key]?.en || key;
};

const createEmptyDraft = () => ({
  type: null,
  color1: DEFAULT_COLOR_PRIMARY,
  color2: DEFAULT_COLOR_SECONDARY,
  launchWobble: DEFAULT_SLIDER_VALUE,
  launchSpeed: DEFAULT_SLIDER_VALUE,
  specialFxStr: DEFAULT_SLIDER_VALUE,
  drawing: null,
});

// Utility functions for WebSocket
const hexStringToNormalizedRGB = (hexString) => {
  if (!hexString) return null;

  const hex = hexString.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return [r, g, b];
};

const clamp01 = (x) => Math.min(Math.max(x, 0), 1);

const normalizeSettings = (value, min = 10, max = 100) => {
  return clamp01((value - min) / (max - min));
};

const buildJSONFireworkFromSlot = (slot) => {
  const { type, color1, color2, launchSpeed, launchWobble, specialFxStr, drawing } = slot;

  return {
    outer_layer: type.godotName,
    outer_layer_color: hexStringToNormalizedRGB(color1),
    outer_layer_second_color: hexStringToNormalizedRGB(color2),
    path_speed: normalizeSettings(launchSpeed),
    path_wobble: normalizeSettings(launchWobble),
    outer_layer_specialfx: normalizeSettings(specialFxStr),
    inner_layer: drawing,
  };
};

export const useFireworkStore = create(
  (set, get) => ({
  slotsAmount: 9,
  slots: Array(9).fill(null),
  editingSlotIdx: null,
  draft: null,
  shouldLaunch: false,
  canLaunch: false,
  arUcoId: null,
  ws: null,
  wsError: null,
  wsConnected: false,

  setShouldLaunch: (shouldLaunch) => set({ shouldLaunch }),
  setCanLaunch: (canLaunch) => set({ canLaunch }),
  setArUcoId: (arUcoId) => set({ arUcoId }),
  setWsError: (wsError) => set({ wsError }),
  
  resetLaunchState: () => set({
    shouldLaunch: false,
    canLaunch: false,
    wsError: null,
    wsConnected: false,
  }),


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

  sendFireworkData: () => {
    const { slots } = get();
    const ENABLE_WS = true;

    if (!ENABLE_WS) return;

    // Reset error state
    set({ wsError: null, wsConnected: false });

    // Build fireworks payload from filled slots
    const fireworks = slots
      .map((slot) => (slot ? buildJSONFireworkFromSlot(slot) : null))
      .filter(Boolean);

    // Establish WebSocket connection
    const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8765";

    if (!import.meta.env.VITE_WEBSOCKET_URL) {
      console.warn('VITE_WEBSOCKET_URL not found, using fallback URL');
    }

    const websocket = new WebSocket(websocketUrl);
    set({ ws: websocket });

    // Flag to track if we've sent the fireworks data
    let fireworksDataSent = false;
    let readySignalReceived = false;

    // Timeout to detect if connection/response takes too long
    const connectionTimeout = setTimeout(() => {
      if (!fireworksDataSent) {
        console.error('Connection timeout - no response from server');
        websocket.close();
        set({ wsError: getErrorText('wsErrorConnectionTimeout') });
      } else if (!readySignalReceived) {
        console.error('Timeout waiting for ready signal from server');
        websocket.close();
        set({ wsError: getErrorText('wsErrorNoResponse') });
      }
    }, 5000);

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      set({ wsConnected: true });
      
      // Send initial connection message
      try {
        websocket.send(JSON.stringify({
          type: "connection",
          origin: window.location.origin,
          userAgent: navigator.userAgent
        }));
        console.log('Waiting for ArUco ID from server...');
      } catch (err) {
        console.error('Failed to send connection message:', err);
        set({ wsError: getErrorText('wsErrorSendConnection') });
        clearTimeout(connectionTimeout);
        websocket.close();
      }
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(
          "%c Received:",
          "color: #00ff00; background: black; font-family: monospace; font-size: 14px; padding: 2px 6px;",
          data
        );

        // Handle ArUco ID
        if (data.data?.id !== undefined) {
          const receivedId = data.data.id;
          console.log('ArUco ID from server:', receivedId);
          set({ arUcoId: receivedId });

          // Now that we have the ID, send the fireworks data
          if (!fireworksDataSent) {
            const payload = { id: receivedId, fireworks };
            console.log('Sending fireworks payload with ID:', payload);

            try {
              websocket.send(JSON.stringify(payload));
              console.log("Fireworks payload sent successfully");
              fireworksDataSent = true;
            } catch (err) {
              console.error("Failed to send fireworks payload:", err);
              set({ wsError: getErrorText('wsErrorSendFirework') });
              clearTimeout(connectionTimeout);
              websocket.close();
            }
          }
        }

        // Handle status updates
        if (data.data?.status) {
          const status = data.data.status;
          
          if (status === "ready") {
            console.log("Ready to launch");
            readySignalReceived = true;
            clearTimeout(connectionTimeout);
            set({ canLaunch: true });
          } 
          else if (status === "launch") {
            console.log("Launch signal received");
            set({ shouldLaunch: true });
            clearTimeout(connectionTimeout);
            
            // Close WebSocket connection after receiving launch signal
            console.log("Closing WebSocket connection");
            websocket.close();
          }
        }

      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        console.log('Raw message:', event.data);
        set({ wsError: getErrorText('wsErrorProcessResponse') });
        clearTimeout(connectionTimeout);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ 
        wsError: getErrorText('wsErrorNetwork'),
        wsConnected: false 
      });
      clearTimeout(connectionTimeout);
    };

    websocket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      set({ ws: null, wsConnected: false });
      clearTimeout(connectionTimeout);
      
      // If closed unexpectedly before launch
      const { shouldLaunch } = get();
      if (!shouldLaunch && !get().wsError) {
        set({ wsError: getErrorText('wsErrorClosedUnexpectedly') });
      }
    };
  },
})
  
);
