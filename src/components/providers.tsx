"use client";

import { Toaster } from "sonner";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton expand={false} />
    </>
  );
}


