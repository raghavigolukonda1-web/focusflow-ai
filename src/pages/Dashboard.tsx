import { useState, useEffect } from "react";
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { getAnalytics, getAISuggestions } from "@/lib/store";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(getAnalytics());
  const [suggestions, setSuggestions] = useState(getAISuggestions());

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getAnalytics());
      setSuggestions(getAISuggestions());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your productivity at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={analytics.totalTasks} icon={ListTodo} />
        <StatCard title="Completed" value={analytics.completedTasks} icon={CheckCircle2} color="accent" />
        <StatCard title="Today's Time" value={`${analytics.totalTimeToday}m`} icon={Clock} color="warning" />
        <StatCard
          title="Score"
          value={`${analytics.productivityScore}%`}
          subtitle="Completion rate"
          icon={TrendingUp}
          color={analytics.productivityScore >= 70 ? "accent" : "destructive"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Tasks This Week</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 22%)" />
              <XAxis dataKey="day" stroke="hsl(220 10% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 10% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220 14% 14%)",
                  border: "1px solid hsl(220 14% 22%)",
                  borderRadius: "0.75rem",
                  color: "hsl(220 10% 92%)",
                }}
              />
              <Bar dataKey="completed" fill="hsl(142 71% 45%)" radius={[6, 6, 0, 0]} name="Completed" />
              <Bar dataKey="total" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Time Spent (min)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={analytics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 22%)" />
              <XAxis dataKey="day" stroke="hsl(220 10% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 10% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220 14% 14%)",
                  border: "1px solid hsl(220 14% 22%)",
                  borderRadius: "0.75rem",
                  color: "hsl(220 10% 92%)",
                }}
              />
              <Line type="monotone" dataKey="time" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ fill: "hsl(38 92% 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-l-4 border-l-primary">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          🤖 AI Suggestions
        </h3>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="text-sm text-muted-foreground">{s}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
