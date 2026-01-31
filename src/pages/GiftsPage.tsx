import { Gift, ExternalLink, Check } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

interface GiftItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  link: string;
  reserved: boolean;
  reservedBy?: string;
}

const gifts: GiftItem[] = [
  {
    id: 1,
    name: "Jogo de Panelas Tramontina",
    description: "Conjunto com 10 peças em aço inox",
    category: "Cozinha",
    price: "R$ 899",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    link: "#",
    reserved: true,
    reservedBy: "Tia Maria",
  },
  {
    id: 2,
    name: "Jogo de Cama Queen",
    description: "Algodão egípcio 400 fios, branco",
    category: "Quarto",
    price: "R$ 650",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    link: "#",
    reserved: false,
  },
  {
    id: 3,
    name: "Aspirador de Pó Robot",
    description: "Automático com mapeamento inteligente",
    category: "Casa",
    price: "R$ 2.200",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    link: "#",
    reserved: true,
    reservedBy: "João e Paula",
  },
  {
    id: 4,
    name: "Liquidificador Vitamix",
    description: "Profissional, alta potência",
    category: "Cozinha",
    price: "R$ 3.500",
    image:
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop",
    link: "#",
    reserved: false,
  },
  {
    id: 5,
    name: "Conjunto de Toalhas",
    description: "8 peças, 100% algodão premium",
    category: "Banheiro",
    price: "R$ 450",
    image:
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&h=300&fit=crop",
    link: "#",
    reserved: false,
  },
  {
    id: 6,
    name: "Aparelho de Jantar",
    description: "42 peças em porcelana",
    category: "Cozinha",
    price: "R$ 1.200",
    image:
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=400&h=300&fit=crop",
    link: "#",
    reserved: true,
    reservedBy: "Família Santos",
  },
  {
    id: 7,
    name: 'Smart TV 55"',
    description: "4K HDR, sistema Android TV",
    category: "Sala",
    price: "R$ 3.200",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    link: "#",
    reserved: false,
  },
  {
    id: 8,
    name: "Cafeteira Expresso",
    description: "Automática com moedor integrado",
    category: "Cozinha",
    price: "R$ 1.800",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
    link: "#",
    reserved: false,
  },
];

const categories = ["Todos", "Cozinha", "Quarto", "Sala", "Banheiro", "Casa"];

export default function GiftsPage() {
  const reservedCount = gifts.filter((g) => g.reserved).length;
  const availableCount = gifts.filter((g) => !g.reserved).length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-semibold">
          Lista de Presentes
        </h1>
        <p className="mt-1 text-muted-foreground">
          Escolha um presente especial para os noivos
        </p>
      </header>

      {/* Stats */}
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

      {/* Category Filter */}
      <section
        className="mb-6 flex flex-wrap gap-2 animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "Todos" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
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
              gift.reserved ? "opacity-75" : ""
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={gift.image}
                alt={gift.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {gift.reserved && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                  <Badge variant="secondary" className="text-sm">
                    <Check className="mr-1 h-4 w-4" />
                    Reservado
                  </Badge>
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-xs">
                {gift.category}
              </span>
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
                  {gift.price}
                </span>
                {!gift.reserved && (
                  <Button size="sm" variant="outline" className="gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Ver
                  </Button>
                )}
              </div>

              {gift.reserved && gift.reservedBy && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Reservado por: {gift.reservedBy}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

