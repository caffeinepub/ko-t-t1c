import type { VariationItem } from './variationState';
import { generatePatchMask, generateMultiScalePatchMask, generateGradientAwareMask, applyPatchFusion } from './fusion/patchFusion';
import { featherMask, generateEdgeAwareMask, blurMask } from './fusion/edgeAwareBlend';
import { checkContribution } from './fusion/contributionGuard';

// Fusion recipe types
type FusionRecipe = {
  id: string;
  name: string;
  technique: 'patch-grid' | 'multi-scale' | 'gradient-aware' | 'edge-blend';
  featherRadius: number; // Pixels to feather at patch edges
  edgePreservation: number; // 0-1, how much to preserve edges
  colorShift: number; // -180 to 180 degrees hue shift (optional finishing)
  saturationBoost: number; // 0.5-2.0 (optional finishing)
  seed: number; // Random seed for reproducibility
};

const FUSION_RECIPES: FusionRecipe[] = [
  { id: 'f1', name: 'Patchwork Blend', technique: 'patch-grid', featherRadius: 8, edgePreservation: 0.5, colorShift: 0, saturationBoost: 1.0, seed: 1001 },
  { id: 'f2', name: 'Organic Fusion', technique: 'multi-scale', featherRadius: 12, edgePreservation: 0.6, colorShift: 10, saturationBoost: 1.1, seed: 2002 },
  { id: 'f3', name: 'Edge-Aware Mix', technique: 'edge-blend', featherRadius: 10, edgePreservation: 0.7, colorShift: -15, saturationBoost: 1.05, seed: 3003 },
  { id: 'f4', name: 'Gradient Composite', technique: 'gradient-aware', featherRadius: 6, edgePreservation: 0.4, colorShift: 20, saturationBoost: 1.15, seed: 4004 },
  { id: 'f5', name: 'Soft Patchwork', technique: 'patch-grid', featherRadius: 15, edgePreservation: 0.3, colorShift: -10, saturationBoost: 1.0, seed: 5005 },
  { id: 'f6', name: 'Structured Blend', technique: 'multi-scale', featherRadius: 8, edgePreservation: 0.8, colorShift: 5, saturationBoost: 1.2, seed: 6006 },
  { id: 'f7', name: 'Detail Fusion', technique: 'edge-blend', featherRadius: 5, edgePreservation: 0.9, colorShift: 30, saturationBoost: 1.25, seed: 7007 },
  { id: 'f8', name: 'Smooth Gradient', technique: 'gradient-aware', featherRadius: 20, edgePreservation: 0.2, colorShift: -20, saturationBoost: 0.95, seed: 8008 },
  { id: 'f9', name: 'Bold Patchwork', technique: 'patch-grid', featherRadius: 4, edgePreservation: 0.6, colorShift: 45, saturationBoost: 1.3, seed: 9009 },
  { id: 'f10', name: 'Layered Mix', technique: 'multi-scale', featherRadius: 10, edgePreservation: 0.5, colorShift: -25, saturationBoost: 1.1, seed: 10010 },
  { id: 'f11', name: 'Balanced Fusion', technique: 'edge-blend', featherRadius: 12, edgePreservation: 0.5, colorShift: 15, saturationBoost: 1.15, seed: 11011 },
  { id: 'f12', name: 'Artistic Blend', technique: 'gradient-aware', featherRadius: 8, edgePreservation: 0.7, colorShift: -30, saturationBoost: 1.35, seed: 12012 },
];

const MAX_RETRIES = 3; // Maximum attempts to generate a valid fusion

function getRandomRecipes(count: number, excludeIds: string[] = []): FusionRecipe[] {
  const available = FUSION_RECIPES.filter((r) => !excludeIds.includes(r.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export async function generateFusionVariations(
  photoAUrl: string,
  photoBUrl: string,
  count: number,
  excludeRecipeIds: string[] = []
): Promise<VariationItem[]> {
  const recipes = getRandomRecipes(count, excludeRecipeIds);
  const variations: VariationItem[] = [];

  for (const recipe of recipes) {
    let attempts = 0;
    let success = false;

    while (attempts < MAX_RETRIES && !success) {
      try {
        const fusionUrl = await applyFusion(photoAUrl, photoBUrl, recipe, attempts);
        variations.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          imageUrl: fusionUrl,
          presetId: recipe.id,
          presetName: recipe.name,
        });
        success = true;
      } catch (error) {
        attempts++;
        if (attempts >= MAX_RETRIES) {
          console.error(`Failed to generate valid fusion for ${recipe.name} after ${MAX_RETRIES} attempts:`, error);
          throw new Error(
            `Could not produce a valid fusion from the chosen photos using the "${recipe.name}" technique. The images may be too similar or incompatible. Please try different photos.`
          );
        }
      }
    }
  }

  if (variations.length === 0) {
    throw new Error('Failed to generate any valid fusion outputs. The chosen photos may not be suitable for fusion. Please try different photos.');
  }

  return variations;
}

async function applyFusion(
  photoAUrl: string,
  photoBUrl: string,
  recipe: FusionRecipe,
  retryAttempt: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const imgA = new Image();
    const imgB = new Image();
    imgA.crossOrigin = 'anonymous';
    imgB.crossOrigin = 'anonymous';

    let loadedA = false;
    let loadedB = false;

    const checkBothLoaded = () => {
      if (loadedA && loadedB) {
        try {
          const result = performFusion(imgA, imgB, recipe, retryAttempt);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    };

    imgA.onload = () => {
      loadedA = true;
      checkBothLoaded();
    };

    imgB.onload = () => {
      loadedB = true;
      checkBothLoaded();
    };

    imgA.onerror = () => reject(new Error('Failed to load Photo A'));
    imgB.onerror = () => reject(new Error('Failed to load Photo B'));

    imgA.src = photoAUrl;
    imgB.src = photoBUrl;
  });
}

function performFusion(
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  recipe: FusionRecipe,
  retryAttempt: number
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Use the larger dimensions
  canvas.width = Math.max(imgA.width, imgB.width);
  canvas.height = Math.max(imgA.height, imgB.height);

  // Draw Photo A
  ctx.drawImage(imgA, 0, 0, canvas.width, canvas.height);
  const imageDataA = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Draw Photo B to temp canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Failed to get temp canvas context');
  
  tempCtx.drawImage(imgB, 0, 0, canvas.width, canvas.height);
  const imageDataB = tempCtx.getImageData(0, 0, canvas.width, canvas.height);

  // Generate patch mask based on technique
  const seed = recipe.seed + retryAttempt * 1000; // Vary seed on retry
  let baseMask;
  
  switch (recipe.technique) {
    case 'patch-grid':
      baseMask = generatePatchMask(canvas.width, canvas.height, {
        gridSize: 6 + retryAttempt, // Vary grid size on retry
        randomness: 0.5,
        seed,
      });
      break;
    case 'multi-scale':
      baseMask = generateMultiScalePatchMask(canvas.width, canvas.height, seed);
      break;
    case 'gradient-aware':
      baseMask = generateGradientAwareMask(imageDataA, seed);
      break;
    case 'edge-blend':
      // Start with a simple patch mask, then apply edge-aware refinement
      const simpleMask = generatePatchMask(canvas.width, canvas.height, {
        gridSize: 5,
        randomness: 0.5,
        seed,
      });
      baseMask = generateEdgeAwareMask(imageDataA, imageDataB, simpleMask, recipe.edgePreservation);
      break;
    default:
      baseMask = generatePatchMask(canvas.width, canvas.height, {
        gridSize: 6,
        randomness: 0.5,
        seed,
      });
  }

  // Apply feathering to smooth patch edges
  let finalMask = baseMask;
  if (recipe.featherRadius > 0) {
    finalMask = featherMask(baseMask, recipe.featherRadius);
    // Additional blur for extra smoothness
    finalMask = blurMask(finalMask, Math.ceil(recipe.featherRadius / 2));
  }

  // Apply patch-based fusion
  let fusedData = applyPatchFusion(imageDataA, imageDataB, finalMask);

  // Optional finishing touches (minimal global adjustments)
  if (recipe.colorShift !== 0 || recipe.saturationBoost !== 1.0) {
    fusedData = applyColorAdjustments(fusedData, recipe.colorShift, recipe.saturationBoost);
  }

  // Check contribution guard
  const contributionCheck = checkContribution(fusedData, imageDataA, imageDataB);
  
  if (!contributionCheck.isValid) {
    throw new Error(contributionCheck.reason || 'Output too similar to one of the inputs');
  }

  ctx.putImageData(fusedData, 0, 0);
  return canvas.toDataURL('image/png');
}

function applyColorAdjustments(
  imageData: ImageData,
  colorShift: number,
  saturationBoost: number
): ImageData {
  const { width, height, data } = imageData;
  const adjusted = new ImageData(width, height);
  const adjustedData = adjusted.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply color shift (hue rotation)
    if (colorShift !== 0) {
      const hsl = rgbToHsl(r, g, b);
      hsl[0] = (hsl[0] + colorShift / 360) % 1;
      if (hsl[0] < 0) hsl[0] += 1;
      const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
      r = rgb[0];
      g = rgb[1];
      b = rgb[2];
    }

    // Apply saturation boost
    if (saturationBoost !== 1.0) {
      const hsl = rgbToHsl(r, g, b);
      hsl[1] = Math.min(1, hsl[1] * saturationBoost);
      const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
      r = rgb[0];
      g = rgb[1];
      b = rgb[2];
    }

    // Clamp values
    adjustedData[i] = Math.max(0, Math.min(255, r));
    adjustedData[i + 1] = Math.max(0, Math.min(255, g));
    adjustedData[i + 2] = Math.max(0, Math.min(255, b));
    adjustedData[i + 3] = 255;
  }

  return adjusted;
}

// Helper functions for color space conversion
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}
