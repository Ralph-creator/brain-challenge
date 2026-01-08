import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Puzzle } from "@/data/puzzles";

interface GameBoardProps {
  puzzle: Puzzle;
  currentLevel: number;
  totalLevels: number;
  score: number;
  onAnswer: (isCorrect: boolean) => void;
  onNextLevel: () => void;
  showNextButton: boolean;
}

export const GameBoard = ({
  puzzle,
  currentLevel,
  totalLevels,
  score,
  onAnswer,
  onNextLevel,
  showNextButton,
}: GameBoardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setShowExplanation(false);
  }, [puzzle]);

  useEffect(() => {
    if (isAnswered || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, timeLeft]);

  const handleTimeout = () => {
    setIsAnswered(true);
    onAnswer(false);
  };

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === puzzle.correctAnswer;
    onAnswer(isCorrect);
    
    if (isCorrect || puzzle.explanation) {
      setShowExplanation(true);
    }
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) {
      return "bg-card hover:bg-secondary border-2 border-border hover:border-primary transition-all duration-200 hover:scale-105";
    }

    if (index === puzzle.correctAnswer) {
      return "bg-success text-success-foreground border-2 border-success animate-pulse-success";
    }

    if (index === selectedAnswer && index !== puzzle.correctAnswer) {
      return "bg-destructive text-destructive-foreground border-2 border-destructive animate-shake";
    }

    return "bg-muted text-muted-foreground border-2 border-border opacity-50";
  };

  const progress = (currentLevel / totalLevels) * 100;
  const timeProgress = (timeLeft / 30) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Target className="w-4 h-4" />
              <span>Level</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {currentLevel}/{totalLevels}
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Trophy className="w-4 h-4" />
              <span>Score</span>
            </div>
            <div className="text-2xl font-bold text-accent">{score}</div>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="w-4 h-4" />
              <span>Time</span>
            </div>
            <div
              className={cn(
                "text-2xl font-bold transition-colors",
                timeLeft <= 5 ? "text-destructive animate-pulse" : "text-foreground"
              )}
            >
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between text-sm text-muted-foreground pt-2">
            <span>Time Remaining</span>
            <span>{timeLeft}s</span>
          </div>
          <Progress 
            value={timeProgress} 
            className={cn(
              "h-2",
              timeLeft <= 5 && "animate-pulse"
            )}
          />
        </div>

        {/* Question Card */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-relaxed">
            {puzzle.question}
          </h2>

          {/* Answer Options */}
          <div className="grid gap-4">
            {puzzle.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnswered}
                className={cn(
                  "h-auto py-4 px-6 text-left text-lg justify-start font-medium",
                  getButtonClass(index)
                )}
              >
                <span className="mr-3 font-bold">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && puzzle.explanation && (
            <div className="mt-6 p-4 bg-muted rounded-lg border border-border animate-fade-in">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Explanation:
              </p>
              <p className="text-foreground">{puzzle.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showNextButton && (
            <Button
              onClick={onNextLevel}
              size="lg"
              className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in"
            >
              Next Level →
            </Button>
          )}

          {/* Try Again Message */}
          {isAnswered && !showNextButton && selectedAnswer !== puzzle.correctAnswer && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-center animate-shake">
              <p className="text-destructive font-medium">
                {timeLeft === 0 ? "Time's up! Try again" : "Not quite right. Keep going!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
