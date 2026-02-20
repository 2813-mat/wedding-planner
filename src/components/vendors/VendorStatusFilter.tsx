import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Filter } from "lucide-react";
import type { Vendor } from "../../services/vendorService";

type StatusFilter = Vendor["status"] | "todos";

interface VendorStatusFilterProps {
  value: StatusFilter;
  onFilterChange: (status: StatusFilter) => void;
}

const statusLabels: Record<StatusFilter, string> = {
  todos: "Todos",
  cotando: "Cotando",
  contratado: "Contratado",
  pago: "Pago",
  cancelado: "Cancelado",
};

const statusVariants: Record<
  StatusFilter,
  "default" | "secondary" | "outline" | "destructive"
> = {
  todos: "default",
  cotando: "secondary",
  contratado: "outline",
  pago: "outline",
  cancelado: "destructive",
};

export function VendorStatusFilter({
  value,
  onFilterChange,
}: VendorStatusFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          {statusLabels[value]}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(statusLabels) as StatusFilter[]).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onFilterChange(status)}
            className="cursor-pointer"
          >
            <Badge
              variant={statusVariants[status]}
              className={`mr-2 w-20 justify-center ${
                status === "contratado"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : ""
              }`}
            >
              {statusLabels[status]}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
