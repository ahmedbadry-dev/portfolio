"use client";

import type { ReactNode } from "react";

type LenisProviderProps = {
  children: ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  return children;
}