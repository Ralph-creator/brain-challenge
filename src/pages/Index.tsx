import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { GameBoard } from "@/components/GameBoard";
import { VictoryScreen } from "@/components/VictoryScreen";
import { puzzles } from "@/data/puzzles";
import { useToast } from "@/hooks/use-toast";

type GameState = "welcome" | "playing" | "victory";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const { toast } = useToast();

  const handleStart = () => {
    setGameState("playing");
    setCurrentLevel(0);
    setScore(0);
    setShowNextButton(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setShowNextButton(true);
      toast({
        title: "Correct! 🎉",
        description: "+10 points",
        duration: 2000,
      });
    } else {
      toast({
        title: "Try again!",
        description: "Keep thinking!",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleNextLevel = () => {
    if (currentLevel + 1 < puzzles.length) {
      setCurrentLevel((prev) => prev + 1);
      setShowNextButton(false);
    } else {
      setGameState("victory");
    }
  };

  const handlePlayAgain = () => {
    setGameState("welcome");
    setCurrentLevel(0);
    setScore(0);
    setShowNextButton(false);
  };

  return (
    <>
      {gameState === "welcome" && <WelcomeScreen onStart={handleStart} />}
      
      {gameState === "playing" && (
        <GameBoard
          puzzle={puzzles[currentLevel]}
          currentLevel={currentLevel + 1}
          totalLevels={puzzles.length}
          score={score}
          onAnswer={handleAnswer}
          onNextLevel={handleNextLevel}
          showNextButton={showNextButton}
        />
      )}
      
      {gameState === "victory" && (
        <VictoryScreen
          score={score}
          totalLevels={puzzles.length}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
};

export default Index;
