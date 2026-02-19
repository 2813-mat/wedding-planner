import { Gift, ExternalLink, Check, Loader } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useGifts } from "../hooks/useGifts";
import { CreateGiftModal } from "../components/gifts/CreateGiftModal";

export default function GiftsPage() {
  const { data: gifts = [], isLoading, error } = useGifts();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          Erro ao carregar presentes. Verifique sua conexão com a API.
        </div>
      </div>
    );
  }

  if (!gifts) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum presente criado ainda.</p>
        </div>
      </div>
    );
  }

  const reservedCount = gifts.filter((g) => g.purchased).length;
  const availableCount = gifts.filter((g) => !g.purchased).length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            Lista de Presentes
          </h1>
          <p className="mt-1 text-muted-foreground">
            Escolha um presente especial para os noivos
          </p>
        </div>
        <CreateGiftModal />
      </header>

      <section
        className="mb-8 flex flex-wrap gap-4 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-semibold">{gifts.length}</p>
              <p className="text-xs text-muted-foreground">Total de itens</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-success/10 p-2">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-semibold">{reservedCount}</p>
              <p className="text-xs text-muted-foreground">Reservados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-accent p-2">
              <Gift className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xl font-semibold">{availableCount}</p>
              <p className="text-xs text-muted-foreground">Disponíveis</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section
        className="mb-6 flex flex-wrap gap-2 animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        <Button variant="default" size="sm" className="rounded-full">
          Todos
        </Button>
      </section>

      {/* Gift Grid */}
      <section
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        {gifts.map((gift) => (
          <Card
            key={gift.id}
            className={`group border-0 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              gift.purchased ? "opacity-75" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              {gift.url && (
                <img
                  src={gift.url}
                  alt={gift.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              {gift.purchased && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                  <Badge variant="secondary" className="text-sm">
                    <Check className="mr-1 h-4 w-4" />
                    Comprado
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-display text-lg font-medium line-clamp-1">
                {gift.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {gift.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">
                  R$ {gift.price.toFixed(2)}
                </span>
                {!gift.purchased && (
                  <Button size="sm" variant="outline" className="gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Ver
                  </Button>
                )}
              </div>

              {gift.purchased && gift.purchasedBy && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Comprado por: {gift.purchasedBy}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
