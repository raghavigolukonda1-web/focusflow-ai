import { useState, useEffect } from "react";
import { Plus, Trash2, Play, Square, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getTasks, addTask, updateTask, deleteTask, Task } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("General");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerStart, setTimerStart] = useState<number | null>(null);

  const refresh = () => setTasks(getTasks());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeTimer && timerStart) {
      interval = setInterval(() => refresh(), 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timerStart]);

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), status: "pending", priority, timeSpent: 0, category });
    setTitle("");
    refresh();
  };

  const handleComplete = (id: string) => {
    updateTask(id, { status: "completed", completedAt: new Date().toISOString() });
    if (activeTimer === id) {
      stopTimer(id);
    }
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    if (activeTimer === id) {
      setActiveTimer(null);
      setTimerStart(null);
    }
    refresh();
  };

  const startTimer = (id: string) => {
    if (activeTimer && timerStart) {
      const elapsed = Math.round((Date.now() - timerStart) / 60000);
      const t = tasks.find((t) => t.id === activeTimer);
      if (t) updateTask(activeTimer, { timeSpent: t.timeSpent + elapsed });
    }
    setActiveTimer(id);
    setTimerStart(Date.now());
  };

  const stopTimer = (id: string) => {
    if (timerStart) {
      const elapsed = Math.round((Date.now() - timerStart) / 60000);
      const t = tasks.find((t) => t.id === id);
      if (t) updateTask(id, { timeSpent: t.timeSpent + Math.max(1, elapsed) });
    }
    setActiveTimer(null);
    setTimerStart(null);
    refresh();
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "all" ? true : filter === "pending" ? t.status !== "completed" : t.status === "completed"
  );

  const priorityColors = {
    low: "bg-accent/20 text-accent",
    medium: "bg-warning/20 text-warning",
    high: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display">Task Manager</h1>
        <p className="text-muted-foreground mt-1">Manage and track your tasks</p>
      </div>

      {/* Add task form */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <Input
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 min-w-[200px] bg-secondary border-border"
        />
        <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
          <SelectTrigger className="w-[120px] bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-[140px] bg-secondary border-border"
        />
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-12">
              No tasks yet. Add one above!
            </motion.p>
          )}
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`glass-card p-4 flex items-center gap-4 ${
                task.status === "completed" ? "opacity-60" : ""
              }`}
            >
              <button
                onClick={() => task.status !== "completed" && handleComplete(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.status === "completed"
                    ? "border-accent bg-accent/20"
                    : "border-muted-foreground hover:border-primary"
                }`}
              >
                {task.status === "completed" && <Check className="w-3 h-3 text-accent" />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${task.status === "completed" ? "line-through" : ""}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-muted-foreground">{task.category}</span>
                  <span className="text-xs text-muted-foreground">
                    {task.timeSpent + (activeTimer === task.id && timerStart ? Math.round((Date.now() - timerStart) / 60000) : 0)}m
                  </span>
                </div>
              </div>

              {task.status !== "completed" && (
                <button
                  onClick={() => activeTimer === task.id ? stopTimer(task.id) : startTimer(task.id)}
                  className={`p-2 rounded-lg transition-all ${
                    activeTimer === task.id
                      ? "bg-destructive/20 text-destructive"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeTimer === task.id ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
