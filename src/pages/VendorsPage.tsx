import {
  Store,
  Phone,
  Mail,
  Check,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useVendors } from "../hooks/useVendors";
import { VendorStatusFilter } from "../components/vendors/VendorStatusFilter";
import { CreateVendorModal } from "../components/vendors/CreateVendorModal";
import { useState } from "react";

const statusConfig = {
  cotando: {
    label: "Cotando",
    variant: "secondary" as const,
    icon: FileText,
    color: "text-muted-foreground",
  },
  contratado: {
    label: "Contratado",
    variant: "default" as const,
    icon: Check,
    color: "text-success",
  },
  pago: {
    label: "Pago",
    variant: "outline" as const,
    icon: Check,
    color: "text-primary",
  },
  cancelado: {
    label: "Cancelado",
    variant: "destructive" as const,
    icon: AlertCircle,
    color: "text-destructive",
  },
} as const;

const categoryColors = {
  buffet: "bg-blue-100 text-blue-800",
  cerimonia: "bg-purple-100 text-purple-800",
  decoracao: "bg-pink-100 text-pink-800",
  fotografia: "bg-green-100 text-green-800",
  musica: "bg-yellow-100 text-yellow-800",
  bolo: "bg-orange-100 text-orange-800",
  outros: "bg-gray-100 text-gray-800",
} as const;

export default function VendorsPage() {
  const { data: vendors = [], isLoading, isError, error } = useVendors();

  const [statusFilter, setStatusFilter] = useState<
    "todos" | "cotando" | "contratado" | "pago" | "cancelado"
  >("todos");

  const sortedVendors = [...vendors].sort(
    (a, b) =>
      new Date(b.createdAt ?? b.id).getTime() -
      new Date(a.createdAt ?? a.id).getTime(),
  );

  const filteredVendors =
    statusFilter === "todos"
      ? sortedVendors
      : sortedVendors.filter((vendor) => vendor.status === statusFilter);

  const contracted = vendors.filter((v) => v.status === "contratado").length;
  const negotiating = vendors.filter((v) => v.status === "cotando").length;
  const paid = vendors.filter((v) => v.status === "pago").length;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar fornecedores</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Tente novamente mais tarde."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="mx-auto max-w-6xl text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">
          Nenhum fornecedor cadastrado
        </h2>
        <p className="mt-2 text-muted-foreground">
          Adicione seus primeiros parceiros do casamento
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 space-y-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie todos os parceiros do casamento
          </p>
        </div>

        <div className="flex items-center justify-between">
          <VendorStatusFilter
            value={statusFilter}
            onFilterChange={setStatusFilter}
          />
          <CreateVendorModal />
        </div>
      </header>

      {/* 🔥 CARDS RESUMO */}
      <section className="mb-8 grid gap-4 sm:grid-cols-3">
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
              <p className="text-xs text-muted-foreground">
                Em Cotação/Negociação
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{paid}</p>
              <p className="text-xs text-muted-foreground">Pagos</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 🔥 LISTA FILTRADA E ORDENADA */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.map((vendor) => {
          const status = statusConfig[vendor.status] || statusConfig.cotando;
          const StatusIcon = status.icon;

          return (
            <Card
              key={vendor.id}
              className="border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                        categoryColors[
                          vendor.category as keyof typeof categoryColors
                        ] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {vendor.category}
                    </span>
                    <CardTitle className="mt-2 font-display text-lg">
                      {vendor.name}
                    </CardTitle>
                  </div>
                  <Badge variant={status.variant} className="shrink-0">
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {vendor.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {vendor.notes}
                  </p>
                )}

                {vendor.price && (
                  <p className="text-lg font-semibold text-primary">
                    R${" "}
                    {Number(vendor.price).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}

                <div className="space-y-1 pt-2 text-xs text-muted-foreground">
                  {vendor.contactName && (
                    <div className="flex items-center gap-2">
                      <Store className="h-3 w-3" />
                      <span>{vendor.contactName}</span>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
