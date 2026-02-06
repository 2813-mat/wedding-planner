import {
  Plane,
  MapPin,
  Calendar,
  Hotel,
  FileText,
  Check,
  Circle,
  Loader,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { useState } from "react";
import { useHoneymoon } from "../hooks/useHoneymoon";

interface DocumentItem {
  id: number;
  title: string;
  completed: boolean;
}

export default function HoneymoonPage() {
  const { data: honeymoons = [], isLoading, error } = useHoneymoon();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          Erro ao carregar informações da lua de mel. Verifique sua conexão com
          a API.
        </div>
      </div>
    );
  }

  const honeymoon = honeymoons[0];

  if (!honeymoon) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma lua de mel planejada ainda.
          </p>
        </div>
      </div>
    );
  }

  const destination = honeymoon;

  const startDate = honeymoon.startDate;
  const endDate = honeymoon.endDate;

  const dates = `${startDate} - ${endDate}`;

  const toggleDocument = (id: number) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, completed: !doc.completed } : doc,
      ),
    );
  };

  const completedDocs = documents.filter((d) => d.completed).length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-semibold">Lua de Mel</h1>
        <p className="mt-1 text-muted-foreground">
          A viagem dos sonhos após o grande dia
        </p>
      </header>

      {/* Hero Destination */}
      <section
        className="mb-8 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={destination.image}
              alt={destination.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
              <h2 className="font-display text-4xl font-semibold">
                {destination.name}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {dates}
                </div>
                <div className="flex items-center gap-1">
                  <Plane className="h-4 w-4" />
                  12 dias
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm opacity-80">
                {destination.notes}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hotels */}
        <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-xl">
                <Hotel className="h-5 w-5 text-primary" />
                Hospedagens
              </CardTitle>
            </CardHeader>
            {/* <CardContent className="space-y-4">
              {hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-4"
                >
                  <div>
                    <h3 className="font-medium">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {hotel.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {hotel.dates}
                    </p>
                  </div>
                  {hotel.confirmed && (
                    <div className="flex items-center gap-1 text-success">
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Confirmado</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent> */}
          </Card>
        </section>

        {/* Documents Checklist */}
        <section
          className="animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-display text-xl">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documentos
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {completedDocs}/{documents.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`doc-${doc.id}`}
                      checked={doc.completed}
                      onCheckedChange={() => toggleDocument(doc.id)}
                    />
                    <label
                      htmlFor={`doc-${doc.id}`}
                      className={`cursor-pointer text-sm ${
                        doc.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {doc.title}
                    </label>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Itinerary
      <section
        className="mt-6 animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-xl">
              <Calendar className="h-5 w-5 text-primary" />
              Roteiro de Viagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

              <div className="space-y-6">
                {itinerary.map((day, index) => (
                  <div key={index} className="relative pl-10">
                  
                    <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Dia {day.day}</span>
                        <span className="text-sm text-muted-foreground">
                          • {day.date}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {day.activities.map((activity, actIndex) => (
                          <li
                            key={actIndex}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Circle className="h-1.5 w-1.5 fill-current" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      */}
    </div>
  );
}
