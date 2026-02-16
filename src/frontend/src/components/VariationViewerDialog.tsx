import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { VariationItem } from '@/lib/variationState';

interface VariationViewerDialogProps {
  variation: VariationItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

export default function VariationViewerDialog({
  variation,
  open,
  onOpenChange,
  onDownload,
}: VariationViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{variation.presetName}</DialogTitle>
          <DialogDescription>Variation preview</DialogDescription>
        </DialogHeader>

        <div className="relative w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={variation.imageUrl}
            alt={variation.presetName}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>

        <DialogFooter>
          <Button onClick={onDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
