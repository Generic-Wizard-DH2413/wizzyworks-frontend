import { useState, useEffect } from "react";
import TypeDesign from "../Design/TypeDesign";
import SettingsDesign from "../Design/SettingsDesign";
import DrawDesign from "../Design/DrawDesign";
import { useAppNavigation } from "@/hooks/useAppNavigation";


export default function PresenterDesign({ setSlots,selectedSlotIdx }) {
  const colorVariants = {
      "#FF0000": "bg-[#FF0000] rounded-md h-8",
      "#FF9220": "bg-[#FF9220] rounded-md h-8",
      "#FFc71d": "bg-[#FFc71d] rounded-md h-8",
      "#bfff00": "bg-[#bfff00] rounded-md h-8",
      "#00d062": "bg-[#00d062] rounded-md h-8",
      "#5bbce4": "bg-[#5bbce4] rounded-md h-8",
      "#5A70CD": "bg-[#5A70CD] rounded-md h-8",
      "#A35ACD": "bg-[#A35ACD] rounded-md h-8",
      "#FC8EAC": "bg-[#FC8EAC] rounded-md h-8",
    };
    const colorKeys = Object.keys(colorVariants);

    const [step, setStep] = useState("type"); // "type" | "settings" | "draw"
    //settings with default vals (some settingParams are only tweakable for some fwTypes)
    const [selectedType, setSelectedType] = useState(null);
    const [color1, setColor1] = useState("#FF0000");
    const [color2, setColor2] = useState("#FF9220"); //fwType allows changing or not
    //const [burstSize, setBurstSize] = useState(55); //REMOVED
    const [launchWobble, setLaunchWobble] = useState(55); //new
    const [launchSpeed, setLaunchSpeed] = useState(55); 
    const [specialFxStr, setSpecialFxStr] = useState(55); //fwType allows changing or not
    const [drawing, setDrawing] = useState(null);
    const [imgPath, setImgPath] = useState(null);
    const [imgPathSecondary, setImgPathSecondary] = useState(null);
    const { navigateTo } = useAppNavigation();

    useEffect(() => {
        if (selectedType) {
            const newImgPath = new URL(
                `../../assets/fireworkTypes/fwType${selectedType.idx}c${colorKeys.indexOf(color1) + 1}.png`,
                import.meta.url
            ).href;
            setImgPath(newImgPath);
            console.log("setting imgPath", newImgPath);
        }
    }, [selectedType, color1]);

    useEffect(() => {
        if (selectedType) {
            const newImgPathSecondary = new URL(
                `../../assets/fireworkTypes/fwType${selectedType.idx}Secondaryc${colorKeys.indexOf(color2) + 1}.png`,
                import.meta.url
            ).href;
            setImgPathSecondary(newImgPathSecondary);
            console.log("setting imgPathSecondary", newImgPathSecondary);
        }
    }, [selectedType, color2]);

  // --- handleDesignCancel ---
   //clear slot and undo any Design changes and return to box
  const handleDesignCancel = () => {
    //setStep('type'); //will cause some glitch
    setSelectedType(null);
    setColor1("#ff0000");
    setColor2("#FF9220");
    setLaunchWobble(55);
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
      next[selectedSlotIdx] = design; // { type, colors, launchspeed etc } or your shape
      return next;
    });
    navigateTo('/fireworkBox');
  };

  // --- Firework type selection ---
  const handleTypeDone = (typeObj) => {
    setSelectedType(typeObj);
    console.log(typeObj);
    setStep("settings");
  };

  // --- Settings step ---
  const handleSettingsDone = () => {
    if (selectedType.boolDraw) {
      setStep("draw");
      console.log("Proceeding to draw step");
    } else {
      const design = { 
        type: selectedType,
        color1,
        color2,
        launchWobble,
        launchSpeed,
        specialFxStr,
        drawing,
        imgPath,
        boolCol2,
        imgPathSecondary
        };
        console.log("Design done without drawing:", design);
      handleDesignDone(design);
    }
  };

  // --- Draw step ---
  const handleDrawDone = () => {
    
    const design = {
        type: selectedType,
        color1,
        color2,
        launchWobble,
        launchSpeed,
        specialFxStr,
        drawing,
        imgPath,
        imgPathSecondary
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
            launchWobble={launchWobble}
            setLaunchWobble={setLaunchWobble}
            launchSpeed={launchSpeed}
            setLaunchSpeed={setLaunchSpeed}
            specialFxStr={specialFxStr}
            setSpecialFxStr={setSpecialFxStr}
            onCancel={handleDesignCancel}
            onSettingsDone={handleSettingsDone}
            boolCol2={selectedType.boolCol2} //only show params if selected fwType supports it
            boolSfx={selectedType.boolSfx}
            fwTypeIdx={selectedType.idx} 
            setImgPath={setImgPath}
            setImgPathSecondary={setImgPathSecondary}
            imgPath={imgPath}
            imgPathSecondary={imgPathSecondary}
        />
      )}

      {step === "draw" && (
        <DrawDesign
          onCancel={handleDesignCancel}
          onDrawDone={handleDrawDone}
          setDrawing={setDrawing}
          drawing={drawing}
        />
      )}
    </>
  );
}