import { useEffect, useState } from "react";
import TypeDesign from "../Design/TypeDesign";
import SettingsDesign from "../Design/SettingsDesign";
import DrawDesign from "../Design/DrawDesign";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useFireworkStore } from "@/store/useFireworkStore";
import {
  FIREWORK_COLOR_KEYS,
} from "@/utils/fireworkAssets";

export default function PresenterDesign() {
  const {
    draft,
    editingSlotIdx,
    updateDraft,
    cancelDraft,
    commitDraft,
  } = useFireworkStore((state) => ({
    draft: state.draft,
    editingSlotIdx: state.editingSlotIdx,
    updateDraft: state.updateDraft,
    cancelDraft: state.cancelDraft,
    commitDraft: state.commitDraft,
  }));
  const { navigateTo } = useAppNavigation();
  const [step, setStep] = useState(() =>
    draft?.type ? "settings" : "type"
  );

  useEffect(() => {
    if (editingSlotIdx == null || !draft) {
      navigateTo("/fireworkBox");
    }
  }, [editingSlotIdx, draft, navigateTo]);

  useEffect(() => {
    if (!draft) {
      return;
    }
    setStep(draft.type ? "settings" : "type");
  }, [editingSlotIdx]);

  if (!draft) {
    return null;
  }

  const handleDesignCancel = () => {
    cancelDraft();
    navigateTo("/fireworkBox");
  };

  const handleTypeDone = (typeObj) => {
    updateDraft({
      type: typeObj,
      color1: FIREWORK_COLOR_KEYS[typeObj.idx-1],
      color2: typeObj.boolCol2 ? FIREWORK_COLOR_KEYS[typeObj.idx%9] : null,
    });
    setStep("settings");
  };

  const handleSettingsDone = () => {
    if (draft.type?.boolDraw) {
      setStep("draw");
      return;
    }

    if (commitDraft()) {
      navigateTo("/fireworkBox");
    }
  };

  const handleDrawDone = () => {
    if (commitDraft()) {
      navigateTo("/fireworkBox");
    }
  };

  const handleDrawingChange = (drawingData) => {
    updateDraft({ drawing: drawingData });
  };

  return (
    <>
      {step === "type" && (
        <TypeDesign onCancel={handleDesignCancel} onTypeDone={handleTypeDone} />
      )}

      {step === "settings" && (
        <SettingsDesign
          draft={draft}
          onCancel={handleDesignCancel}
          onSettingsDone={handleSettingsDone}
          onUpdateDraft={updateDraft}
        />
      )}

      {step === "draw" && (
        <DrawDesign
          onCancel={handleDesignCancel}
          onDrawDone={handleDrawDone}
          drawing={draft.drawing}
          onDrawingChange={handleDrawingChange}
        />
      )}
    </>
  );
}
