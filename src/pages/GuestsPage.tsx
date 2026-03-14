import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Loader,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
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
import { useGuests, useUpdateGuest } from "../hooks/useGuests";
import { CreateGuestModal } from "../components/guests/CreateGuestModal";

export default function GuestsPage() {
  const { data: guests = [], isLoading, error } = useGuests();
  const updateGuest = useUpdateGuest();
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
    const matchesSearch = guest.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || guest.groupName === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "confirmado" && guest.confirmed === 1) ||
      (statusFilter === "pendente" && guest.confirmed === 0) ||
      (statusFilter === "nao_vai" && guest.confirmed === -1);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: guests.length,
    confirmed: guests.filter((g) => g.confirmed === 1).length,
    pending: guests.filter((g) => g.confirmed === 0).length,
    declined: guests.filter((g) => g.confirmed === -1).length,
    totalGuests: guests.reduce(
      (sum, g) => sum + (g.adults ?? 0) + (g.children ?? 0),
      0,
    ),
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            Lista de Convidados
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie todos os convidados do casamento
          </p>
        </div>

        <CreateGuestModal />
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
                  <TableCell className="font-medium">
                    {guest.fullName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {guest.email}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {guest.phone}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {guest.groupName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={String(guest.confirmed)}
                      onValueChange={(val) =>
                        updateGuest.mutate({
                          id: Number(guest.id),
                          data: { confirmed: Number(val) },
                        })
                      }
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Confirmado</SelectItem>
                        <SelectItem value="0">Pendente</SelectItem>
                        <SelectItem value="-1">Não vai</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {guest.adults + guest.children}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
