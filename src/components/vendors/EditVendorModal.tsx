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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useUpdateVendor } from "../../hooks/useVendors";
import { toast } from "../ui/use-toast";
import type { Vendor } from "../../services/vendorService";
import {
  VENDOR_CATEGORIES,
  type VendorCategory,
} from "../../constants/vendorCategories";

const schema = z.object({
  name: z.string().optional(),
  category: z.enum(VENDOR_CATEGORIES).optional(),
  contactName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["cotando", "contratado", "pago", "cancelado"]),
  notes: z.string().optional(),
  price: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditVendorModalProps {
  vendor: Vendor;
}

export function EditVendorModal({ vendor }: EditVendorModalProps) {
  const [open, setOpen] = useState(false);
  const updateVendor = useUpdateVendor();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: vendor.name,
      category: vendor.category as VendorCategory,
      contactName: vendor.contactName,
      email: vendor.email ?? "",
      phone: vendor.phone ?? "",
      status: vendor.status,
      notes: vendor.notes ?? "",
      price: vendor.price != null ? String(vendor.price) : "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: vendor.name,
        category: vendor.category as VendorCategory,
        contactName: vendor.contactName,
        email: vendor.email ?? "",
        phone: vendor.phone ?? "",
        status: vendor.status,
        notes: vendor.notes ?? "",
        price: vendor.price != null ? String(vendor.price) : "",
      });
    }
  }, [open, vendor, form]);

  const onSubmit = async (values: FormValues) => {
    const parsedPrice = values.price ? parseFloat(values.price) : undefined;
    try {
      await updateVendor.mutateAsync({
        id: vendor.id,
        data: {
          name: values.name?.trim() || vendor.name,
          category: values.category || vendor.category,
          contactName: values.contactName?.trim() || vendor.contactName,
          email: values.email ?? vendor.email,
          phone: values.phone ?? vendor.phone,
          status: values.status,
          notes: values.notes ?? vendor.notes,
          price: !isNaN(parsedPrice as number) ? parsedPrice : vendor.price,
        },
      });
      toast({
        title: "Fornecedor atualizado",
        description: `${values.name} foi atualizado com sucesso.`,
      });
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o fornecedor.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar fornecedor</DialogTitle>
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
                    <Input {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VENDOR_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
              <Button type="submit" disabled={updateVendor.isPending}>
                {updateVendor.isPending && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
