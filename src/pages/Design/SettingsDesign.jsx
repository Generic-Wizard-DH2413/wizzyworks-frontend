//TODO, add vids showcasing each type
//TODO, normalizing the burst size

export default function SettingsDesign({
  color1,
  setColor1,
  burstSize,
  setBurstSize,
  onCancel,
  onSettingsDone,
}) {
  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSettingsDone}>Done</button>
      </div>
      <h1 className="text-xl font-bold mb-2">Adjust Settings</h1>

      <label className="block mb-4">
        <span>Color:</span>
        <input
          type="color"
          value={color1}
          onChange={(e) => setColor1(e.target.value)}
          className="ml-2"
        />
      </label>

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
    </div>
  );
}
