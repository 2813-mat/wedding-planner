import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";

interface Props {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function HoneymoonForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    destination: "",
    departureDate: "",
    returnDate: "",
    budget: "",
    notes: "",
    status: "planejando",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      budget: Number(form.budget),
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Nova Lua de Mel</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Destino"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="w-full rounded border p-2"
          />

          <input
            type="date"
            value={form.departureDate}
            onChange={(e) =>
              setForm({ ...form, departureDate: e.target.value })
            }
            className="w-full rounded border p-2"
          />

          <input
            type="date"
            value={form.returnDate}
            onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
            className="w-full rounded border p-2"
          />

          <input
            type="number"
            placeholder="Orçamento"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className="w-full rounded border p-2"
          />

          <textarea
            placeholder="Observações"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded border p-2"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white"
            >
              Salvar
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
