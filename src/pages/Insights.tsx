import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Lightbulb, TrendingUp, Clock } from "lucide-react";
import { getAnalytics, getAISuggestions } from "@/lib/store";

export default function Insights() {
  const [analytics, setAnalytics] = useState(getAnalytics());
  const [suggestions, setSuggestions] = useState(getAISuggestions());

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getAnalytics());
      setSuggestions(getAISuggestions());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tips = [
    { icon: Clock, title: "Time Blocking", text: "Allocate specific time blocks for deep work. Avoid multitasking." },
    { icon: TrendingUp, title: "2-Minute Rule", text: "If a task takes less than 2 minutes, do it immediately." },
    { icon: Lightbulb, title: "Eat the Frog", text: "Tackle your hardest task first thing in the morning." },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          AI Insights
        </h1>
        <p className="text-muted-foreground mt-1">Smart suggestions based on your activity</p>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 border-l-4 border-l-primary"
          >
            <p className="text-sm">{s}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-lg mb-4">📊 Weekly Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{analytics.totalTasks}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{analytics.completedTasks}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{analytics.productivityScore}%</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {analytics.bestHour !== null ? `${analytics.bestHour}:00` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Peak Hour</p>
          </div>
        </div>
      </motion.div>

      {/* Productivity Tips */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-4">💡 Productivity Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-5"
            >
              <tip.icon className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
              <p className="text-xs text-muted-foreground">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
