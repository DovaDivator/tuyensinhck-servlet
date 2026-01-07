// src/context/index.tsx
import React, { ReactNode } from "react";
import { AppProvider } from "./AppContext";
import { AuthProvider } from "./AuthContext";

type Props = {
  children: ReactNode;
};

export const ContextProvider = ({ children }: Props) => {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
};
