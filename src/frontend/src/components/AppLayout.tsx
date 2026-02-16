import { ReactNode } from 'react';
import TopNav from './TopNav';

type View = 'landing' | 'generate' | 'history';

interface AppLayoutProps {
  children: ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function AppLayout({ children, currentView, onNavigate }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav currentView={currentView} onNavigate={onNavigate} />
      <main className="w-full">{children}</main>
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p>
              Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'ko-tt1c'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-pink hover:text-neon-cyan transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs">© {new Date().getFullYear()} Ko T T1C. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
