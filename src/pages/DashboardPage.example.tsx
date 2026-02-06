// Exemplo de como integrar DashboardPage com dados da API
// Descomente e use quando quiser integrar

import {
  Users,
  CheckSquare,
  DollarSign,
  Store,
  TrendingUp,
  Calendar,
  Loader,
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

const nextTasks = [
  { task: "Confirmar menu com buffet", date: "15 Fev", priority: "alta" },
  { task: "Prova do vestido", date: "20 Fev", priority: "alta" },
  { task: "Reunião com fotógrafo", date: "22 Fev", priority: "média" },
  { task: "Escolher convites", date: "28 Fev", priority: "média" },
  { task: "Degustação de bolos", date: "05 Mar", priority: "baixa" },
];

const recentActivity = [
  { action: "Buffet Gourmet confirmado", time: "Hoje, 14:30" },
  { action: "3 novos convidados confirmados", time: "Ontem" },
  { action: "Pagamento da decoração realizado", time: "2 dias atrás" },
  { action: "Contrato do DJ assinado", time: "3 dias atrás" },
];

// EXEMPLO: Integração com API
export function DashboardPageWithAPI() {
  const { data: guests = [], isLoading: guestsLoading } = useGuests();
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();

  if (guestsLoading || vendorsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Calcular estatísticas a partir dos dados da API
  const confirmedGuests = guests.filter(
    (g) => g.status === "confirmado",
  ).length;
  const totalGuests = guests.reduce((sum, g) => sum + g.guests, 0);
  const guestProgress =
    guests.length > 0 ? Math.round((confirmedGuests / guests.length) * 100) : 0;

  const contractedVendors = vendors.filter((v) => v.status === "ativo").length;
  const vendorProgress =
    vendors.length > 0
      ? Math.round((contractedVendors / vendors.length) * 100)
      : 0;

  const stats = [
    {
      title: "Convidados",
      value: totalGuests.toString(),
      subtitle: `${confirmedGuests} confirmados`,
      icon: Users,
      progress: guestProgress,
      color: "text-primary",
    },
    {
      title: "Tarefas",
      value: "28/45",
      subtitle: "62% concluído",
      icon: CheckSquare,
      progress: 62,
      color: "text-success",
    },
    {
      title: "Orçamento",
      value: "R$ 85.400",
      subtitle: "de R$ 120.000",
      icon: DollarSign,
      progress: 71,
      color: "text-warning",
    },
    {
      title: "Fornecedores",
      value: vendors.length.toString(),
      subtitle: `${contractedVendors} contratados`,
      icon: Store,
      progress: vendorProgress,
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
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <Progress value={stat.progress} className="mt-4 h-2" />
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Rest of the dashboard... */}
    </div>
  );
}
