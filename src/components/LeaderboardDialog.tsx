import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Medal, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  completion_percentage: number;
  completed_at: string;
}

interface LeaderboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeaderboardDialog = ({ open, onOpenChange }: LeaderboardDialogProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchLeaderboard();
      
      // Set up realtime subscription for live updates
      const channel = supabase
        .channel('leaderboard-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'leaderboard'
          },
          () => {
            fetchLeaderboard();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [open]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .order('completed_at', { ascending: true })
      .limit(10);

    if (!error && data) {
      setEntries(data);
    }
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-accent" fill="currentColor" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-[#CD7F32]" />;
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-accent" />
            Global Leaderboard
          </DialogTitle>
          <DialogDescription>
            Top 10 brain teaser champions from around the world
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading leaderboard...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scores yet. Be the first to complete the challenge!
            </div>
          ) : (
            entries.map((entry, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                    isTopThree
                      ? "bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 shadow-md"
                      : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold text-lg">
                    {getRankIcon(rank) || <span className="text-muted-foreground">#{rank}</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg truncate">{entry.player_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.completed_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-2xl text-primary">{entry.score}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.completion_percentage}% accuracy
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {entries.length > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            Leaderboard updates in real-time
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
