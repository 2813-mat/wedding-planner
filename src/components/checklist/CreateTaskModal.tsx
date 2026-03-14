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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateTask } from "../../hooks/useChecklist";
import { toast } from "../ui/use-toast";
import type { CreateTaskDTO } from "../../services/checklistService";

const PERIODS = [
  "12+ meses antes",
  "9-12 meses antes",
  "6-9 meses antes",
  "3-6 meses antes",
  "1-3 meses antes",
  "Última semana",
] as const;

const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  period: z.enum(PERIODS, {
    errorMap: () => ({ message: "Período inválido" }),
  }),
});

type FormValues = z.infer<typeof createTaskSchema>;

const defaultValues: FormValues = {
  title: "",
  category: "",
  period: "12+ meses antes",
};

export function CreateTaskModal() {
  const [open, setOpen] = useState(false);
  const createTask = useCreateTask();

  const form = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    const payload: CreateTaskDTO = {
      title: values.title.trim(),
      category: values.category.trim(),
      period: values.period,
    };

    try {
      await createTask.mutateAsync(payload);
      toast({
        title: "Tarefa criada",
        description: `"${values.title}" foi adicionada ao checklist.`,
      });
      form.reset(defaultValues);
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao criar tarefa",
        description: "Não foi possível adicionar a tarefa. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova tarefa
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar tarefa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Contratar fotógrafo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Fornecedores" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PERIODS.map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <Button type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? (
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
