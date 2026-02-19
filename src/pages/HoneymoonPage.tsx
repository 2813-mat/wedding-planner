import { useState } from "react";
import { useCreateHoneymoon, useHoneymoon } from "../hooks/useHoneymoon";
import { HoneymoonCard } from "../components/honeymoon/HoneymoonCard";
import { HoneymoonForm } from "../components/honeymoon/HoneymoonForm";
import { HoneymoonFilters } from "../components/honeymoon/HoneymoonFilters";

export default function HoneymoonPage() {
  const { data: honeymoons = [], isLoading } = useHoneymoon();
  const { mutateAsync: createHoneymoon } = useCreateHoneymoon();

  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");

  const sorted = [...honeymoons].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const filtered = sorted.filter((h) =>
    statusFilter === "todos" ? true : h.status === statusFilter,
  );

  const handleCreate = async (data: any) => {
    await createHoneymoon(data);
    setIsCreating(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Lua de Mel</h1>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded bg-primary text-white"
        >
          Criar lua de mel
        </button>
      </div>

      <HoneymoonFilters value={statusFilter} onChange={setStatusFilter} />

      {isCreating && (
        <HoneymoonForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="grid gap-4">
        {filtered.map((honeymoon) => (
          <HoneymoonCard key={honeymoon.id} honeymoon={honeymoon} />
        ))}
      </div>
    </div>
  );
}
