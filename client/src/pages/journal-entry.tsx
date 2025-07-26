import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Book, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GenerationResult } from "@/lib/types";

interface JournalEntryProps {
  selectedMood: string;
  selectedEmoji: string;
  journalEntry: string;
  onJournalChange: (entry: string) => void;
  onGenerate: (result: GenerationResult) => void;
}

export default function JournalEntry({ 
  selectedMood, 
  selectedEmoji, 
  journalEntry, 
  onJournalChange,
  onGenerate 
}: JournalEntryProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: { mood: string; moodEmoji: string; journalEntry: string }) => {
      const response = await apiRequest("POST", "/api/generate-aesthetic", data);
      return response.json();
    },
    onSuccess: (result: GenerationResult) => {
      onGenerate(result);
      setLocation("/results");
      toast({
        title: "✨ Your aesthetic is ready!",
        description: "AI has crafted your complete mood experience",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate your aesthetic. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Journal entry required",
        description: "Please write about your mood before generating your aesthetic.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      mood: selectedMood,
      moodEmoji: selectedEmoji,
      journalEntry: journalEntry.trim(),
    });
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <section className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-deep text-glow mb-4">
            Pour your heart out ✍️
          </h2>
          <p className="text-lg text-purple-deep">
            Write about your current mood and let AI create magic
          </p>
        </div>

        {/* Journal Interface */}
        <div className="glass-card rounded-3xl p-8 pulse-glow">
          {/* Journal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center">
                <Book className="w-6 h-6 text-pink-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-light">Your Mood Journal</h3>
                <p className="text-sm text-purple-light">
                  {selectedMood} {selectedEmoji}
                </p>
              </div>
            </div>
            <div className="text-sm text-purple-light">
              {today}
            </div>
          </div>

          {/* Journal Editor */}
          <div className="space-y-4">
            <Textarea 
              value={journalEntry}
              onChange={(e) => onJournalChange(e.target.value)}
              placeholder={`Today I'm feeling so ${selectedMood}... describe your emotions, your style goals, what's inspiring you right now...`}
              className="w-full h-64 p-6 rounded-2xl glass-card text-purple-light placeholder-purple-light bg-transparent border-2 border-lavender focus:border-pink-accent outline-none transition-all duration-300 resize-none leading-relaxed"
              maxLength={500}
            />
            
            {/* Character Counter & Mood Insights */}
            <div className="flex justify-between items-center text-sm">
              <div className="text-purple-light">
                {journalEntry.length} / 500 characters
              </div>
              {generateMutation.isPending && (
                <div className="flex items-center space-x-2 text-pink-accent">
                  <Wand2 className="w-4 h-4 animate-spin" />
                  <span>AI is analyzing your mood...</span>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={handleGenerate}
              disabled={!journalEntry.trim() || generateMutation.isPending}
              className="px-10 py-4 pink-gradient text-purple-deep font-semibold text-lg rounded-full hover-scale transition-all duration-300 shadow-xl border-0"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              {generateMutation.isPending ? "Generating Magic..." : "Generate My Aesthetic"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
