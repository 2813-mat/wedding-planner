import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
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
import RegisterPage from "./pages/RegisterPage";
import CreateWeddingPage from "./pages/CreateWeddingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { EntryRoute } from "./routes/EntryRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota raiz - redireciona para /login ou /home */}
            <Route path="/" element={<EntryRoute />} />

            {/* públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* criação de casamento - requer autenticação */}
            <Route
              path="/create-wedding"
              element={
                <ProtectedRoute>
                  <CreateWeddingPage />
                </ProtectedRoute>
              }
            />

            {/* privadas */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
