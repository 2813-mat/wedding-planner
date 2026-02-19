interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function HoneymoonFilters({ value, onChange }: Props) {
  const statuses = ["todos", "planejando", "confirmado", "finalizado"];

  return (
    <div className="flex gap-2 mb-4">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-3 py-1 rounded-full text-sm ${
            value === status ? "bg-primary text-white" : "bg-muted"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
