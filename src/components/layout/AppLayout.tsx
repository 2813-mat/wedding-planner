import {
  Heart,
  Home,
  Users,
  CheckSquare,
  DollarSign,
  Store,
  Gift,
  Plane,
  Menu,
  LogOut,
} from "lucide-react";
import { NavLink } from "../NavLink";
import { useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { title: "Início", url: "/home", icon: Home },
  { title: "Resumo", url: "/resumo", icon: Heart },
  { title: "Convidados", url: "/convidados", icon: Users },
  { title: "Checklist", url: "/checklist", icon: CheckSquare },
  { title: "Orçamento", url: "/orcamento", icon: DollarSign },
  { title: "Fornecedores", url: "/fornecedores", icon: Store },
  { title: "Presentes", url: "/presentes", icon: Gift },
  { title: "Lua de Mel", url: "/lua-de-mel", icon: Plane },
];

export function AppLayout() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const NavContent = () => (
    <nav className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="mb-6 px-3">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="font-display text-xl font-semibold">
            Nosso Casamento
          </span>
        </div>
        {user?.fullName && (
          <p className="mt-1 text-xs text-muted-foreground">{user.fullName}</p>
        )}
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-primary text-primary-foreground"
            onClick={() => setOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-4 border-t border-sidebar-border pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </nav>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" fill="currentColor" />
            <span className="font-display text-lg font-semibold">
              Nosso Casamento
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 h-screen w-64 border-r bg-sidebar flex flex-col">
        <NavContent />
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
