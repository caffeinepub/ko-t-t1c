/**
 * Edge-aware blending utilities for smooth compositing of image patches.
 * Implements gradient-based feathering and soft mask generation to reduce seams.
 */

import type { PatchMask } from './patchFusion';

/**
 * Apply distance-transform feathering to a binary mask.
 * Softens edges by creating gradual transitions at patch boundaries.
 */
export function featherMask(mask: PatchMask, featherRadius: number): PatchMask {
  const { width, height, data } = mask;
  const feathered = new Uint8ClampedArray(data.length);
  
  // For each pixel, compute distance to nearest edge (transition from 0 to 255 or vice versa)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const currentValue = data[idx];
      
      // Find minimum distance to a different value within featherRadius
      let minDist = featherRadius + 1;
      
      for (let dy = -featherRadius; dy <= featherRadius; dy++) {
        for (let dx = -featherRadius; dx <= featherRadius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            const neighborValue = data[nIdx];
            
            // Check if this is an edge (different value)
            if (Math.abs(neighborValue - currentValue) > 128) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              minDist = Math.min(minDist, dist);
            }
          }
        }
      }
      
      // Apply feathering based on distance to edge
      if (minDist <= featherRadius) {
        const t = minDist / featherRadius; // 0 at edge, 1 at featherRadius away
        const smoothT = t * t * (3 - 2 * t); // Smoothstep interpolation
        
        if (currentValue > 128) {
          feathered[idx] = Math.round(128 + (127 * smoothT));
        } else {
          feathered[idx] = Math.round(127 * (1 - smoothT));
        }
      } else {
        feathered[idx] = currentValue;
      }
    }
  }
  
  return { width, height, data: feathered };
}

/**
 * Compute a simple gradient magnitude map for edge detection.
 */
export function computeGradientMap(imageData: ImageData): Float32Array {
  const { width, height, data } = imageData;
  const gradients = new Float32Array(width * height);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Compute gradient using neighboring pixels (grayscale approximation)
      const getGray = (offset: number) => {
        const i = idx + offset;
        return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      };
      
      const gx = getGray(4) - getGray(-4); // Right - Left
      const gy = getGray(width * 4) - getGray(-width * 4); // Down - Up
      
      gradients[y * width + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  
  return gradients;
}

/**
 * Generate an edge-aware blend mask that preserves structure from both images.
 * Uses gradient information to create smooth transitions.
 */
export function generateEdgeAwareMask(
  imageDataA: ImageData,
  imageDataB: ImageData,
  baseMask: PatchMask,
  edgePreservation: number = 0.5 // 0-1, how much to preserve edges
): PatchMask {
  const { width, height } = imageDataA;
  const gradA = computeGradientMap(imageDataA);
  const gradB = computeGradientMap(imageDataB);
  
  const result = new Uint8ClampedArray(width * height);
  
  for (let i = 0; i < result.length; i++) {
    const baseAlpha = baseMask.data[i] / 255;
    
    // Adjust alpha based on gradient strength
    // If Photo A has strong edges here, favor it; same for Photo B
    const gradStrengthA = gradA[i];
    const gradStrengthB = gradB[i];
    
    const totalGrad = gradStrengthA + gradStrengthB + 0.001; // Avoid division by zero
    const gradRatioA = gradStrengthA / totalGrad;
    const gradRatioB = gradStrengthB / totalGrad;
    
    // Blend the base mask with gradient-based preference
    let adjustedAlpha = baseAlpha;
    
    if (gradStrengthA > gradStrengthB) {
      // Photo A has stronger edges, reduce Photo B contribution
      adjustedAlpha = baseAlpha * (1 - edgePreservation * gradRatioA);
    } else {
      // Photo B has stronger edges, increase Photo B contribution
      adjustedAlpha = baseAlpha + (1 - baseAlpha) * edgePreservation * gradRatioB;
    }
    
    result[i] = Math.round(Math.max(0, Math.min(255, adjustedAlpha * 255)));
  }
  
  return { width, height, data: result };
}

/**
 * Apply Gaussian-like blur to a mask for smoother transitions.
 */
export function blurMask(mask: PatchMask, radius: number): PatchMask {
  const { width, height, data } = mask;
  const blurred = new Uint8ClampedArray(data.length);
  
  const kernel = createGaussianKernel(radius);
  const kernelSize = kernel.length;
  const halfKernel = Math.floor(kernelSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let weightSum = 0;
      
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const nx = x + kx - halfKernel;
          const ny = y + ky - halfKernel;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const weight = kernel[ky * kernelSize + kx];
            sum += data[ny * width + nx] * weight;
            weightSum += weight;
          }
        }
      }
      
      blurred[y * width + x] = Math.round(sum / weightSum);
    }
  }
  
  return { width, height, data: blurred };
}

/**
 * Create a simple Gaussian kernel for blurring.
 */
function createGaussianKernel(radius: number): Float32Array {
  const size = radius * 2 + 1;
  const kernel = new Float32Array(size * size);
  const sigma = radius / 2;
  const twoSigmaSquare = 2 * sigma * sigma;
  let sum = 0;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - radius;
      const dy = y - radius;
      const value = Math.exp(-(dx * dx + dy * dy) / twoSigmaSquare);
      kernel[y * size + x] = value;
      sum += value;
    }
  }
  
  // Normalize
  for (let i = 0; i < kernel.length; i++) {
    kernel[i] /= sum;
  }
  
  return kernel;
}
