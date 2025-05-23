
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string;
};

interface UpcomingTasksProps {
  tasks: Task[];
  onTaskComplete: (id: number, completed: boolean) => void;
}

export function UpcomingTasks({ tasks, onTaskComplete }: UpcomingTasksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between gap-2 rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) =>
                  onTaskComplete(task.id, checked as boolean)
                }
              />
              <div>
                <p
                  className={cn(
                    task.completed &&
                      "text-muted-foreground line-through decoration-1"
                  )}
                >
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Due: {task.dueDate}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                task.priority === "high"
                  ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                  : task.priority === "medium"
                  ? "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                  : "border-green-500 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
              )}
            >
              {task.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
