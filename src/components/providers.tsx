"use client";

import { Toaster } from "sonner";
import { ReactNode } from "react";
import { SessionProvider } from "./providers/session-provider";
import { AuthProvider } from "@/contexts/auth-context";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors closeButton expand={false} />
      </AuthProvider>
    </SessionProvider>
  );
}


