import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw } from 'lucide-react';
import type { VariationItem } from '@/lib/variationState';

interface HiddenVariationsPanelProps {
  hiddenVariations: VariationItem[];
  onRestore: (id: string) => void;
  onRegenerate: (id: string) => void;
  isRegenerating: boolean;
}

export default function HiddenVariationsPanel({
  hiddenVariations,
  onRestore,
  onRegenerate,
  isRegenerating,
}: HiddenVariationsPanelProps) {
  if (hiddenVariations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No hidden variations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {hiddenVariations.map((variation) => (
        <Card key={variation.id} className="overflow-hidden border-muted-foreground/20 opacity-60">
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={variation.imageUrl}
                alt={`Hidden variation ${variation.id}`}
                className="h-full w-full object-cover grayscale"
              />
            </div>

            <div className="p-3 space-y-2 bg-card/50 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground truncate">{variation.presetName}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => onRestore(variation.id)}
                  disabled={isRegenerating}
                >
                  <Eye className="h-3 w-3" />
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 gap-2"
                  onClick={() => onRegenerate(variation.id)}
                  disabled={isRegenerating}
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
