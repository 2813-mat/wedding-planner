import { Heart, Calendar, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const WEDDING_DATE = new Date("2025-10-18T16:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = WEDDING_DATE.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quickLinks = [
    {
      title: "Convidados",
      href: "/convidados",
      description: "Gerencie sua lista",
    },
    {
      title: "Orçamento",
      href: "/orcamento",
      description: "Controle financeiro",
    },
    {
      title: "Checklist",
      href: "/checklist",
      description: "Tarefas pendentes",
    },
    {
      title: "Fornecedores",
      href: "/fornecedores",
      description: "Seus parceiros",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <section className="mb-12 text-center animate-fade-up">
        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-accent p-4">
          <Heart className="h-8 w-8 text-primary" fill="currentColor" />
        </div>

        <h1 className="mb-2 font-display text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
          Thais & Mateus
        </h1>

        <p className="mb-8 text-lg text-muted-foreground">Vamos nos casar!</p>

        {/* Wedding Info */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>09 de Setembro de 2028</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>A definir</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>A definir</span>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section
        className="mb-12 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Card className="border-0 bg-gradient-to-br from-accent to-secondary shadow-sm">
          <CardContent className="p-8">
            <h2 className="mb-6 text-center font-display text-2xl font-medium text-foreground">
              Contagem Regressiva
            </h2>

            <div className="grid grid-cols-4 gap-4">
              {[
                { value: timeLeft.days, label: "Dias" },
                { value: timeLeft.hours, label: "Horas" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Seg" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mb-1 font-display text-3xl font-semibold text-primary md:text-4xl lg:text-5xl">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground md:text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="mb-6 font-display text-2xl font-medium">
          Acesso Rápido
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Card className="group cursor-pointer border-0 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-display text-lg font-medium group-hover:text-primary">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <div className="text-muted-foreground transition-transform group-hover:translate-x-1">
                    →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="mt-12 text-center animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/resumo">Ver Resumo Completo</Link>
        </Button>
      </section>
    </div>
  );
}
