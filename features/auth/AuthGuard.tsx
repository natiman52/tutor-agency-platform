import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCurrentUser } from "@/features/auth/hooks";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isInitialized, isAuthenticated } = useAuthStore();
  const { isLoading } = useCurrentUser(); // Trigger the check

  if (isLoading || !isInitialized) {
    return <div>Loading your session...</div>; // Replace with a Spinner
  }

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
};