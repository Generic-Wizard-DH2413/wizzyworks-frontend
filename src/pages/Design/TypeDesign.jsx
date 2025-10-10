//TODO, add an effect amount param which is only held by some types (AKA amountOfShit param)
import fwType1Img from '@/assets/fireworkTypes/fwType1.png';
import fwType2Img from '@/assets/fireworkTypes/fwType2.png';
import fwType3Img from '@/assets/fireworkTypes/fwType3.png';


export default function TypeDesign({ onCancel, onTypeDone }) {
  const fireworkTypes = [
    { name: "Sphere Burst", boolDraw: false, img: fwType1Img, boolCol2: true, boolSfx: true  },
    { name: "Long Hang Waterfall", boolDraw: false, img: fwType2Img,boolCol2: false, boolSfx: false  },
    { name: "Bold Dahlia", boolDraw: true, img: fwType3Img,boolCol2: false, boolSfx: true  },
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
            className="flex flex-col items-center bg-gray-100 rounded-md p-2 transition-transform active:scale-95 hover:opacity-90"
          >
            <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={fw.img}
                alt={fw.name}
                className="object-contain max-h-full max-w-full"
              />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-800">
              {fw.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}