import { useState } from "react";
import { Users, Search, Filter, UserCheck, UserX, Clock, Loader } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useGuests } from "../hooks/useGuests";

type GuestStatus = "confirmado" | "pendente" | "nao_vai";
type GuestCategory = "familia_noiva" | "familia_noivo" | "amigos" | "trabalho";

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: GuestCategory;
  status: GuestStatus;
  guests: number;
}

const categoryLabels: Record<GuestCategory, string> = {
  familia_noiva: "Família da Noiva",
  familia_noivo: "Família do Noivo",
  amigos: "Amigos",
  trabalho: "Trabalho",
};

const statusConfig: Record<
  GuestStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  confirmado: { label: "Confirmado", variant: "default" },
  pendente: { label: "Pendente", variant: "secondary" },
  nao_vai: { label: "Não vai", variant: "destructive" },
};

export default function GuestsPage() {
  const { data: guests = [], isLoading, error } = useGuests();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
          Erro ao carregar convidados. Verifique sua conexão com a API.
        </div>
      </div>
    );
  }

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || guest.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || guest.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: guests.length,
    confirmed: guests.filter((g) => g.status === "confirmado").length,
    pending: guests.filter((g) => g.status === "pendente").length,
    declined: guests.filter((g) => g.status === "nao_vai").length,
    totalGuests: guests.reduce((sum, g) => sum + g.guests, 0),
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-semibold">
          Lista de Convidados
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie todos os convidados do casamento
        </p>
      </header>

      {/* Stats */}
      <section
        className="mb-8 grid gap-4 sm:grid-cols-4 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.totalGuests}</p>
              <p className="text-xs text-muted-foreground">Total de pessoas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-success/10 p-2">
              <UserCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.confirmed}</p>
              <p className="text-xs text-muted-foreground">Confirmados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-warning/10 p-2">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-destructive/10 p-2">
              <UserX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.declined}</p>
              <p className="text-xs text-muted-foreground">Não vão</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Filters */}
      <section
        className="mb-6 flex flex-col gap-4 sm:flex-row animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar convidados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            <SelectItem value="familia_noiva">Família da Noiva</SelectItem>
            <SelectItem value="familia_noivo">Família do Noivo</SelectItem>
            <SelectItem value="amigos">Amigos</SelectItem>
            <SelectItem value="trabalho">Trabalho</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="nao_vai">Não vai</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* Table */}
      <Card
        className="border-0 shadow-sm animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Pessoas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {guest.email}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {guest.phone}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {categoryLabels[guest.category]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[guest.status].variant}>
                      {statusConfig[guest.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{guest.guests}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

