import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageFilePicker from '@/components/ImageFilePicker';
import VariationGrid from '@/components/VariationGrid';
import HiddenVariationsPanel from '@/components/HiddenVariationsPanel';
import { generateFusionVariations } from '@/lib/onDeviceVariations';
import { addToHistory } from '@/lib/historyStorage';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { VariationItem } from '@/lib/variationState';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UploadAndGenerate() {
  const [photoA, setPhotoA] = useState<{
    file: File;
    preview: string;
    metadata: { width: number; height: number; size: number };
  } | null>(null);
  const [photoB, setPhotoB] = useState<{
    file: File;
    preview: string;
    metadata: { width: number; height: number; size: number };
  } | null>(null);
  const [variationCount, setVariationCount] = useState<number>(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<VariationItem[]>([]);
  const [hiddenVariations, setHiddenVariations] = useState<VariationItem[]>([]);

  const handlePhotoASelect = (file: File, preview: string, metadata: { width: number; height: number; size: number }) => {
    setPhotoA({ file, preview, metadata });
    setVariations([]);
    setHiddenVariations([]);
  };

  const handlePhotoBSelect = (file: File, preview: string, metadata: { width: number; height: number; size: number }) => {
    setPhotoB({ file, preview, metadata });
    setVariations([]);
    setHiddenVariations([]);
  };

  const handleRemovePhotoA = () => {
    setPhotoA(null);
    setVariations([]);
    setHiddenVariations([]);
  };

  const handleRemovePhotoB = () => {
    setPhotoB(null);
    setVariations([]);
    setHiddenVariations([]);
  };

  const handleGenerate = async () => {
    if (!photoA || !photoB) return;

    setIsGenerating(true);
    try {
      const generated = await generateFusionVariations(photoA.preview, photoB.preview, variationCount);
      setVariations(generated);

      // Save to history
      await addToHistory(photoA.preview, photoB.preview, generated.map((v) => v.imageUrl));

      toast.success(`Generated ${generated.length} fusion outputs!`);
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate fusion outputs. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHideVariation = (id: string) => {
    const variation = variations.find((v) => v.id === id);
    if (variation) {
      setVariations((prev) => prev.filter((v) => v.id !== id));
      setHiddenVariations((prev) => [...prev, variation]);
      toast.info('Fusion output hidden');
    }
  };

  const handleRestoreVariation = (id: string) => {
    const variation = hiddenVariations.find((v) => v.id === id);
    if (variation) {
      setHiddenVariations((prev) => prev.filter((v) => v.id !== id));
      setVariations((prev) => [...prev, variation]);
      toast.success('Fusion output restored');
    }
  };

  const handleRegenerateVariation = async (id: string) => {
    if (!photoA || !photoB) return;

    const variation = hiddenVariations.find((v) => v.id === id);
    if (!variation) return;

    setIsGenerating(true);
    try {
      // Generate a single replacement with a different seed
      const usedSeeds = [...variations, ...hiddenVariations].map((v) => v.presetId);
      const newVariations = await generateFusionVariations(photoA.preview, photoB.preview, 1, usedSeeds);

      if (newVariations.length > 0) {
        // Remove the hidden variation and add the new one to visible
        setHiddenVariations((prev) => prev.filter((v) => v.id !== id));
        setVariations((prev) => [...prev, newVariations[0]]);
        toast.success('New fusion output generated!');
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to regenerate. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = photoA && photoB && !isGenerating;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Photo Fusion Studio
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Combine two photos into one new image. Each fusion merges visual elements from both Photo A and Photo B to create unique artistic composites.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-neon-pink/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Photo A</CardTitle>
              <CardDescription>First source image for fusion (JPG or PNG, max 10MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageFilePicker
                onImageSelect={handlePhotoASelect}
                onRemove={handleRemovePhotoA}
                selectedImage={photoA}
                label="Photo A"
              />
            </CardContent>
          </Card>

          <Card className="border-neon-cyan/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Photo B</CardTitle>
              <CardDescription>Second source image for fusion (JPG or PNG, max 10MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageFilePicker
                onImageSelect={handlePhotoBSelect}
                onRemove={handleRemovePhotoB}
                selectedImage={photoB}
                label="Photo B"
              />
            </CardContent>
          </Card>
        </div>

        {/* Generation Controls */}
        {(photoA || photoB) && (
          <Card className="border-neon-purple/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Fusion Settings</CardTitle>
              <CardDescription>
                Each fusion output combines regions from both photos using different blending techniques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="variation-count">Number of Fusion Outputs: {variationCount}</Label>
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

              {!canGenerate && !isGenerating && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {!photoA && !photoB
                      ? 'Please upload both Photo A and Photo B to begin fusion generation'
                      : !photoA
                      ? 'Please upload Photo A to complete the pair'
                      : 'Please upload Photo B to complete the pair'}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                size="lg"
                className="w-full gap-2 neon-glow"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Fusing Photos...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Fuse Photos Together
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
                Fusion Outputs ({variations.length})
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
                    <p className="text-muted-foreground">No visible fusion outputs. Check the Hidden tab.</p>
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
