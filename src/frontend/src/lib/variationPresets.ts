export interface VariationPreset {
  id: string;
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  vignette: number;
  grain: number;
  blur: number;
  temperature: number; // -1 to 1 (cool to warm)
}

export const VARIATION_PRESETS: VariationPreset[] = [
  {
    id: 'cinematic-warm',
    name: 'Cinematic Warm',
    brightness: 1.05,
    contrast: 1.15,
    saturation: 1.1,
    hue: 5,
    vignette: 0.3,
    grain: 0.02,
    blur: 0,
    temperature: 0.3,
  },
  {
    id: 'cool-fade',
    name: 'Cool Fade',
    brightness: 1.1,
    contrast: 0.95,
    saturation: 0.85,
    hue: -10,
    vignette: 0.2,
    grain: 0.01,
    blur: 0,
    temperature: -0.4,
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    brightness: 1.0,
    contrast: 1.3,
    saturation: 1.2,
    hue: 0,
    vignette: 0.4,
    grain: 0,
    blur: 0,
    temperature: 0,
  },
  {
    id: 'soft-portrait',
    name: 'Soft Portrait',
    brightness: 1.08,
    contrast: 0.9,
    saturation: 0.95,
    hue: 3,
    vignette: 0.15,
    grain: 0,
    blur: 1,
    temperature: 0.2,
  },
  {
    id: 'vintage-film',
    name: 'Vintage Film',
    brightness: 0.95,
    contrast: 1.1,
    saturation: 0.8,
    hue: 8,
    vignette: 0.5,
    grain: 0.04,
    blur: 0,
    temperature: 0.4,
  },
  {
    id: 'neon-pop',
    name: 'Neon Pop',
    brightness: 1.15,
    contrast: 1.25,
    saturation: 1.4,
    hue: -5,
    vignette: 0.1,
    grain: 0,
    blur: 0,
    temperature: -0.2,
  },
  {
    id: 'moody-dark',
    name: 'Moody Dark',
    brightness: 0.85,
    contrast: 1.35,
    saturation: 0.9,
    hue: 0,
    vignette: 0.6,
    grain: 0.03,
    blur: 0,
    temperature: -0.1,
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    brightness: 1.12,
    contrast: 1.08,
    saturation: 1.15,
    hue: 10,
    vignette: 0.25,
    grain: 0.01,
    blur: 0,
    temperature: 0.5,
  },
  {
    id: 'dreamy-soft',
    name: 'Dreamy Soft',
    brightness: 1.2,
    contrast: 0.85,
    saturation: 0.9,
    hue: 5,
    vignette: 0.1,
    grain: 0,
    blur: 2,
    temperature: 0.3,
  },
  {
    id: 'urban-grit',
    name: 'Urban Grit',
    brightness: 0.9,
    contrast: 1.4,
    saturation: 0.7,
    hue: -3,
    vignette: 0.45,
    grain: 0.05,
    blur: 0,
    temperature: -0.3,
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    brightness: 1.25,
    contrast: 0.8,
    saturation: 0.75,
    hue: 0,
    vignette: 0.05,
    grain: 0,
    blur: 1,
    temperature: 0.1,
  },
  {
    id: 'dramatic-shadows',
    name: 'Dramatic Shadows',
    brightness: 0.88,
    contrast: 1.5,
    saturation: 1.05,
    hue: 0,
    vignette: 0.55,
    grain: 0.02,
    blur: 0,
    temperature: 0,
  },
];

export function getRandomPresets(count: number, excludeIds: string[] = []): VariationPreset[] {
  const available = VARIATION_PRESETS.filter((p) => !excludeIds.includes(p.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
