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
import { Textarea } from "../ui/textarea";
import { useCreateVendor } from "../../hooks/useVendors";
import { toast } from "../ui/use-toast";
import type { CreateVendorDTO } from "../../services/vendorService";
import { useState } from "react";

const createVendorSchema = z.object({
  name: z.string().min(1, "Nome do fornecedor é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  contactName: z.string().min(1, "Nome do contato é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  status: z.enum(["cotando", "contratado", "pago", "cancelado"]),
  notes: z.string().optional().or(z.literal("")),
  price: z
    .union([z.number(), z.nan()])
    .optional()
    .transform((val) => (isNaN(val as number) ? undefined : val)),
});

type CreateVendorFormValues = z.infer<typeof createVendorSchema>;

const defaultValues: CreateVendorFormValues = {
  name: "",
  category: "",
  contactName: "",
  email: "",
  phone: "",
  status: "cotando",
  notes: "",
  price: undefined,
};

export function CreateVendorModal() {
  const [open, setOpen] = useState(false);
  const createVendor = useCreateVendor();

  const form = useForm<CreateVendorFormValues>({
    resolver: zodResolver(createVendorSchema),
    defaultValues,
  });

  const onSubmit = async (values: CreateVendorFormValues) => {
    const payload: CreateVendorDTO = {
      name: values.name.trim(),
      category: values.category,
      contactName: values.contactName.trim(),
      email: values.email || "",
      phone: values.phone || "",
      status: values.status,
      notes: values.notes || "",
      price: values.price ?? 0,
    };

    try {
      await createVendor.mutateAsync(payload);

      toast({
        title: "Fornecedor criado",
        description: `${values.name} foi adicionado com sucesso.`,
      });

      form.reset(defaultValues);
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao criar fornecedor",
        description: "Não foi possível adicionar o fornecedor.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Novo fornecedor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar fornecedor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do fornecedor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Buffet Gourmet" {...field} />
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
                    <Input placeholder="Ex: buffet, fotografia..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do contato *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marcela Santos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cotando">Cotando</SelectItem>
                      <SelectItem value="contratado">Contratado</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={createVendor.isPending}>
                {createVendor.isPending && (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                )}
                Adicionar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
