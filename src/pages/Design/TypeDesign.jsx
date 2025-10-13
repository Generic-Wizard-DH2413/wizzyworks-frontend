//TODO, update so the pic corresponds to the correct type (ok) but also the correct chosen color (fwTypeXcY)
import fwType1Img from '@/assets/fireworkTypes/fwType1c1.png';
import fwType2Img from '@/assets/fireworkTypes/fwType2c1.png';
import fwType3Img from '@/assets/fireworkTypes/fwType3c1.png';


export default function TypeDesign({ onCancel, onTypeDone }) {
  const fireworkTypes = [
    { idx:1, name: "Sphere Burst", boolDraw: false, img: fwType1Img, boolCol2: true, boolSfx: true  },
    { idx:2,name: "Long Hang Waterfall", boolDraw: false, img: fwType2Img,boolCol2: false, boolSfx: false  },
    { idx:3,name: "Bold Dahlia", boolDraw: true, img: fwType3Img,boolCol2: false, boolSfx: true  },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={onCancel}>Cancel</button>
      </div>
      <h1 className="text-2xl font-extrabold mb-4">Select a firework type</h1>

      <div className="grid grid-cols-3 gap-4">
        {fireworkTypes.map((fw, i) => (
          <button
            key={i}
            onClick={() => onTypeDone(fw)}
            className="flex flex-col items-center bg-zinc-800 rounded-md p-2 transition-transform active:scale-95 hover:opacity-90"
          >
            <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={fw.img}
                alt={fw.name}
                className="object-contain max-h-full max-w-full"
              />
            </div>
            <span className="mt-2 text-sm font-medium text-white">
              {fw.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}