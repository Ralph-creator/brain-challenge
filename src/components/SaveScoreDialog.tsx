import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface SaveScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  totalLevels: number;
  percentage: number;
  onSaved: () => void;
}

const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name cannot be empty" })
  .max(50, { message: "Name must be less than 50 characters" })
  .refine((name) => name.length > 0, { message: "Name is required" });

export const SaveScoreDialog = ({
  open,
  onOpenChange,
  score,
  totalLevels,
  percentage,
  onSaved,
}: SaveScoreDialogProps) => {
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveScore = async () => {
    // Validate player name
    const validation = nameSchema.safeParse(playerName);
    
    if (!validation.success) {
      toast({
        title: "Invalid Name",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("leaderboard").insert({
      player_name: validation.data,
      score,
      total_levels: totalLevels,
      completion_percentage: percentage,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save your score. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Score Saved! 🎉",
      description: "Your score has been added to the global leaderboard!",
    });

    setPlayerName("");
    onSaved();
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && playerName.trim()) {
      handleSaveScore();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            Save Your Score
          </DialogTitle>
          <DialogDescription>
            Enter your name to save your score to the global leaderboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">{score}</div>
              <div className="text-sm text-muted-foreground">
                {percentage}% accuracy • {totalLevels} levels completed
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerName">Your Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={50}
              disabled={loading}
              className="h-12 text-lg"
            />
          </div>

          <Button
            onClick={handleSaveScore}
            disabled={!playerName.trim() || loading}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg h-12"
          >
            {loading ? "Saving..." : "Save to Leaderboard"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
