import { Store, Phone, Mail, Star, Check, Clock, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

type VendorStatus = "contratado" | "negociacao" | "orcamento";

interface Vendor {
  id: number;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  status: VendorStatus;
  rating: number;
  notes: string;
  price?: string;
}

const vendors: Vendor[] = [
  {
    id: 1,
    name: "Buffet Gourmet Delícias",
    category: "Buffet",
    contact: "Marcela Santos",
    email: "contato..gourmetdelicias.com.br",
    phone: "(11) 99999-1234",
    status: "contratado",
    rating: 5,
    notes: "Excelente atendimento, menu personalizado aprovado.",
    price: "R$ 42.000",
  },
  {
    id: 2,
    name: "Foto & Arte Studio",
    category: "Fotografia",
    contact: "Ricardo Almeida",
    email: "ricardo..fotoarte.com.br",
    phone: "(11) 98888-2345",
    status: "contratado",
    rating: 5,
    notes: "Portfólio incrível, já fez o ensaio pré-wedding.",
    price: "R$ 12.000",
  },
  {
    id: 3,
    name: "DJ Marcos Sound",
    category: "Música",
    contact: "Marcos Lima",
    email: "marcos..djsound.com.br",
    phone: "(11) 97777-3456",
    status: "contratado",
    rating: 4,
    notes: "Playlist personalizada em andamento.",
    price: "R$ 7.500",
  },
  {
    id: 4,
    name: "Flores & Decoração Maria",
    category: "Decoração",
    contact: "Maria Fernanda",
    email: "contato..floresmaria.com.br",
    phone: "(11) 96666-4567",
    status: "contratado",
    rating: 5,
    notes: "Proposta de decoração romântica aprovada.",
    price: "R$ 12.500",
  },
  {
    id: 5,
    name: "Doces da Vovó",
    category: "Doces",
    contact: "Ana Clara",
    email: "doces..vovo.com.br",
    phone: "(11) 95555-5678",
    status: "negociacao",
    rating: 4,
    notes: "Aguardando proposta final com quantidade de doces.",
  },
  {
    id: 6,
    name: "Cerimonial Elegance",
    category: "Cerimonial",
    contact: "Patrícia Rocha",
    email: "patricia..elegance.com.br",
    phone: "(11) 94444-6789",
    status: "negociacao",
    rating: 5,
    notes: "Segunda reunião agendada para próxima semana.",
  },
  {
    id: 7,
    name: "Convites Personalizados Art",
    category: "Papelaria",
    contact: "Juliana Costa",
    email: "juliana..artconvites.com.br",
    phone: "(11) 93333-7890",
    status: "orcamento",
    rating: 4,
    notes: "Aguardando modelos de convite para aprovação.",
  },
  {
    id: 8,
    name: "Transporte VIP Limousine",
    category: "Transporte",
    contact: "Roberto Silva",
    email: "contato..viplimo.com.br",
    phone: "(11) 92222-8901",
    status: "orcamento",
    rating: 3,
    notes: "Proposta recebida, avaliando outras opções.",
  },
];

const statusConfig: Record<
  VendorStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline";
    icon: typeof Check;
  }
> = {
  contratado: { label: "Contratado", variant: "default", icon: Check },
  negociacao: { label: "Em Negociação", variant: "secondary", icon: Clock },
  orcamento: { label: "Orçamento", variant: "outline", icon: FileText },
};

const categoryColors: Record<string, string> = {
  Buffet: "bg-primary/10 text-primary",
  Fotografia: "bg-success/10 text-success",
  Música: "bg-warning/10 text-warning",
  Decoração: "bg-accent text-accent-foreground",
  Doces: "bg-destructive/10 text-destructive",
  Cerimonial: "bg-primary/10 text-primary",
  Papelaria: "bg-muted text-muted-foreground",
  Transporte: "bg-secondary text-secondary-foreground",
};

export default function VendorsPage() {
  const contracted = vendors.filter((v) => v.status === "contratado").length;
  const negotiating = vendors.filter((v) => v.status === "negociacao").length;
  const quoted = vendors.filter((v) => v.status === "orcamento").length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-semibold">Fornecedores</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie todos os parceiros do casamento
        </p>
      </header>

      {/* Stats */}
      <section
        className="mb-8 grid gap-4 sm:grid-cols-3 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-success/10 p-2">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{contracted}</p>
              <p className="text-xs text-muted-foreground">Contratados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-warning/10 p-2">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{negotiating}</p>
              <p className="text-xs text-muted-foreground">Em Negociação</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-muted p-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{quoted}</p>
              <p className="text-xs text-muted-foreground">
                Aguardando Orçamento
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Vendor Grid */}
      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        {vendors.map((vendor) => {
          const StatusIcon = statusConfig[vendor.status].icon;

          return (
            <Card
              key={vendor.id}
              className="border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs ${categoryColors[vendor.category]}`}
                    >
                      {vendor.category}
                    </span>
                    <CardTitle className="mt-2 font-display text-lg">
                      {vendor.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={statusConfig[vendor.status].variant}
                    className="shrink-0"
                  >
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig[vendor.status].label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < vendor.rating ? "fill-gold text-gold" : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">{vendor.notes}</p>

                {vendor.price && (
                  <p className="text-lg font-semibold text-primary">
                    {vendor.price}
                  </p>
                )}

                <div className="space-y-1 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Store className="h-3 w-3" />
                    <span>{vendor.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

