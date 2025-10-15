import { useState, useRef, useEffect } from "react";

export default function SettingsDesign({
  color1,
  setColor1,
  color2,
  setColor2,
  burstSize,
  setBurstSize,
  launchSpeed,
  setLaunchSpeed,
  specialFxStr,
  setSpecialFxStr,
  onCancel,
  onSettingsDone,
  boolCol2,
  boolSfx,
  fwTypeIdx,
  setImgPath
}) {

  const [focusedKey, setFocusedKey] = useState("#FF0000");

  const colorVariants = {
        "#FF0000": "bg-[#FF0000] rounded-md h-10",
        "#FF9220": "bg-[#FF9220] rounded-md h-10",
        "#FFc71d": "bg-[#FFc71d] rounded-md h-10",
        "#bfff00": "bg-[#bfff00] rounded-md h-10",
        "#00d062": "bg-[#00d062] rounded-md h-10",
        "#5bbce4": "bg-[#5bbce4] rounded-md h-10",
        "#5A70CD": "bg-[#5A70CD] rounded-md h-10",
        "#A35ACD": "bg-[#A35ACD] rounded-md h-10",
        "#FC8EAC": "bg-[#FC8EAC] rounded-md h-10",
      };

  const colorItems = Object.keys(colorVariants).map((key, _) => <button onClick={()=>{setColor1(key)}} className={color1 == key? colorVariants[key] + " ring-4 ring-zinc-200" : colorVariants[key]}> </button>);
  const colorItems2 = Object.keys(colorVariants).map((key, _) => <button onClick={()=>{setColor2(key)}} className={color2 == key? colorVariants[key] + " ring-4 ring-zinc-200" : colorVariants[key]}> </button>);

  //compute preview img path dynamically
  const colorKeys = Object.keys(colorVariants);
  //console.log(colorKeys)
  const colIdx = colorKeys.indexOf(color1) + 1; //get colIdx of current selected color,,+1 bcus imgname are 1 idx'ed
  //console.log(colIdx)
  const imgPath = new URL(
    `../../assets/fireworkTypes/fwType${fwTypeIdx}c${colIdx}.png`,
    import.meta.url
  ).href;

  useEffect(() => {
    setImgPath(imgPath);
  });

  const [showCol2, setShowCol2] = useState(false); //Diff fr boolCol2, this is local UI state expand/collapse secondary col choices

  return (
    <>
    <div className="p-4">
    
      <div className="flex justify-between mb-4">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSettingsDone}>Done</button>
      </div>
      
{/*Firework Preview*/}
      <div
        className="w-full max-w-8/10 mx-auto rounded-xl border-6"
        style={{ borderColor: color2 ?? '#00000011' }}  // (see #3 below)
      >
        <div className="relative w-full" >
        <img
          src={imgPath}
          alt={`Preview of type ${fwTypeIdx} color ${colIdx}`}
          className="object-contain h-full w-full"
        />
        </div>
      </div>

      <h1 className="text-xl font-bold mb-2">Select the primary color</h1>
{/*Color1 */}
      <label className="block mb-4">
        <div className="grid grid-cols-3 gap-4">

          {colorItems}
          {/*
          <span>Color:</span>
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="ml-2"
                  />*/}
        </div>
      </label>
{/*Color2 conditionally rendered*/}

        {boolCol2 === true && (
        <label className="block mb-4">
{/*Color2 choices expandable via a parent button*/}
        <h1 className="text-xl font-bold mb-2">Select the secondary color</h1>
        <div className=" flex items-center justify-center">
        <button
            type="button"
            onClick={() => setShowCol2((v) => !v)}
            onMouseDown={(e) => e.preventDefault()}
            aria-expanded={showCol2}
            className=" flex items-center justify-center w-100 h-5 bg-zinc-700 text-gray-900 px-2 py-1 rounded-lg transition"
          >
            <span className={`transition-transform ${showCol2 ? 'rotate-180' : ''}`}>▾</span>
          </button>
          </div>
        {showCol2 && (<div style={{ height: 10 }} />)}
        {showCol2 && (
        
        <div className="grid grid-cols-3 gap-4">
          {colorItems2}
        </div>
        )}
        
      </label>
        )}

      <h1 className="text-xl font-bold mb-2">Additional Settings</h1>

      <label className="flex items-center block mb-4">
        <span>Burst size:</span>
        <input
          type="range"
          min="10"
          max="100"
          value={burstSize}
          onChange={(e) => setBurstSize(Number(e.target.value))}
          className="range accent-orange-500" 
        />
      </label>
      <label className="flex items-center gap-2 mb-4">
        <span>Launch Speed:</span>
        <input
          type="range"
          min="10"
          max="100"
          value={launchSpeed}
          onChange={(e) => setLaunchSpeed(Number(e.target.value))}
          className="range accent-orange-500" 
        />
      </label>
      {boolSfx === true && (
        <label className="flex items-center block mb-4">
            <span>Special Effects Amount:</span>
            <input
            type="range"
            min="10"
            max="100"
            value={specialFxStr}
            onChange={(e) => setSpecialFxStr(Number(e.target.value))}
            className="range accent-orange-500" 
            />
        </label>
        )}
      
    </div>
    </>
  );
}
