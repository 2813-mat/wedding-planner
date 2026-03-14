import { useState } from "react";
import { CheckSquare, ChevronDown, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Checkbox } from "../components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { useChecklist, useUpdateTask } from "../hooks/useChecklist";
import { CreateTaskModal } from "../components/checklist/CreateTaskModal";

export default function ChecklistPage() {
  const { data: taskGroups = [], isLoading } = useChecklist();
  const updateTask = useUpdateTask();

  const [openGroups, setOpenGroups] = useState<string[]>([
    "12+ meses antes",
    "9-12 meses antes",
  ]);

  const toggleTask = (taskId: string, currentCompleted: boolean) => {
    updateTask.mutate({ id: taskId, data: { completed: !currentCompleted } });
  };

  const toggleGroup = (period: string) => {
    setOpenGroups((prev) =>
      prev.includes(period)
        ? prev.filter((p) => p !== period)
        : [...prev, period],
    );
  };

  const totalTasks = taskGroups.reduce((sum, g) => sum + g.tasks.length, 0);
  const completedTasks = taskGroups.reduce(
    (sum, g) => sum + g.tasks.filter((t) => t.completed).length,
    0,
  );
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 animate-fade-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold">Checklist</h1>
              <p className="mt-1 text-muted-foreground">
                Acompanhe todas as tarefas do planejamento
              </p>
            </div>
            <CreateTaskModal />
          </div>
        </header>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold">Checklist</h1>
            <p className="mt-1 text-muted-foreground">
              Acompanhe todas as tarefas do planejamento
            </p>
          </div>
          <CreateTaskModal />
        </div>
      </header>

      {/* Progress Overview */}
      <Card
        className="mb-8 border-0 shadow-sm animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-medium">
                  Progresso Total
                </h2>
                <p className="text-sm text-muted-foreground">
                  {completedTasks} de {totalTasks} tarefas concluídas
                </p>
              </div>
            </div>
            <span className="text-2xl font-semibold text-primary">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Task Groups */}
      <div
        className="space-y-4 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        {taskGroups.map((group) => {
          const groupCompleted = group.tasks.filter((t) => t.completed).length;
          const groupTotal = group.tasks.length;
          const groupProgress =
            groupTotal > 0
              ? Math.round((groupCompleted / groupTotal) * 100)
              : 0;
          const isOpen = openGroups.includes(group.period);

          return (
            <Collapsible
              key={group.period}
              open={isOpen}
              onOpenChange={() => toggleGroup(group.period)}
            >
              <Card className="border-0 shadow-sm overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="font-display text-lg">
                            {group.period}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {group.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {groupCompleted}/{groupTotal}
                        </span>
                        <div className="mt-1 h-1.5 w-20 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${groupProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {group.tasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() =>
                              toggleTask(task.id, task.completed)
                            }
                          />
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`flex-1 cursor-pointer text-sm ${
                              task.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.title}
                          </label>
                          <span className="text-xs text-muted-foreground">
                            {task.category}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
