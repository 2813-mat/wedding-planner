import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

export function EntryRoute() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-pink-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
}
