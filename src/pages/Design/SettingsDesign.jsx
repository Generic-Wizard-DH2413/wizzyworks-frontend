//TODO, add imgs showcasing each type (dependent on col1)

export default function SettingsDesign({
  color1,
  setColor1,
  burstSize,
  setBurstSize,
  launchSpeed,
  setLaunchSpeed,
  specialFxStr,
  setSpecialFxStr,
  onCancel,
  onSettingsDone,
  boolCol2,
  boolSfx
}) {

  const colorVariants = {
        "#FF0000": "bg-[#FF0000] rounded-md h-10 hover:bg-[#a70000]",
        "#FF9220": "bg-[#FF9220] rounded-md h-10 hover:bg-[#be6608]",
        "#FFc71d": "bg-[#FFc71d] rounded-md h-10 hover:bg-[#c7a600]",
        "#bfff00": "bg-[#bfff00] rounded-md h-10 hover:bg-[#8aaf00]",
        "#00d062": "bg-[#00d062] rounded-md h-10 hover:bg-[#009c4a]",
        "#5bbce4": "bg-[#5bbce4] rounded-md h-10 hover:bg-[#3c96c4]",
        "#5A70CD": "bg-[#5A70CD] rounded-md h-10 hover:bg-[#4354a1]",
        "#A35ACD": "bg-[#A35ACD] rounded-md h-10 hover:bg-[#8038a5]",
        "#FC8EAC": "bg-[#FC8EAC] rounded-md h-10 hover:bg-[#d86a8a]",
      };
  const colorItems = Object.keys(colorVariants).map((key, _) => <button onClick={()=>{console.log(key); setColor1(key)}} className={colorVariants[key]}> </button>);

  return (
    <>
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSettingsDone}>Done</button>
      </div>
      <h1 className="text-xl font-bold mb-2">Adjust Settings</h1>

      <label className="block mb-4">
        <span>Main Firework Color:</span>
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

        {boolCol2 === true && (
        <label className="block mb-4">
        <span>Secondary Firework Color:</span>
        <div className="grid grid-cols-3 gap-4">
          {colorItems}
        </div>
        
      </label>
        )}

      <label className="block mb-4">
        <span>Burst size:</span>
        <input
          type="range"
          min="10"
          max="100"
          value={burstSize}
          onChange={(e) => setBurstSize(Number(e.target.value))}
        />
      </label>
      <label className="block mb-4">
        <span>Launch Speed:</span>
        <input
          type="range"
          min="10"
          max="100"
          value={launchSpeed}
          onChange={(e) => setLaunchSpeed(Number(e.target.value))}
        />
      </label>
      {boolSfx === true && (
        <label className="block mb-4">
            <span>Special Effects Amount:</span>
            <input
            type="range"
            min="10"
            max="100"
            value={specialFxStr}
            onChange={(e) => setSpecialFxStr(Number(e.target.value))}
            />
        </label>
        )}
      
      <button 
                        onClick={()=>{}}
                        className="bg-orange-500/80 hover:bg-orange-500 text-white font-medium text-base py-2 px-6 rounded-xl 
                                 transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-400/30"
                    >
                        Clear Canvas
                    </button>
    </div>
    </>
  );
}
