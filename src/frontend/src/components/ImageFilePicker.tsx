import { useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getImageMetadata } from '@/lib/imageMeta';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

interface ImageFilePickerProps {
  onImageSelect: (file: File, preview: string, metadata: { width: number; height: number; size: number }) => void;
  onRemove: () => void;
  selectedImage: {
    file: File;
    preview: string;
    metadata: { width: number; height: number; size: number };
  } | null;
}

export default function ImageFilePicker({ onImageSelect, onRemove, selectedImage }: ImageFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please select a JPG or PNG image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    try {
      const preview = URL.createObjectURL(file);
      const metadata = await getImageMetadata(file);

      onImageSelect(file, preview, metadata);
      toast.success('Image loaded successfully');
    } catch (error) {
      console.error('Error loading image:', error);
      toast.error('Failed to load image. Please try another file.');
    }
  };

  const handleRemove = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    onRemove();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-neon-pink/50 hover:bg-accent/5"
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-accent/10 p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Click to upload an image</p>
              <p className="text-sm text-muted-foreground">JPG or PNG, max 10MB</p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <Card className="overflow-hidden border-neon-pink/30">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={selectedImage.preview}
                alt="Selected"
                className="w-full h-auto max-h-96 object-contain bg-muted"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{selectedImage.file.name}</span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>
                  {selectedImage.metadata.width} × {selectedImage.metadata.height}
                </span>
                <span>{(selectedImage.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
