import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useBudgetCategories } from "../hooks/useBudget";
import { CreateBudgetCategoryModal } from "../components/budget/CreateBudgetCategoryModal";
import { EditBudgetSpentModal } from "../components/budget/EditBudgetSpentModal";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function BudgetPage() {
  const { data: categories = [], isLoading } = useBudgetCategories();

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalPlanned - totalSpent;
  const percentUsed =
    totalPlanned > 0 ? Math.round((totalSpent / totalPlanned) * 100) : 0;

  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.planned,
    color: cat.color,
  }));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 animate-fade-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold">Orçamento</h1>
              <p className="mt-1 text-muted-foreground">
                Controle financeiro do casamento
              </p>
            </div>
            <CreateBudgetCategoryModal />
          </div>
        </header>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold">Orçamento</h1>
            <p className="mt-1 text-muted-foreground">
              Controle financeiro do casamento
            </p>
          </div>
          <CreateBudgetCategoryModal />
        </div>
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
              <p className="text-xs text-muted-foreground">Gasto Total</p>
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
              <p className="text-xs text-muted-foreground">Pago</p>
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
              <p className="text-xs text-muted-foreground">A Pagar</p>
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
              <p className="text-xs text-muted-foreground">Percentual pago</p>
              <p className="text-xl font-semibold">{percentUsed}%</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {categories.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Nenhuma categoria de orçamento cadastrada.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
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
                {categories.map((category) => {
                  const percent =
                    category.planned > 0
                      ? Math.round((category.spent / category.planned) * 100)
                      : 0;
                  const isOverBudget = category.spent > category.planned;

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
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
                          <EditBudgetSpentModal category={category} />
                        </div>
                      </div>
                      <div className="relative">
                        <Progress
                          value={Math.min(percent, 100)}
                          className="h-2"
                        />
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
        </>
      )}
    </div>
  );
}
