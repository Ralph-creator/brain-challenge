import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, RotateCcw, Award, TrendingUp } from "lucide-react";
import { SaveScoreDialog } from "./SaveScoreDialog";
import { LeaderboardDialog } from "./LeaderboardDialog";

interface VictoryScreenProps {
  score: number;
  totalLevels: number;
  onPlayAgain: () => void;
}

export const VictoryScreen = ({ score, totalLevels, onPlayAgain }: VictoryScreenProps) => {
  const [showSaveScore, setShowSaveScore] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  
  const maxScore = totalLevels * 10;
  const percentage = Math.round((score / maxScore) * 100);
  
  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎯";
    if (percentage >= 80) return "Excellent Work! 🌟";
    if (percentage >= 60) return "Great Job! 👏";
    if (percentage >= 40) return "Good Effort! 💪";
    return "Keep Practicing! 🧠";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        <div className="flex justify-center">
          <div className="relative">
            <div className="p-8 bg-gradient-to-br from-accent to-accent/80 rounded-full shadow-2xl animate-bounce-in">
              <Trophy className="w-20 h-20 text-accent-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 animate-pulse">
              <Star className="w-6 h-6" fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Congratulations!
          </h1>
          <p className="text-2xl font-semibold text-foreground">
            {getMessage()}
          </p>
          <p className="text-muted-foreground">
            You've completed all {totalLevels} brain teasers!
          </p>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-accent" />
                <span className="font-medium text-foreground">Final Score</span>
              </div>
              <span className="text-3xl font-bold text-accent">{score}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">Accuracy</span>
              </div>
              <span className="text-3xl font-bold text-primary">{percentage}%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-success" />
                <span className="font-medium text-foreground">Levels Completed</span>
              </div>
              <span className="text-3xl font-bold text-success">{totalLevels}</span>
            </div>
          </div>

          <div className="space-y-3">
            {!scoreSaved && (
              <Button
                onClick={() => setShowSaveScore(true)}
                size="lg"
                className="w-full text-lg h-14 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Award className="w-5 h-5 mr-2" />
                Save to Leaderboard
              </Button>
            )}
            
            <Button
              onClick={() => setShowLeaderboard(true)}
              size="lg"
              variant="outline"
              className="w-full text-lg h-14 border-2 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Global Leaderboard
            </Button>
            
            <Button
              onClick={onPlayAgain}
              size="lg"
              className="w-full text-lg h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>🎯 Challenge yourself again!</p>
          <p>🧠 Can you beat your score?</p>
          <p>🏆 Compete with players worldwide!</p>
        </div>
      </div>

      <SaveScoreDialog
        open={showSaveScore}
        onOpenChange={setShowSaveScore}
        score={score}
        totalLevels={totalLevels}
        percentage={percentage}
        onSaved={() => setScoreSaved(true)}
      />

      <LeaderboardDialog
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </div>
  );
};
