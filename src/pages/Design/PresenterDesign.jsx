import { useState } from "react";
import TypeDesign from "../Design/TypeDesign";
import SettingsDesign from "../Design/SettingsDesign";
import DrawDesign from "../Design/DrawDesign";
import { useAppNavigation } from "@/hooks/useAppNavigation";


export default function PresenterDesign({ setSlots,selectedSlotIdx }) {
  const [step, setStep] = useState("type"); // "type" | "settings" | "draw"
  const [selectedType, setSelectedType] = useState(null);
  const [color1, setColor1] = useState("#ff0000");
  const [burstSize, setBurstSize] = useState(50);
  const { navigateTo } = useAppNavigation();



  // --- handleDesignCancel ---
   //clear slot and undo any Design changes and return to box
  const handleDesignCancel = () => {
    setStep('type');
    setSelectedType(null);
    setColor1("#ff0000");
    setBurstSize(50);
    navigateTo('/fireworkBox');

  };

  // --- handleDesignDone ---
  // When DesignProcess completes a design
  //update slots and navigate back to fireworkBox
  const handleDesignDone = (design) => {
    if (selectedSlotIdx == null) {
      // No active slot; just go back; defence mechanism
      navigate('/fireworkBox');
      console.log('no slotIdxset');
      return;
    } //real stuff:
    setSlots(prev => {
      const next = [...prev];
      // Store the real design object at selected indx (set in prestenterFireworkBox)
      next[selectedSlotIdx] = design; // { type, colors, burstSize } or your shape
      return next;
    });
    navigateTo('/fireworkBox');
  };

  // --- Firework type selection ---
  const handleTypeDone = (typeObj) => {
    setSelectedType(typeObj);
    setStep("settings");
  };

  // --- Settings step ---
  const handleSettingsDone = () => {
    if (selectedType.boolDraw) {
      setStep("draw");
    } else {
      const design = { 
        type: selectedType.name,
        color1,
        burstSize };
      handleDesignDone(design);
    }
  };

  // --- Draw step ---
  const handleDrawDone = () => {
    const design = {
      type: selectedType.name,
      color1,
      burstSize,
      drawing: "placeholder",
    };
    handleDesignDone(design);
  };


  // --- Conditional Rendering ---
  return (
    <>
      {step === "type" && (
        <TypeDesign
          onCancel={handleDesignCancel}
          onTypeDone={handleTypeDone}
        />
      )}

      {step === "settings" && (
        <SettingsDesign
          color1={color1}
          setColor1={setColor1}
          burstSize={burstSize}
          setBurstSize={setBurstSize}
          onCancel={handleDesignCancel}
          onSettingsDone={handleSettingsDone}
        />
      )}

      {step === "draw" && (
        <DrawDesign
          onCancel={handleDesignCancel}
          onDrawDone={handleDrawDone}
        />
      )}
    </>
  );
}