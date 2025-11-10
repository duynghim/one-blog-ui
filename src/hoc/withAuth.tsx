"use client";

import type { ComponentType } from "react";
import { useAuth } from "@/hooks";
import { Loader } from "@mantine/core";

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  role?: string,
) {
  const WithAuthComponent = (props: P) => {
    const { user, loading } = useAuth(role);

    if (loading) {
      return <Loader size="xl" />;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuthComponent;
}

function getDisplayName<P>(WrappedComponent: ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
