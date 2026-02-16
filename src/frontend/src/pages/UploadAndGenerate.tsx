import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageFilePicker from '@/components/ImageFilePicker';
import VariationGrid from '@/components/VariationGrid';
import HiddenVariationsPanel from '@/components/HiddenVariationsPanel';
import { generateVariations } from '@/lib/onDeviceVariations';
import { addToHistory } from '@/lib/historyStorage';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { VariationItem } from '@/lib/variationState';

export default function UploadAndGenerate() {
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
    metadata: { width: number; height: number; size: number };
  } | null>(null);
  const [variationCount, setVariationCount] = useState<number>(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<VariationItem[]>([]);
  const [hiddenVariations, setHiddenVariations] = useState<VariationItem[]>([]);

  const handleImageSelect = (file: File, preview: string, metadata: { width: number; height: number; size: number }) => {
    setSelectedImage({ file, preview, metadata });
    setVariations([]);
    setHiddenVariations([]);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setVariations([]);
    setHiddenVariations([]);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    try {
      const generated = await generateVariations(selectedImage.preview, variationCount);
      setVariations(generated);

      // Save to history
      await addToHistory(selectedImage.preview, generated.map((v) => v.imageUrl));

      toast.success(`Generated ${generated.length} variations!`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate variations. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHideVariation = (id: string) => {
    const variation = variations.find((v) => v.id === id);
    if (variation) {
      setVariations((prev) => prev.filter((v) => v.id !== id));
      setHiddenVariations((prev) => [...prev, variation]);
      toast.info('Variation hidden');
    }
  };

  const handleRestoreVariation = (id: string) => {
    const variation = hiddenVariations.find((v) => v.id === id);
    if (variation) {
      setHiddenVariations((prev) => prev.filter((v) => v.id !== id));
      setVariations((prev) => [...prev, variation]);
      toast.success('Variation restored');
    }
  };

  const handleRegenerateVariation = async (id: string) => {
    if (!selectedImage) return;

    const variation = hiddenVariations.find((v) => v.id === id);
    if (!variation) return;

    setIsGenerating(true);
    try {
      // Generate a single replacement with a different preset
      const usedPresets = [...variations, ...hiddenVariations].map((v) => v.presetId);
      const newVariations = await generateVariations(selectedImage.preview, 1, usedPresets);

      if (newVariations.length > 0) {
        // Remove the hidden variation and add the new one to visible
        setHiddenVariations((prev) => prev.filter((v) => v.id !== id));
        setVariations((prev) => [...prev, newVariations[0]]);
        toast.success('New variation generated!');
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      toast.error('Failed to regenerate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Create Your Variations
          </h1>
          <p className="text-muted-foreground">
            Upload your photo and generate realistic variations with different styles and backgrounds
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-neon-pink/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
            <CardDescription>Select a JPG or PNG image (max 10MB)</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageFilePicker
              onImageSelect={handleImageSelect}
              onRemove={handleRemoveImage}
              selectedImage={selectedImage}
            />
          </CardContent>
        </Card>

        {/* Generation Controls */}
        {selectedImage && (
          <Card className="border-neon-purple/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
              <CardDescription>Configure how many variations to create</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="variation-count">Number of Variations: {variationCount}</Label>
                </div>
                <Slider
                  id="variation-count"
                  min={4}
                  max={12}
                  step={1}
                  value={[variationCount]}
                  onValueChange={(value) => setVariationCount(value[0])}
                  disabled={isGenerating}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage}
                size="lg"
                className="w-full gap-2 neon-glow"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Variations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {(variations.length > 0 || hiddenVariations.length > 0) && (
          <Tabs defaultValue="visible" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="visible">
                Variations ({variations.length})
              </TabsTrigger>
              <TabsTrigger value="hidden">
                Hidden ({hiddenVariations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visible" className="mt-6">
              {variations.length > 0 ? (
                <VariationGrid variations={variations} onHide={handleHideVariation} />
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">No visible variations. Check the Hidden tab.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="hidden" className="mt-6">
              <HiddenVariationsPanel
                hiddenVariations={hiddenVariations}
                onRestore={handleRestoreVariation}
                onRegenerate={handleRegenerateVariation}
                isRegenerating={isGenerating}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
