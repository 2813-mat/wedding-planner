import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import api, { setAccessToken } from "../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [tokenReady, setTokenReady] = useState(false);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const init = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        });
        setAccessToken(token);

        if (!syncedRef.current) {
          syncedRef.current = true;
          await api.post("/auth/sync-user").catch(() => {
            // sync-user pode falhar se o usuário já existe — não bloqueia a navegação
          });
        }

        setTokenReady(true);
      } catch {
        loginWithRedirect();
      }
    };

    init();
  }, [isLoading, isAuthenticated, getAccessTokenSilently, loginWithRedirect]);

  if (isLoading || (isAuthenticated && !tokenReady)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return <>{children}</>;
}
