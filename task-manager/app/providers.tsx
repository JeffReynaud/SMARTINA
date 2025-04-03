"use client"

import type React from "react"

import { FoldersProvider } from "@/hooks/use-folders"

export function Providers({ children }: { children: React.ReactNode }) {
  return <FoldersProvider>{children}</FoldersProvider>
}

