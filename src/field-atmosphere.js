// Biome-specific color grading across all 8 battlefield environments. No additional shadow passes.
const PRESETS = {
  desert:   { sky: 0xc8b49a, fog: 0.0050, exposure: 1.20, hemiSky: 0xffe4bc, hemiGround: 0x785c3b, sun: 0xffd6a1, sunIntensity: 2.15, hemiIntensity: 1.65 },
  steppe:   { sky: 0xc4bca2, fog: 0.0044, exposure: 1.18, hemiSky: 0xf4e8c9, hemiGround: 0x6a5c3d, sun: 0xffe2ae, sunIntensity: 2.10, hemiIntensity: 1.62 },
  forest:   { sky: 0x899c92, fog: 0.0052, exposure: 1.14, hemiSky: 0xcfe0d6, hemiGround: 0x3b4931, sun: 0xf7dca4, sunIntensity: 1.95, hemiIntensity: 1.70 },
  hills:    { sky: 0x9ca9aa, fog: 0.0044, exposure: 1.18, hemiSky: 0xdae6eb, hemiGround: 0x515744, sun: 0xffe4b8, sunIntensity: 2.12, hemiIntensity: 1.65 },
  mountain: { sky: 0xa6b2b8, fog: 0.0054, exposure: 1.16, hemiSky: 0xe3ecf2, hemiGround: 0x555753, sun: 0xffebc8, sunIntensity: 2.15, hemiIntensity: 1.68 },
  coastal:  { sky: 0x99b1bd, fog: 0.0040, exposure: 1.20, hemiSky: 0xdff0f7, hemiGround: 0x4c5d4c, sun: 0xffe5b8, sunIntensity: 2.15, hemiIntensity: 1.66 },
  marsh:    { sky: 0x88948a, fog: 0.0062, exposure: 1.10, hemiSky: 0xc8d4ca, hemiGround: 0x3c4334, sun: 0xebd7aa, sunIntensity: 1.85, hemiIntensity: 1.62 },
  plains:   { sky: 0x9ba9a1, fog: 0.0042, exposure: 1.18, hemiSky: 0xd9e6e4, hemiGround: 0x4d5439, sun: 0xffdfa9, sunIntensity: 2.10, hemiIntensity: 1.65 }
};

export function fieldAtmosphere(biome) {
  const key = String(biome || 'plains').toLowerCase();
  return PRESETS[key] || (key === 'highlands' ? PRESETS.hills : key === 'mountains' ? PRESETS.mountain : PRESETS.plains);
}

export function applyFieldAtmosphere(scene, renderer, biome) {
  const grade = fieldAtmosphere(biome);
  scene.background?.setHex(grade.sky);
  if (scene.fog) {
    scene.fog.color?.setHex(grade.sky);
    scene.fog.density = grade.fog;
  }
  renderer.toneMappingExposure = grade.exposure;
  for (const light of scene.children || []) {
    if (light.isHemisphereLight) {
      light.color.setHex(grade.hemiSky);
      light.groundColor.setHex(grade.hemiGround);
      light.intensity = grade.hemiIntensity;
    } else if (light.isDirectionalLight) {
      light.color.setHex(grade.sun);
      light.intensity = grade.sunIntensity;
    }
  }
  return grade;
}
