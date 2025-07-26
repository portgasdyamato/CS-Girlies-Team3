import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/landing";
import MoodSelector from "@/pages/mood-selector";
import JournalEntry from "@/pages/journal-entry";
import Results from "@/pages/results";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";
import FloatingNavigation from "@/components/floating-navigation";
import { useState } from "react";

export interface AppState {
  selectedMood: string;
  selectedEmoji: string;
  journalEntry: string;
  generationResult: any;
}

function Router() {
  const [appState, setAppState] = useState<AppState>({
    selectedMood: "",
    selectedEmoji: "",
    journalEntry: "",
    generationResult: null,
  });

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="sparkle" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className="sparkle" style={{ top: '60%', left: '20%', animationDelay: '1s' }}></div>
        <div className="sparkle" style={{ top: '30%', left: '80%', animationDelay: '2s' }}></div>
        <div className="sparkle" style={{ top: '80%', left: '70%', animationDelay: '1.5s' }}></div>
        <div className="sparkle" style={{ top: '15%', left: '60%', animationDelay: '2.5s' }}></div>
      </div>

      <div className="relative z-10">
        <Switch>
          <Route path="/" component={() => <LandingPage />} />
          <Route path="/profile" component={() => <ProfilePage />} />
          <Route path="/mood-selector" component={() => 
            <MoodSelector 
              selectedMood={appState.selectedMood}
              selectedEmoji={appState.selectedEmoji}
              onMoodChange={(mood, emoji) => updateAppState({ selectedMood: mood, selectedEmoji: emoji })}
            />} 
          />
          <Route path="/journal" component={() => 
            <JournalEntry 
              selectedMood={appState.selectedMood}
              selectedEmoji={appState.selectedEmoji}
              journalEntry={appState.journalEntry}
              onJournalChange={(entry) => updateAppState({ journalEntry: entry })}
              onGenerate={(result) => updateAppState({ generationResult: result })}
            />} 
          />
          <Route path="/results" component={() => 
            <Results 
              generationResult={appState.generationResult}
              selectedMood={appState.selectedMood}
              onStartOver={() => updateAppState({ 
                selectedMood: "", 
                selectedEmoji: "", 
                journalEntry: "", 
                generationResult: null 
              })}
            />} 
          />
          <Route path="/sessions/:id" component={({ params }: { params: { id: string } }) => 
            <Results 
              generationResult={null}
              selectedMood=""
              onStartOver={() => updateAppState({ 
                selectedMood: "", 
                selectedEmoji: "", 
                journalEntry: "", 
                generationResult: null 
              })}
              sessionId={params.id}
            />} 
          />
          <Route component={NotFound} />
        </Switch>
        
        <FloatingNavigation />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
