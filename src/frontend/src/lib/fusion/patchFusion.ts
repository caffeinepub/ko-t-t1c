/**
 * Patch-based fusion utilities for localized region mixing between two images.
 * Implements multi-scale patch sampling and mask generation for true two-image composites.
 */

export interface PatchConfig {
  gridSize: number; // Number of patches per dimension (e.g., 4 = 4x4 grid = 16 patches)
  randomness: number; // 0-1, how randomly to select patches from A vs B
  seed: number; // Random seed for reproducibility
}

export interface PatchMask {
  width: number;
  height: number;
  data: Uint8ClampedArray; // 0-255 alpha values for each pixel
}

/**
 * Generate a patch-based selection mask that chooses regions from Photo A or Photo B.
 * Returns a mask where 0 = use Photo A, 255 = use Photo B, intermediate = blend.
 */
export function generatePatchMask(
  width: number,
  height: number,
  config: PatchConfig
): PatchMask {
  const mask = new Uint8ClampedArray(width * height);
  const patchWidth = Math.ceil(width / config.gridSize);
  const patchHeight = Math.ceil(height / config.gridSize);

  // Seeded random number generator
  let seed = config.seed;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // For each patch in the grid, decide if it comes from A or B
  for (let py = 0; py < config.gridSize; py++) {
    for (let px = 0; px < config.gridSize; px++) {
      const usePhotoB = random() < config.randomness;
      const value = usePhotoB ? 255 : 0;

      // Fill the patch region
      const startX = px * patchWidth;
      const startY = py * patchHeight;
      const endX = Math.min(startX + patchWidth, width);
      const endY = Math.min(startY + patchHeight, height);

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          mask[y * width + x] = value;
        }
      }
    }
  }

  return { width, height, data: mask };
}

/**
 * Generate a multi-scale patch mask with varying patch sizes for more organic fusion.
 */
export function generateMultiScalePatchMask(
  width: number,
  height: number,
  seed: number
): PatchMask {
  const mask = new Uint8ClampedArray(width * height);
  
  // Seeded random
  let s = seed;
  const random = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  // Layer 1: Large patches (4x4 grid)
  const largePatchW = Math.ceil(width / 4);
  const largePatchH = Math.ceil(height / 4);
  
  for (let py = 0; py < 4; py++) {
    for (let px = 0; px < 4; px++) {
      const value = random() < 0.5 ? 0 : 255;
      const startX = px * largePatchW;
      const startY = py * largePatchH;
      const endX = Math.min(startX + largePatchW, width);
      const endY = Math.min(startY + largePatchH, height);

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          mask[y * width + x] = value;
        }
      }
    }
  }

  // Layer 2: Medium patches (8x8 grid) - override some regions
  const medPatchW = Math.ceil(width / 8);
  const medPatchH = Math.ceil(height / 8);
  
  for (let py = 0; py < 8; py++) {
    for (let px = 0; px < 8; px++) {
      if (random() < 0.3) { // Only override 30% of medium patches
        const value = random() < 0.5 ? 0 : 255;
        const startX = px * medPatchW;
        const startY = py * medPatchH;
        const endX = Math.min(startX + medPatchW, width);
        const endY = Math.min(startY + medPatchH, height);

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            mask[y * width + x] = value;
          }
        }
      }
    }
  }

  return { width, height, data: mask };
}

/**
 * Generate a gradient-based mask that favors edges and high-contrast regions.
 * Useful for saliency-aware patch selection.
 */
export function generateGradientAwareMask(
  imageData: ImageData,
  seed: number
): PatchMask {
  const { width, height, data } = imageData;
  const mask = new Uint8ClampedArray(width * height);
  
  // Compute simple gradient magnitude for each pixel
  const gradients = new Float32Array(width * height);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const pixelIdx = idx * 4;
      
      // Sobel-like gradient approximation
      const gx = 
        -data[(pixelIdx - width * 4 - 4)] + data[(pixelIdx - width * 4 + 4)] +
        -2 * data[(pixelIdx - 4)] + 2 * data[(pixelIdx + 4)] +
        -data[(pixelIdx + width * 4 - 4)] + data[(pixelIdx + width * 4 + 4)];
      
      const gy =
        -data[(pixelIdx - width * 4 - 4)] - 2 * data[(pixelIdx - width * 4)] - data[(pixelIdx - width * 4 + 4)] +
        data[(pixelIdx + width * 4 - 4)] + 2 * data[(pixelIdx + width * 4)] + data[(pixelIdx + width * 4 + 4)];
      
      gradients[idx] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  
  // Normalize gradients
  const maxGrad = Math.max(...gradients);
  if (maxGrad > 0) {
    for (let i = 0; i < gradients.length; i++) {
      gradients[i] /= maxGrad;
    }
  }
  
  // Use gradient to influence patch selection
  let s = seed;
  const random = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  
  const patchSize = 32;
  for (let py = 0; py < Math.ceil(height / patchSize); py++) {
    for (let px = 0; px < Math.ceil(width / patchSize); px++) {
      // Sample gradient in this patch
      let avgGrad = 0;
      let count = 0;
      const startX = px * patchSize;
      const startY = py * patchSize;
      const endX = Math.min(startX + patchSize, width);
      const endY = Math.min(startY + patchSize, height);
      
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          avgGrad += gradients[y * width + x];
          count++;
        }
      }
      avgGrad /= count;
      
      // Higher gradient = more likely to pick from Photo B (for variety)
      const threshold = 0.3 + avgGrad * 0.4;
      const value = random() < threshold ? 255 : 0;
      
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          mask[y * width + x] = value;
        }
      }
    }
  }
  
  return { width, height, data: mask };
}

/**
 * Apply patch-based fusion using a mask to select regions from Photo A or Photo B.
 */
export function applyPatchFusion(
  imageDataA: ImageData,
  imageDataB: ImageData,
  mask: PatchMask
): ImageData {
  const { width, height } = imageDataA;
  const result = new ImageData(width, height);
  
  const dataA = imageDataA.data;
  const dataB = imageDataB.data;
  const resultData = result.data;
  const maskData = mask.data;
  
  for (let i = 0; i < maskData.length; i++) {
    const alpha = maskData[i] / 255; // 0 = use A, 1 = use B
    const pixelIdx = i * 4;
    
    resultData[pixelIdx] = dataA[pixelIdx] * (1 - alpha) + dataB[pixelIdx] * alpha;
    resultData[pixelIdx + 1] = dataA[pixelIdx + 1] * (1 - alpha) + dataB[pixelIdx + 1] * alpha;
    resultData[pixelIdx + 2] = dataA[pixelIdx + 2] * (1 - alpha) + dataB[pixelIdx + 2] * alpha;
    resultData[pixelIdx + 3] = 255;
  }
  
  return result;
}
