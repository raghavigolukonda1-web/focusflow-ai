export interface Task {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  timeSpent: number; // minutes
  createdAt: string;
  completedAt?: string;
  category: string;
}

const TASKS_KEY = "productivity_tasks";

export function getTasks(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>) {
  const tasks = getTasks().map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  saveTasks(tasks);
}

export function deleteTask(id: string) {
  saveTasks(getTasks().filter((t) => t.id !== id));
}

export function getAnalytics() {
  const tasks = getTasks();
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(
    (t) => new Date(t.createdAt).toDateString() === today
  );
  const completedToday = todayTasks.filter((t) => t.status === "completed");
  const totalTimeToday = todayTasks.reduce((s, t) => s + t.timeSpent, 0);

  // Weekly data
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const weekTasks = tasks.filter((t) => new Date(t.createdAt) >= weekAgo);

  const dailyData: { day: string; completed: number; total: number; time: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const ds = d.toDateString();
    const dayLabel = d.toLocaleDateString("en", { weekday: "short" });
    const dayTasks = weekTasks.filter(
      (t) => new Date(t.createdAt).toDateString() === ds
    );
    dailyData.push({
      day: dayLabel,
      completed: dayTasks.filter((t) => t.status === "completed").length,
      total: dayTasks.length,
      time: dayTasks.reduce((s, t) => s + t.timeSpent, 0),
    });
  }

  // Most productive hour
  const hourCounts: Record<number, number> = {};
  tasks
    .filter((t) => t.status === "completed" && t.completedAt)
    .forEach((t) => {
      const h = new Date(t.completedAt!).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
  const bestHour = Object.entries(hourCounts).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  )[0];

  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
    completedToday: completedToday.length,
    totalTimeToday,
    dailyData,
    productivityScore: tasks.length > 0
      ? Math.round(
          (tasks.filter((t) => t.status === "completed").length / tasks.length) * 100
        )
      : 0,
    bestHour: bestHour ? Number(bestHour[0]) : null,
  };
}

export function getAISuggestions(): string[] {
  const analytics = getAnalytics();
  const suggestions: string[] = [];

  if (analytics.completedToday < 3) {
    suggestions.push(
      "📋 You've completed fewer than 3 tasks today. Try focusing on smaller, actionable tasks to build momentum."
    );
  }
  if (analytics.bestHour !== null) {
    const period =
      analytics.bestHour < 12 ? "morning" : analytics.bestHour < 17 ? "afternoon" : "evening";
    suggestions.push(
      `⏰ You're most productive in the ${period} (around ${analytics.bestHour}:00). Schedule important tasks then.`
    );
  }
  if (analytics.totalTimeToday < 60 && analytics.totalTasks > 0) {
    suggestions.push(
      "⚡ You've logged less than an hour of work today. Consider using the Pomodoro technique to stay focused."
    );
  }
  if (analytics.pendingTasks > 5) {
    suggestions.push(
      "🎯 You have many pending tasks. Prioritize the top 3 and defer the rest to avoid overwhelm."
    );
  }
  if (analytics.productivityScore >= 80) {
    suggestions.push(
      "🔥 Great productivity score! Keep this momentum going."
    );
  }
  if (suggestions.length === 0) {
    suggestions.push(
      "✅ Start adding tasks to get personalized AI productivity insights!"
    );
  }
  return suggestions;
}
