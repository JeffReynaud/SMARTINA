"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFolders } from "@/hooks/use-folders"

export function DashboardHeader() {
  const pathname = usePathname()
  const { folders } = useFolders()
  const [searchQuery, setSearchQuery] = useState("")

  // Extract current folder and project from pathname
  const pathParts = pathname.split("/").filter(Boolean)
  const isInFolder = pathParts.length >= 2 && pathParts[0] === "dashboard"
  const isInProject = pathParts.length >= 3 && pathParts[0] === "dashboard"
  const isInGantt = pathParts.length === 2 && pathParts[1] === "gantt"

  const folderId = isInFolder ? pathParts[1] : null
  const projectId = isInProject ? pathParts[2] : null

  const currentFolder = folderId ? folders.find((folder) => folder.id === folderId) : null

  const currentProject =
    currentFolder && projectId ? currentFolder.projects.find((project) => project.id === projectId) : null

  let title = "Dashboard"
  if (isInGantt) {
    title = "Gantt View"
  } else if (currentProject) {
    title = currentProject.name
  } else if (currentFolder) {
    title = currentFolder.name
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 rounded-lg bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

