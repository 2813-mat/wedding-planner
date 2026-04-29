import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart,
  Loader,
  MapPin,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { weddingService } from "../services/weddingService";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(2, "Título deve ter ao menos 2 caracteres"),
  weddingDate: z.string().min(1, "Data do casamento é obrigatória"),
  location: z.string().optional(),
  budgetTotal: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val.replace(",", ".")) : 0)),
  coupleName1: z.string().optional(),
  coupleName2: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateWeddingPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsCreating(true);
    try {
      await weddingService.create({
        title: data.title,
        weddingDate: data.weddingDate,
        location: data.location,
        budgetTotal: data.budgetTotal as number,
        coupleName1: data.coupleName1,
        coupleName2: data.coupleName2,
      });
      toast.success("Casamento criado com sucesso!");
      navigate("/home", { replace: true });
    } catch {
      toast.error("Não foi possível criar o casamento. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Seu casamento
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Preencha os dados para começar o planejamento.
            </p>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium">
                  Nome do casamento
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ex: Nosso casamento"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Nomes dos noivos
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder="Noivo/a 1"
                    {...register("coupleName1")}
                  />
                  <Input
                    type="text"
                    placeholder="Noivo/a 2"
                    {...register("coupleName2")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="weddingDate"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Data do casamento
                </Label>
                <Input
                  id="weddingDate"
                  type="date"
                  {...register("weddingDate")}
                  className={errors.weddingDate ? "border-destructive" : ""}
                />
                {errors.weddingDate && (
                  <p className="text-xs text-destructive">
                    {errors.weddingDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Local{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Ex: Campo Grande, RJ"
                  {...register("location")}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="budgetTotal"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  Orçamento total{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="budgetTotal"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className="pl-9"
                    {...register("budgetTotal")}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Criar casamento"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Todas as informações podem ser editadas depois.
        </p>
      </div>
    </div>
  );
}
