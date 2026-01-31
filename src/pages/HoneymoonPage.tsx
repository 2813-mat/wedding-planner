import {
  Plane,
  MapPin,
  Calendar,
  Hotel,
  FileText,
  Check,
  Circle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { useState } from "react";

interface Destination {
  name: string;
  country: string;
  dates: string;
  image: string;
  description: string;
}

interface Hotel {
  name: string;
  location: string;
  dates: string;
  confirmed: boolean;
}

interface DocumentItem {
  id: number;
  title: string;
  completed: boolean;
}

const destination: Destination = {
  name: "Maldivas",
  country: "Ásia",
  dates: "19 Out - 30 Out 2025",
  image:
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&h=600&fit=crop",
  description:
    "12 dias em um paraíso tropical com águas cristalinas, bangalôs sobre as águas e experiências inesquecíveis.",
};

const hotels: Hotel[] = [
  {
    name: "Soneva Fushi Resort",
    location: "Baa Atoll",
    dates: "19 Out - 25 Out",
    confirmed: true,
  },
  {
    name: "COMO Cocoa Island",
    location: "South Malé Atoll",
    dates: "25 Out - 30 Out",
    confirmed: true,
  },
];

const itinerary = [
  {
    day: 1,
    date: "19 Out",
    activities: [
      "Chegada em Malé",
      "Transfer de hidroavião para Baa Atoll",
      "Check-in no Soneva Fushi",
    ],
  },
  {
    day: 2,
    date: "20 Out",
    activities: [
      "Café da manhã no bangalô",
      "Mergulho no recife de coral",
      "Jantar romântico na praia",
    ],
  },
  {
    day: 3,
    date: "21 Out",
    activities: [
      "Passeio de barco ao banco de areia",
      "Snorkeling com tartarugas",
      "Spa de casais",
    ],
  },
  {
    day: 4,
    date: "22 Out",
    activities: ["Dia livre no resort", "Piquenique em ilha deserta"],
  },
  {
    day: 5,
    date: "23 Out",
    activities: ["Aula de culinária maldívia", "Mergulho com tubarões-baleia"],
  },
  {
    day: 6,
    date: "24 Out",
    activities: ["Nascer do sol de paddleboard", "Último dia no Soneva Fushi"],
  },
  {
    day: 7,
    date: "25 Out",
    activities: [
      "Transfer para South Malé Atoll",
      "Check-in no COMO Cocoa Island",
      "Jantar de frutos do mar",
    ],
  },
  {
    day: 8,
    date: "26 Out",
    activities: ["Café flutuante no oceano", "Tratamento Ayurveda no spa"],
  },
  {
    day: 9,
    date: "27 Out",
    activities: ["Pesca tradicional", "Cinema sob as estrelas"],
  },
  {
    day: 10,
    date: "28 Out",
    activities: ["Excursão de golfinhos", "Jantar privativo no bangalô"],
  },
  {
    day: 11,
    date: "29 Out",
    activities: ["Dia de relaxamento", "Última noite especial"],
  },
  {
    day: 12,
    date: "30 Out",
    activities: ["Check-out", "Transfer para Malé", "Voo de retorno"],
  },
];

const initialDocuments: DocumentItem[] = [
  { id: 1, title: "Passaportes válidos", completed: true },
  { id: 2, title: "Visto de entrada (se necessário)", completed: true },
  { id: 3, title: "Reservas de hotel confirmadas", completed: true },
  { id: 4, title: "Passagens aéreas", completed: true },
  { id: 5, title: "Seguro viagem internacional", completed: false },
  { id: 6, title: "Vacinas obrigatórias", completed: false },
  { id: 7, title: "Cópias de documentos", completed: false },
  { id: 8, title: "Cartões de crédito internacionais", completed: true },
];

export default function HoneymoonPage() {
  const [documents, setDocuments] = useState(initialDocuments);

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
              <div className="flex items-center gap-2 text-sm opacity-90">
                <MapPin className="h-4 w-4" />
                {destination.country}
              </div>
              <h2 className="font-display text-4xl font-semibold">
                {destination.name}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {destination.dates}
                </div>
                <div className="flex items-center gap-1">
                  <Plane className="h-4 w-4" />
                  12 dias
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm opacity-80">
                {destination.description}
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
            <CardContent className="space-y-4">
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
            </CardContent>
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

      {/* Itinerary */}
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
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

              <div className="space-y-6">
                {itinerary.map((day, index) => (
                  <div key={index} className="relative pl-10">
                    {/* Timeline dot */}
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
    </div>
  );
}

