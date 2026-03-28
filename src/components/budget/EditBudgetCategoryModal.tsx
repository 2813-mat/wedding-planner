import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings2, Loader } from "lucide-react";
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
  name: z.string().min(1, "Nome é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

interface EditBudgetCategoryModalProps {
  category: BudgetCategory;
}

export function EditBudgetCategoryModal({
  category,
}: EditBudgetCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const updateCategory = useUpdateBudgetCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: category.name, color: category.color },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: category.name, color: category.color });
    }
  }, [open, category.name, category.color, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        data: { name: values.name.trim(), color: values.color },
      });
      toast({
        title: "Categoria atualizada",
        description: `${values.name} foi atualizada com sucesso.`,
      });
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a categoria. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
          <Settings2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar categoria</DialogTitle>
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
