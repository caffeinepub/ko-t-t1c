import { getRandomPresets, type VariationPreset } from './variationPresets';
import type { VariationItem } from './variationState';

export async function generateVariations(
  imageUrl: string,
  count: number,
  excludePresetIds: string[] = []
): Promise<VariationItem[]> {
  const presets = getRandomPresets(count, excludePresetIds);
  const variations: VariationItem[] = [];

  for (const preset of presets) {
    try {
      const variationUrl = await applyPreset(imageUrl, preset);
      variations.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        imageUrl: variationUrl,
        presetId: preset.id,
        presetName: preset.name,
      });
    } catch (error) {
      console.error(`Failed to apply preset ${preset.name}:`, error);
    }
  }

  return variations;
}

async function applyPreset(imageUrl: string, preset: VariationPreset): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply color adjustments
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Temperature adjustment
          if (preset.temperature > 0) {
            r += preset.temperature * 30;
            b -= preset.temperature * 20;
          } else {
            r += preset.temperature * 20;
            b -= preset.temperature * 30;
          }

          // Brightness
          r *= preset.brightness;
          g *= preset.brightness;
          b *= preset.brightness;

          // Contrast
          r = ((r / 255 - 0.5) * preset.contrast + 0.5) * 255;
          g = ((g / 255 - 0.5) * preset.contrast + 0.5) * 255;
          b = ((b / 255 - 0.5) * preset.contrast + 0.5) * 255;

          // Saturation
          const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
          r = gray + (r - gray) * preset.saturation;
          g = gray + (g - gray) * preset.saturation;
          b = gray + (b - gray) * preset.saturation;

          // Clamp values
          data[i] = Math.max(0, Math.min(255, r));
          data[i + 1] = Math.max(0, Math.min(255, g));
          data[i + 2] = Math.max(0, Math.min(255, b));
        }

        ctx.putImageData(imageData, 0, 0);

        // Apply vignette
        if (preset.vignette > 0) {
          applyVignette(ctx, canvas.width, canvas.height, preset.vignette);
        }

        // Apply grain
        if (preset.grain > 0) {
          applyGrain(ctx, canvas.width, canvas.height, preset.grain);
        }

        // Apply blur (subtle)
        if (preset.blur > 0) {
          ctx.filter = `blur(${preset.blur}px)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
        }

        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.5);
  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function applyGrain(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }

  ctx.putImageData(imageData, 0, 0);
}
