"use client";

import { useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import type { DecodedToken } from "@/types";

export function useAuth(role?: string) {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedToken = authService.getDecodedToken();

    if (!decodedToken || authService.isTokenExpired()) {
      authService.logout();
      // navigate and stop — don't continue to set state after pushing
      router.push("/login");
      return;
    }

    if (role && decodedToken.role !== role) {
      router.push("/login");
      return;
    }

    // mark these state updates as non-urgent so React won't trigger cascading renders
    startTransition(() => {
      setUser(decodedToken);
      setLoading(false);
    });
  }, [router, role]);

  return { user, loading };
}
