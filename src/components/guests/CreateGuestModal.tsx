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
import { useCreateGuest } from "../../hooks/useGuests";
import { toast } from "../ui/use-toast";
import type { CreateGuestDTO } from "../../services/guestService";
import { useState } from "react";

const createGuestSchema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  relation: z.string().optional(),
  groupName: z.string().optional(),
  plusOne: z.boolean().optional(),
  confirmed: z.coerce.number().int().optional(),
  adults: z.coerce.number().int().min(0).optional(),
  children: z.coerce.number().int().min(0).optional(),
});

type CreateGuestFormValues = z.infer<typeof createGuestSchema>;

const defaultValues: CreateGuestFormValues = {
  fullName: "",
  email: "",
  phone: "",
  relation: "",
  groupName: "",
  plusOne: false,
  confirmed: 0,
  adults: 1,
  children: 0,
};

interface CreateGuestModalProps {
  trigger?: React.ReactNode;
}

export function CreateGuestModal({ trigger }: CreateGuestModalProps) {
  const [open, setOpen] = useState(false);
  const createGuest = useCreateGuest();

  const form = useForm<CreateGuestFormValues>({
    resolver: zodResolver(createGuestSchema),
    defaultValues,
  });

  const onSubmit = async (values: CreateGuestFormValues) => {
    const payload: CreateGuestDTO = {
      fullName: values.fullName.trim(),
      ...(values.email && { email: values.email.trim() }),
      ...(values.phone && { phone: values.phone.trim() }),
      ...(values.relation && { relation: values.relation.trim() }),
      ...(values.groupName && { groupName: values.groupName.trim() }),
      ...(values.plusOne !== undefined && { plusOne: values.plusOne }),
      ...(values.confirmed !== undefined && { confirmed: values.confirmed }),
      ...(values.adults !== undefined && { adults: values.adults }),
      ...(values.children !== undefined && { children: values.children }),
    };

    try {
      await createGuest.mutateAsync(payload);

      toast({
        title: "Convidado criado",
        description: `${values.fullName} foi adicionado com sucesso.`,
      });

      form.reset(defaultValues);
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao criar convidado",
        description: "Não foi possível adicionar o convidado.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo convidado
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar convidado</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="+55 11 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relação</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Amigo, Primo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Família Noiva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adultos</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crianças</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={createGuest.isPending}>
                {createGuest.isPending ? (
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
