import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Heart, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../services/api";

export default function LoginPage() {
  const {
    loginWithRedirect,
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const initAuth = async () => {
        try {
          const tokenResponse = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: "openid profile email",
            },
            detailedResponse: true,
          });

          const token =
            typeof tokenResponse === "string"
              ? tokenResponse
              : tokenResponse.access_token;

          setAccessToken(token);

          try {
            const response = await api.post("/auth/sync-user");
            console.log("✅ Usuário sincronizado com sucesso:", response.data);
          } catch (syncError: any) {
            console.error("❌ Erro ao sincronizar usuário:", {
              status: syncError.response?.status,
              statusText: syncError.response?.statusText,
              data: syncError.response?.data,
              message: syncError.message,
            });
            throw syncError; // Re-lança o erro para ser tratado no catch externo
          }

          navigate("/home", { replace: true });
        } catch (err: any) {
          console.error("Erro na sincronização pós-login:", err);

          if (
            err?.error === "login_required" ||
            err?.error === "consent_required"
          ) {
            loginWithRedirect({
              authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              },
            });
          } else {
            alert("Falha ao autenticar. Tente novamente.");
          }
        }
      };

      initAuth();
    }
  }, [
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    navigate,
    loginWithRedirect,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm border-0 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-semibold">
              Wedding Planner
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize seu casamento de forma fácil
            </p>
          </div>

          <Button onClick={() => loginWithRedirect()} className="w-full">
            Entrar
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                ou
              </span>
            </div>
          </div>
          <Button
            onClick={() => loginWithRedirect()}
            variant="outline"
            className="w-full"
          >
            Criar nova conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
