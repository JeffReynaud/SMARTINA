"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useFolders } from "@/hooks/use-folders"
import { CreateProjectDialog } from "./create-project-dialog"
import { BoardView } from "./board-view"
import { GanttView } from "./gantt-view"

export function FolderView({ folderId }: { folderId: string }) {
  const { folders } = useFolders()
  const folder = folders.find((f) => f.id === folderId)
  const [activeView, setActiveView] = useState<"board" | "gantt">("board")

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
        <h3 className="mt-2 text-xl font-semibold">Folder not found</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          The folder you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/dashboard">
          <Button className="apple-button">Return to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{folder.name}</h2>
          <p className="text-muted-foreground">
            {folder.projects.length} {folder.projects.length === 1 ? "project" : "projects"} in this folder
          </p>
        </div>
        <CreateProjectDialog folderId={folderId}>
          <Button className="apple-button">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>

      {folder.projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
          <h3 className="mt-2 text-xl font-semibold">No projects yet</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Create your first project in this folder to get started.
          </p>
          <CreateProjectDialog folderId={folderId}>
            <Button className="apple-button">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </CreateProjectDialog>
        </div>
      ) : activeView === "board" ? (
        <BoardView folderId={folderId} onViewChange={setActiveView} />
      ) : (
        <GanttView folderId={folderId} onViewChange={setActiveView} />
      )}
    </div>
  )
}

