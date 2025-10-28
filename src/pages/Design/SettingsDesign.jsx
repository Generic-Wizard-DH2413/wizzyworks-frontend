import { useEffect, useMemo, useState } from "react";
import {
  FIREWORK_COLOR_CLASSES,
  FIREWORK_COLOR_KEYS,
  buildFireworkImagePath,
} from "@/utils/fireworkAssets";
import { useText } from "@/i18n/useText";


export default function SettingsDesign({
  draft,
  onCancel,
  onSettingsDone,
  onUpdateDraft,
}) {
  const text = useText();
  const [showCol2, setShowCol2] = useState(false);

  useEffect(() => {
    if (!draft.type?.boolCol2) {
      setShowCol2(false);
    }
  }, [draft.type?.boolCol2]);

  const colorItems = FIREWORK_COLOR_KEYS.map((color) => (
    <button
    key={color}
    onClick={() => onUpdateDraft({ color1: color })}
    className={
      draft.color1 === color
        ? "rounded-md h-8 ring-6 ring-zinc-200"
        : "rounded-md h-8"
    }
    style={{ backgroundColor: color }}
  />
  ));

  const colorItems2 = FIREWORK_COLOR_KEYS.map((color) => (
    <button
    key={color}
    onClick={() => onUpdateDraft({ color2: color })}
    className={
      draft.color2 === color
        ? "rounded-md h-8 ring-6 ring-zinc-200"
        : "rounded-md h-8"
    }
    style={{ backgroundColor: color }}
  />
  ));

  const primaryImg = useMemo(
    () => buildFireworkImagePath(draft.type?.idx, draft.color1),
    [draft.type?.idx, draft.color1]
  );

  const secondaryImg = useMemo(
    () =>
      draft.type?.boolCol2
        ? buildFireworkImagePath(draft.type?.idx, draft.color2, "secondary")
        : null,
    [draft.type?.boolCol2, draft.type?.idx, draft.color2]
  );

  const handleSpecialFxChange = (value) => {
    onUpdateDraft({ specialFxStr: Number(value) });
  };

  const handleLaunchSpeedChange = (value) => {
    onUpdateDraft({ launchSpeed: Number(value) });
  };

  const handleLaunchWobbleChange = (value) => {
    onUpdateDraft({ launchWobble: Number(value) });
  };

  return (
    <div className="p-4 touch-pan-y overflow-auto">
      <div className="flex justify-between mb-4">
        <button onClick={onCancel}>
          {text("cancel")}</button>
        <button onClick={onSettingsDone}>
          {draft.type?.boolDraw ? text("next") : text("done")}
        </button>
      </div>

      {/* Firework Preview */}
      <div className="w-full max-w-8/10 mx-auto rounded-xl">
        <div className="relative w-full">
          {secondaryImg ? (
            <img
              src={secondaryImg}
              alt=""
              className="z-0 top-0 left-0 absolute"
            />
          ) : null}
          {primaryImg ? (
            <img
              src={primaryImg}
              alt={`Preview of type ${draft.type?.idx}`}
              className="object-contain h-full top-0 left-0 w-full z-1 relative"
            />
          ) : null}
        </div>
      </div>

      <h1 className="text-xl font-bold mb-2">
        {text("selectPrimaryColor")}
      </h1>

      <label className="block mb-4">
        <div className="grid grid-cols-3 gap-4">{colorItems}</div>
      </label>

      {draft.type?.boolCol2 ? (
        <label className="block mb-4">
          <h1 className="text-xl font-bold mb-2">
            {text("selectSecondaryColor")}
          </h1>
          <div className=" flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowCol2((value) => !value)}
              aria-expanded={showCol2}
              className=" flex items-center justify-center w-100 h-5 bg-zinc-700 text-gray-900 px-2 py-1 rounded-lg transition"
            >
              <span
                className={`transition-transform ${
                  showCol2 ? "rotate-180" : ""
                }`}
              >
                v
              </span>
            </button>
          </div>
          {showCol2 ? <div style={{ height: 10 }} /> : null}
          {showCol2 ? (
            <div className="grid grid-cols-3 gap-4">{colorItems2}</div>
          ) : null}
        </label>
      ) : null}

      <h1 className="text-xl font-bold mb-2">
        {text("fireworkSettingsHeader")}
      </h1>

      {draft.type?.boolSfx ? (
        <label className="flex items-center block mb-4">
          <span className="w-50">{text("sfxAmount")}</span>
          <input
            type="range"
            min="10"
            max="100"
            value={draft.specialFxStr}
            onChange={(event) => handleSpecialFxChange(event.target.value)}
            className="range range-xl accent-orange-500 w-full h-3"
          />
        </label>
      ) : null}

      <label className="flex items-center block mb-4">
        <span className="w-50">{text("launchSpeed")}</span>
        <input
          type="range"
          min="10"
          max="100"
          value={draft.launchSpeed}
          onChange={(event) => handleLaunchSpeedChange(event.target.value)}
          className="range range-xl accent-orange-500 w-full rounded-lg "
        />
      </label>

      <label className="flex items-center block mb-4">
        <span className="w-50">{text("launchWobble")}</span>
        <input
          type="range"
          min="10"
          max="100"
          value={draft.launchWobble}
          onChange={(event) => handleLaunchWobbleChange(event.target.value)}
          className="range range-xl accent-orange-500 w-full h-3"
        />
      </label>
    </div>
  );
}
