import { useState } from "react";
import TypeDesign from "../Design/TypeDesign";
import SettingsDesign from "../Design/SettingsDesign";
import DrawDesign from "../Design/DrawDesign";
import { useAppNavigation } from "@/hooks/useAppNavigation";


export default function PresenterDesign({ setSlots,selectedSlotIdx }) {
    const [step, setStep] = useState("type"); // "type" | "settings" | "draw"
    //settings with default vals (some settingParams are only tweakable for some fwTypes)
    const [selectedType, setSelectedType] = useState(null);
    const [color1, setColor1] = useState("#FF0000");
    const [color2, setColor2] = useState("#FFFFFF"); //fwType allows changing or not
    const [burstSize, setBurstSize] = useState(55);
    const [launchSpeed, setLaunchSpeed] = useState(55); 
    const [specialFxStr, setSpecialFxStr] = useState(55); //fwType allows changing or not
    const [drawing, setDrawing] = useState(null);

    const { navigateTo } = useAppNavigation();



  // --- handleDesignCancel ---
   //clear slot and undo any Design changes and return to box
  const handleDesignCancel = () => {
    //setStep('type'); //will cause some glitch
    setSelectedType(null);
    setColor1("#ff0000");
    setColor2("#ffffff");
    setBurstSize(55);
    setLaunchSpeed(55);
    setSpecialFxStr(55);
    setDrawing(null);

    navigateTo('/fireworkBox');

  };

  // --- handleDesignDone ---
  // When DesignProcess completes a design
  //update slots and navigate back to fireworkBox
  const handleDesignDone = (design) => {
    if (selectedSlotIdx == null) {
      // No active slot; just go back; defence mechanism
      navigateTo('/fireworkBox');
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
        type: selectedType,
        color1,
        color2,
        burstSize,
        launchSpeed,
        specialFxStr,
        drawing
        };
      handleDesignDone(design);
    }
  };

  // --- Draw step ---
  const handleDrawDone = () => {
    const design = {
        type: selectedType,
        color1,
        color2,
        burstSize,
        launchSpeed,
        specialFxStr,
        drawing
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
            color2={color2}
            setColor2={setColor2}
            burstSize={burstSize}
            setBurstSize={setBurstSize}
            launchSpeed={launchSpeed}
            setLaunchSpeed={setLaunchSpeed}
            specialFxStr={specialFxStr}
            setSpecialFxStr={setSpecialFxStr}
            onCancel={handleDesignCancel}
            onSettingsDone={handleSettingsDone}
            boolCol2={selectedType.boolCol2} //only show params if selected fwType supports it
            boolSfx={selectedType.boolSfx}
            fwTypeIdx={selectedType.idx} 
        />
      )}

      {step === "draw" && (
        <DrawDesign
          onCancel={handleDesignCancel}
          onDrawDone={handleDrawDone}
          setDrawing={setDrawing}
        />
      )}
    </>
  );
}