import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Heart, Loader } from "lucide-react";

export default function LoginPage() {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/resumo";
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md border-2 border-pink-100 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 fill-pink-500 text-pink-500" />
          </div>
          <CardTitle className="text-3xl">Wedding Planner</CardTitle>
          <CardDescription>
            Organize seu casamento de forma fácil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            Faça login com sua conta Auth0 para começar
          </p>
          <Button
            onClick={() => loginWithRedirect()}
            className="w-full h-10 bg-pink-500 hover:bg-pink-600 text-white font-semibold"
            size="lg"
          >
            Entrar com Auth0
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">ou</span>
            </div>
          </div>
          <Button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { screen_hint: "signup" },
              })
            }
            variant="outline"
            className="w-full h-10 border-2 border-pink-500 text-pink-600 hover:bg-pink-50"
            size="lg"
          >
            Criar nova conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
