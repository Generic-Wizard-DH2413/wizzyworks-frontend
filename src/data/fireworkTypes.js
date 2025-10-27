export const FIREWORK_TYPES = [
  {
    idx: 1,
    name: "Sphere Blast",
    godotName: "sphere",
    boolDraw: true,
    boolCol2: false,
    boolSfx: true,
  },
  {
    idx: 2,
    name: "Willow Fall",
    godotName: "willow",
    boolDraw: true,
    boolCol2: false,
    boolSfx: true,
  },
  {
    idx: 3,
    name: "Saturn Rings",
    godotName: "saturn",
    boolDraw: true,
    boolCol2: false,
    boolSfx: true,
  },
  {
    idx: 4,
    name: "Cluster Show",
    godotName: "cluster",
    boolDraw: true,
    boolCol2: true,
    boolSfx: true,
  },
  {
    idx: 5,
    name: "Sparkling Stars",
    godotName: "another_cluster",
    boolDraw: true,
    boolCol2: true,
    boolSfx: true,
  },
  {
    idx: 6,
    name: "Pistil Burst",
    godotName: "pistil",
    boolDraw: false,
    boolCol2: true,
    boolSfx: true,
  },
  {
    idx: 7,
    name: "Chrysanthemum Rays",
    godotName: "chrysanthemum",
    boolDraw: false,
    boolCol2: false,
    boolSfx: true,
  },
];

export const getFireworkTypeByIdx = (idx) =>
  FIREWORK_TYPES.find((type) => type.idx === idx) ?? null;
