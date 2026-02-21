import {
  Users,
  CheckSquare,
  DollarSign,
  Store,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useGuests } from "../hooks/useGuests";
import { useVendors } from "../hooks/useVendors";

export default function DashboardPage() {
  const { data: guests = [], isLoading: guestsLoading } = useGuests();
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();

  const guestsTotal = guests.length;
  const guestsConfirmed = guests.filter((g: any) => g.confirmed === 1).length;

  const vendorsTotal = vendors.length;
  const vendorsContracted = vendors.filter(
    (v: any) => v.status === "contratado",
  ).length;

  const hasBudget = false;
  const nextTasks: Array<any> = [];
  const recentActivity: Array<any> = [];

  const stats = [
    {
      title: "Convidados",
      value: guestsLoading ? "..." : String(guestsTotal),
      subtitle: guestsLoading
        ? "Carregando..."
        : `${guestsConfirmed} confirmados`,
      icon: Users,
      progress: guestsTotal
        ? Math.round((guestsConfirmed / guestsTotal) * 100)
        : 0,
      color: "text-primary",
    },
    {
      title: "Tarefas",
      value: "-",
      subtitle: "",
      icon: CheckSquare,
      progress: 0,
      color: "text-muted-foreground",
    },
    {
      title: "Orçamento",
      value: "-",
      subtitle: "",
      icon: DollarSign,
      progress: 0,
      color: "text-muted-foreground",
    },
    {
      title: "Fornecedores",
      value: vendorsLoading ? "..." : String(vendorsTotal),
      subtitle: vendorsLoading
        ? "Carregando..."
        : `${vendorsContracted} contratados`,
      icon: Store,
      progress: vendorsTotal
        ? Math.round((vendorsContracted / vendorsTotal) * 100)
        : 0,
      color: "text-primary",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-semibold">Resumo</h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral do planejamento do casamento
        </p>
      </header>

      {/* Stats Grid */}
      <section
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="mb-2 text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
              <Progress value={stat.progress} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Next Tasks */}
        <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-xl">
                <Calendar className="h-5 w-5 text-primary" />
                Próximas Tarefas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sem tarefas criadas
                </p>
              ) : (
                <ul className="space-y-3">
                  {nextTasks.map((task, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            task.priority === "alta"
                              ? "bg-destructive"
                              : task.priority === "média"
                                ? "bg-warning"
                                : "bg-success"
                          }`}
                        />
                        <span className="text-sm">{task.task}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {task.date}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Recent Activity */}
        <section className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-xl">
                <TrendingUp className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sem atividade recente
                </p>
              ) : (
                <ul className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Overall Progress */}
      <section
        className="mt-8 animate-fade-up"
        style={{ animationDelay: "0.4s" }}
      >
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-medium">
                  Progresso Geral
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasBudget
                    ? "Você está no caminho certo!"
                    : "Sem dados de orçamento"}
                </p>
              </div>
              <div className="text-right">
                {hasBudget ? (
                  <>
                    <span className="text-3xl font-semibold text-primary">
                      65%
                    </span>
                    <p className="text-xs text-muted-foreground">completo</p>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
            {hasBudget && <Progress value={65} className="h-3" />}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
