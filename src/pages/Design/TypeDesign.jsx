//TODO: add pics of types
export default function TypeDesign({ onCancel, onTypeDone }) {
  const fireworkTypes = [
    { name: "fwType1", boolDraw: false },
    { name: "fwType2", boolDraw: true },
    { name: "fwType3", boolDraw: false },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={onCancel}>Cancel</button>
      </div>
      <h1 className="text-xl font-bold mb-2">Select a firework type</h1>
      <div className="grid grid-cols-3 gap-4">
        {fireworkTypes.map((fw, i) => (
          <button
            key={i}
            onClick={() => onTypeDone(fw)}
            className="aspect-square bg-gray-300 rounded-md active:opacity-70"
          > 
            {fw.name }
          </button>
        ))}
      </div>
    </div>
  );
}