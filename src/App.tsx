import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import GuestsPage from "./pages/GuestsPage";
import ChecklistPage from "./pages/ChecklistPage";
import BudgetPage from "./pages/BudgetPage";
import VendorsPage from "./pages/VendorsPage";
import GiftsPage from "./pages/GiftsPage";
import HoneymoonPage from "./pages/HoneymoonPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import { EntryRoute } from "./routes/EntryRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* privadas */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/resumo" element={<DashboardPage />} />
            <Route path="/convidados" element={<GuestsPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/orcamento" element={<BudgetPage />} />
            <Route path="/fornecedores" element={<VendorsPage />} />
            <Route path="/presentes" element={<GiftsPage />} />
            <Route path="/lua-de-mel" element={<HoneymoonPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
