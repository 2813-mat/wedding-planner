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
import { Textarea } from "../ui/textarea";
import { useCreateGift } from "../../hooks/useGifts";
import { toast } from "../ui/use-toast";
import type { CreateGiftDTO } from "../../services/giftService";
import { useState } from "react";

const createGiftSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.string().optional(),
  link: z.string().optional(),
  imageUrl: z.string().optional(),
});

type CreateGiftFormValues = z.infer<typeof createGiftSchema>;

const defaultValues: CreateGiftFormValues = {
  name: "",
  description: "",
  price: undefined,
  link: "",
  imageUrl: "",
};

interface CreateGiftModalProps {
  trigger?: React.ReactNode;
}

export function CreateGiftModal({ trigger }: CreateGiftModalProps) {
  const [open, setOpen] = useState(false);
  const createGift = useCreateGift();

  const form = useForm<CreateGiftFormValues>({
    resolver: zodResolver(createGiftSchema),
    defaultValues,
  });

  const onSubmit = async (values: CreateGiftFormValues) => {
    const priceStr = values.price?.trim();
    const priceNum = priceStr ? parseFloat(priceStr) : undefined;
    if (priceStr && (isNaN(priceNum ?? NaN) || (priceNum ?? 0) < 0)) {
      form.setError("price", { message: "Preço inválido" });
      return;
    }
    const link = values.link?.trim();
    const imageUrl = values.imageUrl?.trim();
    if (link && !/^https?:\/\/.+/.test(link)) {
      form.setError("link", { message: "URL inválida" });
      return;
    }
    if (imageUrl && !/^https?:\/\/.+/.test(imageUrl)) {
      form.setError("imageUrl", { message: "URL inválida" });
      return;
    }

    const payload: CreateGiftDTO = {
      name: values.name.trim(),
      ...(values.description?.trim() && { description: values.description.trim() }),
      ...(priceNum != null && !isNaN(priceNum) && { price: priceNum }),
      ...(link && { link }),
      ...(imageUrl && { imageUrl }),
    };

    try {
      await createGift.mutateAsync(payload);
      toast({
        title: "Presente criado",
        description: `${values.name} foi adicionado à lista com sucesso.`,
      });
      form.reset(defaultValues);
      setOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao criar presente",
        description: "Não foi possível adicionar o presente. Tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo presente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar presente</DialogTitle>
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
                    <Input placeholder="Ex: Fritadeira Elétrica AirFryer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Modelo 4L, cor preta, voltagem 110v..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                      min="0"
                      placeholder="349.90"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do produto</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://www.amazon.com.br/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da imagem</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://m.media-amazon.com/images/..."
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
              <Button type="submit" disabled={createGift.isPending}>
                {createGift.isPending ? (
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
