import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart,
  Loader,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { weddingService, type Wedding } from "../services/weddingService";
import { toast } from "sonner";

// ─── schema do formulário de criação ────────────────────────────────────────

const schema = z.object({
  title: z.string().min(2, "Título deve ter ao menos 2 caracteres"),
  weddingDate: z.string().min(1, "Data do casamento é obrigatória"),
  location: z.string().optional(),
  budgetTotal: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val.replace(",", ".")) : 0)),
  coupleName1: z.string().optional(),
  coupleName2: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const [year, month, day] = iso.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── componente ──────────────────────────────────────────────────────────────

export default function CreateWeddingPage() {
  const navigate = useNavigate();

  // ── aba de criação ──
  const [isCreating, setIsCreating] = useState(false);

  // ── aba de vínculo ──
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // carrega a lista de casamentos quando a aba de vínculo é montada
  const loadWeddings = async () => {
    setLoadingList(true);
    try {
      const data = await weddingService.getAll();
      setWeddings(data);
    } catch {
      toast.error("Não foi possível carregar a lista de casamentos.");
    } finally {
      setLoadingList(false);
    }
  };

  // ── criar novo casamento ──────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setIsCreating(true);
    try {
      await weddingService.create({
        title: data.title,
        weddingDate: data.weddingDate,
        location: data.location,
        budgetTotal: data.budgetTotal as number,
        coupleName1: data.coupleName1,
        coupleName2: data.coupleName2,
      });
      toast.success("Casamento criado com sucesso!");
      navigate("/home", { replace: true });
    } catch {
      toast.error("Não foi possível criar o casamento. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  // ── entrar em casamento existente ─────────────────────────────────────────
  const handleJoin = async () => {
    if (!selectedId) return;
    setIsJoining(true);
    try {
      await weddingService.join(selectedId);
      toast.success("Você foi vinculado ao casamento!");
      navigate("/home", { replace: true });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        toast.error("Você já está vinculado a este casamento.");
      } else {
        toast.error("Não foi possível entrar no casamento. Tente novamente.");
      }
    } finally {
      setIsJoining(false);
    }
  };

  const filtered = weddings.filter((w) => {
    const q = search.toLowerCase();
    return (
      w.title.toLowerCase().includes(q) ||
      w.coupleName1?.toLowerCase().includes(q) ||
      w.coupleName2?.toLowerCase().includes(q) ||
      w.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Seu casamento
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie um novo casamento ou entre em um já existente.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="create"
          onValueChange={(v) => {
            if (v === "join") loadWeddings();
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Criar novo</TabsTrigger>
            <TabsTrigger value="join">Entrar em um existente</TabsTrigger>
          </TabsList>

          {/* ── aba: criar ───────────────────────────────────────────────── */}
          <TabsContent value="create">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Título */}
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Nome do casamento
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Ex: Nosso casamento"
                      {...register("title")}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-xs text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Noivos */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Nomes dos noivos
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="text"
                        placeholder="Noivo/a 1"
                        {...register("coupleName1")}
                      />
                      <Input
                        type="text"
                        placeholder="Noivo/a 2"
                        {...register("coupleName2")}
                      />
                    </div>
                  </div>

                  {/* Data */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="weddingDate"
                      className="text-sm font-medium flex items-center gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Data do casamento
                    </Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      {...register("weddingDate")}
                      className={errors.weddingDate ? "border-destructive" : ""}
                    />
                    {errors.weddingDate && (
                      <p className="text-xs text-destructive">
                        {errors.weddingDate.message}
                      </p>
                    )}
                  </div>

                  {/* Local */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium flex items-center gap-1.5"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      Local{" "}
                      <span className="text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Ex: Campo Grande, RJ"
                      {...register("location")}
                    />
                  </div>

                  {/* Orçamento */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="budgetTotal"
                      className="text-sm font-medium flex items-center gap-1.5"
                    >
                      <DollarSign className="h-3.5 w-3.5" />
                      Orçamento total{" "}
                      <span className="text-muted-foreground font-normal">
                        (opcional)
                      </span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        R$
                      </span>
                      <Input
                        id="budgetTotal"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        className="pl-9"
                        {...register("budgetTotal")}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      "Criar casamento"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Todas as informações podem ser editadas depois.
            </p>
          </TabsContent>

          {/* ── aba: entrar ──────────────────────────────────────────────── */}
          <TabsContent value="join">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, noivos ou local..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Lista */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {loadingList ? (
                    <div className="flex justify-center py-8">
                      <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      {search
                        ? "Nenhum casamento encontrado."
                        : "Não há casamentos cadastrados."}
                    </p>
                  ) : (
                    filtered.map((wedding) => {
                      const isSelected = selectedId === wedding.id;
                      const names = [wedding.coupleName1, wedding.coupleName2]
                        .filter(Boolean)
                        .join(" & ");

                      return (
                        <button
                          key={wedding.id}
                          type="button"
                          onClick={() =>
                            setSelectedId(isSelected ? null : wedding.id)
                          }
                          className={`w-full text-left rounded-lg border px-4 py-3 transition-all ${
                            isSelected
                              ? "border-primary bg-accent"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {wedding.title}
                              </p>
                              {names && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {names}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-x-3 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(wedding.weddingDate)}
                                </span>
                                {wedding.location && (
                                  <span className="text-xs text-muted-foreground">
                                    {wedding.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={!selectedId || isJoining}
                  onClick={handleJoin}
                >
                  {isJoining ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    "Entrar no casamento"
                  )}
                </Button>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Você entrará como membro com permissão de edição.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
