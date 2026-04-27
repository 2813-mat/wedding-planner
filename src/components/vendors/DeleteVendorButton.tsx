import { useState } from "react";
import { Trash2, Loader } from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useDeleteVendor } from "../../hooks/useVendors";
import { toast } from "../ui/use-toast";
import type { Vendor } from "../../services/vendorService";

interface DeleteVendorButtonProps {
  vendor: Vendor;
}

export function DeleteVendorButton({ vendor }: DeleteVendorButtonProps) {
  const [open, setOpen] = useState(false);
  const deleteVendor = useDeleteVendor();

  const handleDelete = async () => {
    try {
      await deleteVendor.mutateAsync(vendor.id);
      toast({
        title: "Fornecedor removido",
        description: `${vendor.name} foi removido com sucesso.`,
      });
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o fornecedor.",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover fornecedor</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover <strong>{vendor.name}</strong>? Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteVendor.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteVendor.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteVendor.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
