import { Flame, Upload, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

type View = 'landing' | 'generate' | 'history';

interface TopNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function TopNav({ currentView, onNavigate }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-xl font-bold tracking-tight transition-colors hover:text-neon-pink"
        >
          <Flame className="h-6 w-6 text-neon-pink" />
          <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Ko T T1C
          </span>
        </button>

        <nav className="flex items-center gap-2">
          <Button
            variant={currentView === 'generate' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('generate')}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Generate</span>
          </Button>
          <Button
            variant={currentView === 'history' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('history')}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
