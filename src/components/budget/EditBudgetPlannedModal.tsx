import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useUpdateBudgetCategory } from "../../hooks/useBudget";
import { toast } from "../ui/use-toast";
import type { BudgetCategory } from "../../services/budgetService";

const schema = z.object({
  planned: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: "Valor inválido",
    }),
});

type FormValues = z.infer<typeof schema>;

interface EditBudgetPlannedModalProps {
  category: BudgetCategory;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function EditBudgetPlannedModal({ category }: EditBudgetPlannedModalProps) {
  const [open, setOpen] = useState(false);
  const updateCategory = useUpdateBudgetCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { planned: String(category.planned) },
  });

  useEffect(() => {
    if (open) {
      form.reset({ planned: String(category.planned) });
    }
  }, [open, category.planned, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        data: { planned: parseFloat(values.planned) },
      });
      toast({
        title: "Valor planejado atualizado",
        description: `${category.name} atualizado para ${formatCurrency(parseFloat(values.planned))}.`,
      });
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o valor. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{category.name}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Pago até agora: {formatCurrency(category.spent)}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="planned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor planejado (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateCategory.isPending}>
                {updateCategory.isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
