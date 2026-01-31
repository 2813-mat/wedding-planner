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

interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
}

interface TaskGroup {
  period: string;
  description: string;
  tasks: Task[];
}

const initialTaskGroups: TaskGroup[] = [
  {
    period: "12+ meses antes",
    description: "Planejamento inicial",
    tasks: [
      {
        id: 1,
        title: "Definir data do casamento",
        completed: true,
        category: "Planejamento",
      },
      {
        id: 2,
        title: "Definir orçamento total",
        completed: true,
        category: "Financeiro",
      },
      {
        id: 3,
        title: "Escolher local da cerimônia",
        completed: true,
        category: "Cerimônia",
      },
      {
        id: 4,
        title: "Escolher local da festa",
        completed: true,
        category: "Recepção",
      },
      {
        id: 5,
        title: "Fazer lista preliminar de convidados",
        completed: true,
        category: "Convidados",
      },
    ],
  },
  {
    period: "9-12 meses antes",
    description: "Contratação de fornecedores principais",
    tasks: [
      {
        id: 6,
        title: "Contratar buffet",
        completed: true,
        category: "Recepção",
      },
      {
        id: 7,
        title: "Contratar fotógrafo e videomaker",
        completed: true,
        category: "Fornecedores",
      },
      {
        id: 8,
        title: "Contratar banda/DJ",
        completed: true,
        category: "Fornecedores",
      },
      {
        id: 9,
        title: "Contratar decorador",
        completed: true,
        category: "Decoração",
      },
      {
        id: 10,
        title: "Reservar hotel para lua de mel",
        completed: false,
        category: "Lua de Mel",
      },
    ],
  },
  {
    period: "6-9 meses antes",
    description: "Detalhes da cerimônia",
    tasks: [
      {
        id: 11,
        title: "Escolher vestido da noiva",
        completed: true,
        category: "Vestuário",
      },
      {
        id: 12,
        title: "Escolher traje do noivo",
        completed: true,
        category: "Vestuário",
      },
      {
        id: 13,
        title: "Definir madrinhas e padrinhos",
        completed: true,
        category: "Cerimônia",
      },
      {
        id: 14,
        title: "Contratar cerimonialista",
        completed: false,
        category: "Cerimônia",
      },
      {
        id: 15,
        title: "Encomendar convites",
        completed: false,
        category: "Papelaria",
      },
    ],
  },
  {
    period: "3-6 meses antes",
    description: "Finalização de detalhes",
    tasks: [
      {
        id: 16,
        title: "Prova do vestido",
        completed: false,
        category: "Vestuário",
      },
      {
        id: 17,
        title: "Enviar convites",
        completed: false,
        category: "Convidados",
      },
      {
        id: 18,
        title: "Definir cardápio",
        completed: false,
        category: "Recepção",
      },
      {
        id: 19,
        title: "Escolher bolo",
        completed: false,
        category: "Recepção",
      },
      {
        id: 20,
        title: "Definir playlist",
        completed: false,
        category: "Entretenimento",
      },
    ],
  },
  {
    period: "1-3 meses antes",
    description: "Últimos preparativos",
    tasks: [
      {
        id: 21,
        title: "Confirmar presença dos convidados",
        completed: false,
        category: "Convidados",
      },
      {
        id: 22,
        title: "Ensaio fotográfico pré-wedding",
        completed: false,
        category: "Fotografia",
      },
      {
        id: 23,
        title: "Última prova do vestido",
        completed: false,
        category: "Vestuário",
      },
      {
        id: 24,
        title: "Confirmar todos os fornecedores",
        completed: false,
        category: "Fornecedores",
      },
      {
        id: 25,
        title: "Preparar votos",
        completed: false,
        category: "Cerimônia",
      },
    ],
  },
  {
    period: "Última semana",
    description: "Preparação final",
    tasks: [
      {
        id: 26,
        title: "Ensaio da cerimônia",
        completed: false,
        category: "Cerimônia",
      },
      {
        id: 27,
        title: "Confirmar horários com fornecedores",
        completed: false,
        category: "Fornecedores",
      },
      {
        id: 28,
        title: "Preparar malas para lua de mel",
        completed: false,
        category: "Lua de Mel",
      },
      { id: 29, title: "Spa day", completed: false, category: "Pessoal" },
      { id: 30, title: "Descansar!", completed: false, category: "Pessoal" },
    ],
  },
];

export default function ChecklistPage() {
  const [taskGroups, setTaskGroups] = useState(initialTaskGroups);
  const [openGroups, setOpenGroups] = useState<string[]>([
    "12+ meses antes",
    "9-12 meses antes",
  ]);

  const toggleTask = (groupPeriod: string, taskId: number) => {
    setTaskGroups((prev) =>
      prev.map((group) =>
        group.period === groupPeriod
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task,
              ),
            }
          : group,
      ),
    );
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
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-semibold">Checklist</h1>
        <p className="mt-1 text-muted-foreground">
          Acompanhe todas as tarefas do planejamento
        </p>
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
          const groupProgress = Math.round((groupCompleted / groupTotal) * 100);
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
                              toggleTask(group.period, task.id)
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

