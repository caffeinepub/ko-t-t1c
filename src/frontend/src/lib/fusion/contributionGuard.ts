/**
 * Contribution guard to detect near-duplicate outputs that are too similar to either input.
 * Ensures fusion outputs genuinely combine both photos rather than being minor variations of one.
 */

export interface SimilarityResult {
  isValid: boolean; // false if output is too similar to either input
  similarityToA: number; // 0-1, how similar to Photo A
  similarityToB: number; // 0-1, how similar to Photo B
  reason?: string; // Why it failed, if applicable
}

const SIMILARITY_THRESHOLD = 0.85; // If similarity > 85%, consider it a near-duplicate

/**
 * Check if a fusion output is too similar to either input image.
 * Uses downsampled luminance comparison and edge-map similarity.
 */
export function checkContribution(
  outputImageData: ImageData,
  inputAImageData: ImageData,
  inputBImageData: ImageData
): SimilarityResult {
  // Downsample all images for faster comparison
  const downsampleSize = 64;
  const outputSample = downsampleAndExtractFeatures(outputImageData, downsampleSize);
  const inputASample = downsampleAndExtractFeatures(inputAImageData, downsampleSize);
  const inputBSample = downsampleAndExtractFeatures(inputBImageData, downsampleSize);
  
  // Compute similarity scores
  const similarityToA = computeSimilarity(outputSample, inputASample);
  const similarityToB = computeSimilarity(outputSample, inputBSample);
  
  // Check if output is too similar to either input
  if (similarityToA > SIMILARITY_THRESHOLD) {
    return {
      isValid: false,
      similarityToA,
      similarityToB,
      reason: `Output is too similar to Photo A (${(similarityToA * 100).toFixed(1)}% match)`,
    };
  }
  
  if (similarityToB > SIMILARITY_THRESHOLD) {
    return {
      isValid: false,
      similarityToA,
      similarityToB,
      reason: `Output is too similar to Photo B (${(similarityToB * 100).toFixed(1)}% match)`,
    };
  }
  
  return {
    isValid: true,
    similarityToA,
    similarityToB,
  };
}

interface ImageFeatures {
  luminance: Float32Array;
  edges: Float32Array;
  colorHist: Float32Array;
}

/**
 * Downsample image and extract features for comparison.
 */
function downsampleAndExtractFeatures(
  imageData: ImageData,
  targetSize: number
): ImageFeatures {
  const { width, height, data } = imageData;
  const scale = Math.min(targetSize / width, targetSize / height);
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);
  
  const luminance = new Float32Array(newWidth * newHeight);
  const edges = new Float32Array(newWidth * newHeight);
  const colorHist = new Float32Array(64); // 4x4x4 RGB histogram
  
  // Downsample and compute luminance
  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.floor(x / scale);
      const srcY = Math.floor(y / scale);
      const srcIdx = (srcY * width + srcX) * 4;
      
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];
      
      // Luminance (grayscale)
      luminance[y * newWidth + x] = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Color histogram (4 bins per channel = 64 total)
      const rBin = Math.floor(r / 64);
      const gBin = Math.floor(g / 64);
      const bBin = Math.floor(b / 64);
      const histIdx = rBin * 16 + gBin * 4 + bBin;
      colorHist[histIdx]++;
    }
  }
  
  // Normalize color histogram
  const totalPixels = newWidth * newHeight;
  for (let i = 0; i < colorHist.length; i++) {
    colorHist[i] /= totalPixels;
  }
  
  // Compute edge map (simple gradient)
  for (let y = 1; y < newHeight - 1; y++) {
    for (let x = 1; x < newWidth - 1; x++) {
      const idx = y * newWidth + x;
      const gx = luminance[idx + 1] - luminance[idx - 1];
      const gy = luminance[idx + newWidth] - luminance[idx - newWidth];
      edges[idx] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  
  return { luminance, edges, colorHist };
}

/**
 * Compute similarity between two feature sets.
 * Returns a value between 0 (completely different) and 1 (identical).
 */
function computeSimilarity(featuresA: ImageFeatures, featuresB: ImageFeatures): number {
  // Luminance similarity (MSE-based)
  let lumDiff = 0;
  for (let i = 0; i < featuresA.luminance.length; i++) {
    const diff = featuresA.luminance[i] - featuresB.luminance[i];
    lumDiff += diff * diff;
  }
  lumDiff = Math.sqrt(lumDiff / featuresA.luminance.length);
  const lumSimilarity = Math.max(0, 1 - lumDiff / 255);
  
  // Edge similarity
  let edgeDiff = 0;
  for (let i = 0; i < featuresA.edges.length; i++) {
    const diff = featuresA.edges[i] - featuresB.edges[i];
    edgeDiff += diff * diff;
  }
  edgeDiff = Math.sqrt(edgeDiff / featuresA.edges.length);
  const edgeSimilarity = Math.max(0, 1 - edgeDiff / 100);
  
  // Color histogram similarity (chi-square distance)
  let colorDiff = 0;
  for (let i = 0; i < featuresA.colorHist.length; i++) {
    const sum = featuresA.colorHist[i] + featuresB.colorHist[i];
    if (sum > 0) {
      const diff = featuresA.colorHist[i] - featuresB.colorHist[i];
      colorDiff += (diff * diff) / sum;
    }
  }
  const colorSimilarity = Math.max(0, 1 - colorDiff);
  
  // Weighted combination
  return lumSimilarity * 0.5 + edgeSimilarity * 0.3 + colorSimilarity * 0.2;
}
