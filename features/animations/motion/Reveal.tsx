"use client";

import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
};

export function Reveal({ children }: RevealProps) {
  return children;
}