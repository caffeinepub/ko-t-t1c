import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Eye, EyeOff, MoreVertical } from 'lucide-react';
import VariationViewerDialog from './VariationViewerDialog';
import type { VariationItem } from '@/lib/variationState';

interface VariationGridProps {
  variations: VariationItem[];
  onHide: (id: string) => void;
}

export default function VariationGrid({ variations, onHide }: VariationGridProps) {
  const [selectedVariation, setSelectedVariation] = useState<VariationItem | null>(null);

  const handleDownload = (variation: VariationItem) => {
    const link = document.createElement('a');
    link.href = variation.imageUrl;
    link.download = `ko-tt1c-fusion-${variation.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {variations.map((variation) => (
          <Card
            key={variation.id}
            className="group overflow-hidden border-neon-purple/20 transition-all hover:border-neon-pink/50 hover:shadow-lg hover:shadow-neon-pink/10"
          >
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={variation.imageUrl}
                  alt={`Fusion output ${variation.id}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Action Buttons */}
                <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                    onClick={() => setSelectedVariation(variation)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                    onClick={() => handleDownload(variation)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onHide(variation.id)}>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Output
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Recipe Label */}
              <div className="p-3 bg-card/50 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground truncate">{variation.presetName}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVariation && (
        <VariationViewerDialog
          variation={selectedVariation}
          open={!!selectedVariation}
          onOpenChange={(open) => !open && setSelectedVariation(null)}
          onDownload={() => handleDownload(selectedVariation)}
        />
      )}
    </>
  );
}
