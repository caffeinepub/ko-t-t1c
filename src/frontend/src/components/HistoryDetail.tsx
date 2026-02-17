import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';
import type { HistoryEntry } from '@/lib/historyStorage';

interface HistoryDetailProps {
  entry: HistoryEntry;
}

export default function HistoryDetail({ entry }: HistoryDetailProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const isFusion = !!(entry.photoA && entry.photoB);

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="border-neon-pink/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDate(entry.timestamp)}</span>
          </div>
          <CardTitle>Submission Details</CardTitle>
          <CardDescription>
            {isFusion
              ? `${entry.variations.length} fusion outputs generated`
              : `${entry.variations.length} variations generated`}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Images */}
      {isFusion ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neon-cyan">Input Photos</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neon-pink">Photo A</h3>
              <Card className="overflow-hidden border-neon-purple/20">
                <CardContent className="p-0">
                  <img
                    src={entry.photoA}
                    alt="Photo A"
                    className="w-full h-auto max-h-[400px] object-contain bg-muted"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neon-cyan">Photo B</h3>
              <Card className="overflow-hidden border-neon-purple/20">
                <CardContent className="p-0">
                  <img
                    src={entry.photoB}
                    alt="Photo B"
                    className="w-full h-auto max-h-[400px] object-contain bg-muted"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neon-cyan">Original Image</h2>
          <Card className="overflow-hidden border-neon-purple/20">
            <CardContent className="p-0">
              <img
                src={entry.originalImage}
                alt="Original"
                className="w-full h-auto max-h-[600px] object-contain bg-muted"
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Separator className="bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent" />

      {/* Outputs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neon-cyan">
          {isFusion ? 'Generated Fusion Outputs' : 'Generated Variations'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entry.variations.map((variationUrl, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-neon-purple/20 transition-all hover:border-neon-pink/50 hover:shadow-lg hover:shadow-neon-pink/10"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={variationUrl}
                    alt={`${isFusion ? 'Fusion output' : 'Variation'} ${index + 1}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-3 bg-card/50 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground">
                    {isFusion ? `Fusion Output ${index + 1}` : `Variation ${index + 1}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
