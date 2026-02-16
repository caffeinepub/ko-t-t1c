import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import LandingIntro from './pages/LandingIntro';
import UploadAndGenerate from './pages/UploadAndGenerate';
import History from './pages/History';

const queryClient = new QueryClient();

type View = 'landing' | 'generate' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AppLayout currentView={currentView} onNavigate={setCurrentView}>
          {currentView === 'landing' && <LandingIntro onGetStarted={() => setCurrentView('generate')} />}
          {currentView === 'generate' && <UploadAndGenerate />}
          {currentView === 'history' && <History />}
        </AppLayout>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
