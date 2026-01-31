import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface BudgetCategory {
  id: number;
  name: string;
  planned: number;
  spent: number;
  color: string;
}

const budgetCategories: BudgetCategory[] = [
  {
    id: 1,
    name: "Local e Buffet",
    planned: 45000,
    spent: 42000,
    color: "#8B7355",
  },
  { id: 2, name: "Decoração", planned: 15000, spent: 12500, color: "#A69076" },
  {
    id: 3,
    name: "Fotografia e Vídeo",
    planned: 12000,
    spent: 12000,
    color: "#C4B5A5",
  },
  { id: 4, name: "Vestuário", planned: 18000, spent: 15800, color: "#D4C5B5" },
  {
    id: 5,
    name: "Música e Entretenimento",
    planned: 8000,
    spent: 7500,
    color: "#9A8A7A",
  },
  {
    id: 6,
    name: "Convites e Papelaria",
    planned: 3000,
    spent: 2200,
    color: "#B5A595",
  },
  { id: 7, name: "Transporte", planned: 4000, spent: 0, color: "#C9BAA8" },
  { id: 8, name: "Lua de Mel", planned: 15000, spent: 8000, color: "#7A6A5A" },
];

const totalPlanned = budgetCategories.reduce(
  (sum, cat) => sum + cat.planned,
  0,
);
const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
const remaining = totalPlanned - totalSpent;
const percentUsed = Math.round((totalSpent / totalPlanned) * 100);

const chartData = budgetCategories.map((cat) => ({
  name: cat.name,
  value: cat.spent,
  color: cat.color,
}));

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function BudgetPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-semibold">Orçamento</h1>
        <p className="mt-1 text-muted-foreground">
          Controle financeiro do casamento
        </p>
      </header>

      {/* Summary Cards */}
      <section
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Orçamento Total</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totalPlanned)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-warning/10 p-2">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gasto</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-success/10 p-2">
              <PiggyBank className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Disponível</p>
              <p className="text-xl font-semibold">
                {formatCurrency(remaining)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-accent p-2">
              <TrendingDown className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Utilizado</p>
              <p className="text-xl font-semibold">{percentUsed}%</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <Card
          className="border-0 shadow-sm animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Distribuição dos Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {chartData.slice(0, 6).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categories Breakdown */}
        <Card
          className="border-0 shadow-sm animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Detalhamento por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetCategories.map((category) => {
              const percent = Math.round(
                (category.spent / category.planned) * 100,
              );
              const isOverBudget = category.spent > category.planned;

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span
                      className={
                        isOverBudget
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }
                    >
                      {formatCurrency(category.spent)} /{" "}
                      {formatCurrency(category.planned)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={Math.min(percent, 100)} className="h-2" />
                    {isOverBudget && (
                      <div className="absolute right-0 -top-1 text-xs text-destructive">
                        +{formatCurrency(category.spent - category.planned)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card
        className="mt-6 border-0 bg-gradient-to-br from-primary/5 to-accent shadow-sm animate-fade-up"
        style={{ animationDelay: "0.4s" }}
      >
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-medium">
                Progresso do Orçamento
              </h3>
              <p className="text-sm text-muted-foreground">
                {remaining > 0
                  ? "Você ainda tem margem!"
                  : "Atenção ao orçamento!"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-semibold text-primary">
                {percentUsed}%
              </span>
              <p className="text-xs text-muted-foreground">utilizado</p>
            </div>
          </div>
          <Progress value={percentUsed} className="h-3" />
        </CardContent>
      </Card>
    </div>
  );
}

