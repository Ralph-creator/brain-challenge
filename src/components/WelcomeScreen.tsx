import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp } from "lucide-react";
import { LeaderboardDialog } from "./LeaderboardDialog";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  return (
    <>
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        <div className="flex justify-center">
          <div className="p-6 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-2xl animate-bounce-in">
            <Brain className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Brain Teaser Challenge
          </h1>
          <p className="text-xl text-muted-foreground">
            Test your logic, reasoning, and problem-solving skills!
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <div className="text-2xl font-bold text-primary">25+</div>
              <div className="text-muted-foreground">Puzzles</div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <div className="text-2xl font-bold text-accent">30s</div>
              <div className="text-muted-foreground">Per Level</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onStart}
              size="lg"
              className="w-full text-lg h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Challenge
            </Button>
            
            <Button
              onClick={() => setShowLeaderboard(true)}
              size="lg"
              variant="outline"
              className="w-full text-lg h-14 border-2 hover:bg-accent/10 hover:border-accent transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Leaderboard
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground pt-4">
          <p>🧠 Challenge your mind</p>
          <p>⏱️ Beat the clock</p>
          <p>🏆 Compete globally</p>
        </div>
      </div>

      <LeaderboardDialog
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </div>
    </>
  );
};
