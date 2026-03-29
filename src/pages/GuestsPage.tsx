import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Loader,
  Trash2,
  Baby,
  PersonStanding,
  Settings2,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useGuests, useUpdateGuest, useDeleteGuest } from "../hooks/useGuests";
import { useWedding, useUpdateWedding } from "../hooks/useWedding";
import { CreateGuestModal } from "../components/guests/CreateGuestModal";
import { EditGuestModal } from "../components/guests/EditGuestModal";
import { GROUP_OPTIONS, CONFIRMED_OPTIONS } from "../constants/guestOptions";
import { toast } from "../components/ui/use-toast";

// null and 0 both mean "Pendente" — normalize for comparisons
function normalizeConfirmed(v: number | null): string {
  return v === null ? "0" : String(v);
}

export default function GuestsPage() {
  const { data: guests = [], isLoading, error } = useGuests();
  const { data: weddings = [] } = useWedding();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();
  const updateWedding = useUpdateWedding();

  const wedding = weddings[0] ?? null;
  const guestLimit = wedding?.guestLimit ?? null;

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [showExcedentes, setShowExcedentes] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
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

  // Excedentes: sort by createdAt, mark guests that push the running total over the limit
  const excedentesSet = new Set<string>();
  if (guestLimit !== null) {
    const sorted = [...guests].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    let running = 0;
    for (const g of sorted) {
      running += (g.adults ?? 0) + (g.children ?? 0);
      if (running > guestLimit) excedentesSet.add(g.id);
    }
  }

  const filteredGuests = guests.filter((guest) => {
    if (!guest.fullName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (categoryFilter !== "all" && guest.groupName !== categoryFilter) return false;
    if (statusFilter !== "all" && normalizeConfirmed(guest.confirmed) !== statusFilter) return false;
    if (ageFilter === "adults" && (guest.adults ?? 0) === 0) return false;
    if (ageFilter === "children" && (guest.children ?? 0) === 0) return false;
    if (showExcedentes && !excedentesSet.has(guest.id)) return false;
    return true;
  });

  const totalAdults = guests.reduce((sum, g) => sum + (g.adults ?? 0), 0);
  const totalChildren = guests.reduce((sum, g) => sum + (g.children ?? 0), 0);
  const totalPeople = totalAdults + totalChildren;

  const stats = {
    confirmed: guests.filter((g) => g.confirmed === 1).length,
    maybe: guests.filter((g) => g.confirmed === 2).length,
    pending: guests.filter((g) => g.confirmed === 0 || g.confirmed === null).length,
    declined: guests.filter((g) => g.confirmed === -1).length,
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteGuest.mutateAsync(Number(id));
      toast({ title: "Convidado removido", description: `${name} foi removido.` });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o convidado.",
      });
    }
  };

  const handleSaveLimit = async () => {
    if (!wedding) return;
    const val = parseInt(limitInput);
    if (!isNaN(val) && val > 0) {
      try {
        await updateWedding.mutateAsync({ id: wedding.id, data: { guestLimit: val } });
        setLimitDialogOpen(false);
        setLimitInput("");
      } catch {
        toast({ variant: "destructive", title: "Erro ao salvar limite" });
      }
    }
  };

  const handleRemoveLimit = async () => {
    if (!wedding) return;
    try {
      await updateWedding.mutateAsync({ id: wedding.id, data: { guestLimit: null } });
      setLimitDialogOpen(false);
      setLimitInput("");
    } catch {
      toast({ variant: "destructive", title: "Erro ao remover limite" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-4xl font-semibold">Lista de Convidados</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie todos os convidados do casamento
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setLimitInput(guestLimit ? String(guestLimit) : "")}
              >
                <Settings2 className="h-4 w-4" />
                {guestLimit ? `Limite: ${guestLimit}` : "Definir limite"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>Total de convidados</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Defina a capacidade máxima de pessoas para o evento.
              </p>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 110"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveLimit()}
              />
              <div className="flex justify-between gap-2 pt-1">
                {guestLimit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLimit}
                    disabled={updateWedding.isPending}
                    className="text-destructive"
                  >
                    Remover limite
                  </Button>
                )}
                <Button
                  size="sm"
                  className="ml-auto"
                  onClick={handleSaveLimit}
                  disabled={updateWedding.isPending}
                >
                  {updateWedding.isPending ? (
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <CreateGuestModal />
        </div>
      </header>

      {/* Stats — Row 1: Total, Adultos, Crianças */}
      <section
        className="mb-4 grid gap-4 sm:grid-cols-3 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {totalPeople}
                {guestLimit && (
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    / {guestLimit}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Total de pessoas
                {guestLimit && totalPeople > guestLimit && (
                  <span className="ml-1 font-medium text-destructive">
                    ({totalPeople - guestLimit} excedente{totalPeople - guestLimit > 1 ? "s" : ""})
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-500/10 p-2">
              <PersonStanding className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalAdults}</p>
              <p className="text-xs text-muted-foreground">Adultos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-purple-500/10 p-2">
              <Baby className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalChildren}</p>
              <p className="text-xs text-muted-foreground">Crianças</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats — Row 2: Status */}
      <section
        className="mb-8 grid gap-4 sm:grid-cols-4 animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
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
            <div className="rounded-full bg-secondary/50 p-2">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.maybe}</p>
              <p className="text-xs text-muted-foreground">Talvez</p>
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
        className="mb-6 flex flex-wrap gap-3 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar convidados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[170px]">
            <Filter className="mr-2 h-4 w-4 shrink-0" />
            <SelectValue placeholder="Grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os grupos</SelectItem>
            {GROUP_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {CONFIRMED_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ageFilter} onValueChange={setAgeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Adultos e crianças</SelectItem>
            <SelectItem value="adults">Somente adultos</SelectItem>
            <SelectItem value="children">Somente crianças</SelectItem>
          </SelectContent>
        </Select>

        {guestLimit !== null && excedentesSet.size > 0 && (
          <Button
            size="sm"
            variant={showExcedentes ? "destructive" : "outline"}
            onClick={() => setShowExcedentes(!showExcedentes)}
            className="gap-1.5"
          >
            {showExcedentes ? "Ver todos" : `Excedentes (${excedentesSet.size})`}
          </Button>
        )}
      </section>

      {/* Table */}
      <Card
        className="border-0 shadow-sm animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <CardContent className="p-0">
          {filteredGuests.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Nenhum convidado encontrado para os filtros selecionados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ad.</TableHead>
                  <TableHead className="text-center">Cr.</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((guest) => {
                  const isExcedente = excedentesSet.has(guest.id);
                  return (
                    <TableRow
                      key={guest.id}
                      className={isExcedente ? "bg-destructive/5" : undefined}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {guest.fullName}
                          {isExcedente && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              Excedente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {guest.email || "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {guest.phone || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {guest.groupName || "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={normalizeConfirmed(guest.confirmed)}
                          onValueChange={(val) =>
                            updateGuest.mutate({
                              id: Number(guest.id),
                              data: { confirmed: Number(val) },
                            })
                          }
                        >
                          <SelectTrigger className="h-7 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONFIRMED_OPTIONS.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                value={String(opt.value)}
                                className="text-xs"
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {guest.adults ?? 0}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {guest.children ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditGuestModal guest={guest} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(guest.id, guest.fullName)}
                            disabled={deleteGuest.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
