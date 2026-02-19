import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Calendar, Plane, MapPin } from "lucide-react";

interface Honeymoon {
  id: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  budget: number;
  notes?: string;
  status: string;
  createdAt: string;
}

interface Props {
  honeymoon: Honeymoon;
}

function calculateTripInfo(honeymoon: Honeymoon) {
  const departure = new Date(honeymoon.departureDate);
  const returnDate = new Date(honeymoon.returnDate);

  const diffTime = returnDate.getTime() - departure.getTime();
  const tripDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const formattedDeparture = departure.toLocaleDateString("pt-BR");
  const formattedReturn = returnDate.toLocaleDateString("pt-BR");

  const formattedBudget = honeymoon.budget.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return {
    dates: `${formattedDeparture} - ${formattedReturn}`,
    tripDays,
    formattedBudget,
  };
}

export function HoneymoonCard({ honeymoon }: Props) {
  const tripInfo = calculateTripInfo(honeymoon);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-semibold">{honeymoon.destination}</span>

          <span className="text-sm capitalize text-muted-foreground">
            {honeymoon.status}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {tripInfo.dates}
        </div>

        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4" />
          {tripInfo.tripDays} dias
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {tripInfo.formattedBudget}
        </div>

        {honeymoon.notes && (
          <p className="pt-2 text-muted-foreground">{honeymoon.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
