import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader } from "lucide-react";
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
import { useCreateBudgetCategory } from "../../hooks/useBudget";
import { toast } from "../ui/use-toast";
import type { CreateBudgetCategoryDTO } from "../../services/budgetService";

const createBudgetCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  planned: z
    .string()
    .min(1, "Valor planejado é obrigatório")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: "Valor inválido",
    }),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormValues = z.infer<typeof createBudgetCategorySchema>;

const defaultValues: FormValues = {
  name: "",
  planned: "",
  color: "#8B7355",
};

export function CreateBudgetCategoryModal() {
  const [open, setOpen] = useState(false);
  const createCategory = useCreateBudgetCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(createBudgetCategorySchema),
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    const payload: CreateBudgetCategoryDTO = {
      name: values.name.trim(),
      planned: parseFloat(values.planned),
      color: values.color,
    };

    try {
      await createCategory.mutateAsync(payload);
      toast({
        title: "Categoria criada",
        description: `${values.name} foi adicionada ao orçamento.`,
      });
      form.reset(defaultValues);
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao criar categoria",
        description: "Não foi possível adicionar a categoria. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar categoria</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Decoração" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor planejado (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="5000.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor no gráfico</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="h-9 w-14 cursor-pointer rounded border border-input bg-background p-1"
                        {...field}
                      />
                      <Input
                        placeholder="#8B7355"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex-1"
                      />
                    </div>
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
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Adicionar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
