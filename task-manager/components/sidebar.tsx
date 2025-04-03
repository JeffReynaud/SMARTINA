"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, FolderPlus, Home, LayoutGrid, Plus, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useFolders } from "@/hooks/use-folders"
import { CreateFolderDialog } from "./create-folder-dialog"

export function Sidebar() {
  const pathname = usePathname()
  const { folders } = useFolders()
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({})

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  // Safe path comparison function that doesn't use regex
  const isActivePath = (path: string) => {
    return pathname === path
  }

  // Safe path comparison for folder paths
  const isFolderActive = (folderId: string) => {
    const folderPath = `/dashboard/${folderId}`
    return pathname === folderPath || pathname.startsWith(`${folderPath}/`)
  }

  // Safe path comparison for project paths
  const isProjectActive = (folderId: string, projectId: string) => {
    const projectPath = `/dashboard/${folderId}/${projectId}`
    return pathname === projectPath
  }

  return (
    <div className="w-64 border-r bg-secondary/30 h-screen flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">TaskSmart</h2>
      </div>
      <div className="p-4">
        <CreateFolderDialog>
          <Button className="w-full justify-start rounded-lg" variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </CreateFolderDialog>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <Link href="/dashboard">
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActivePath("/dashboard") ? "bg-apple-blue text-white" : "hover:bg-secondary",
              )}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/dashboard/gantt">
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActivePath("/dashboard/gantt") ? "bg-apple-blue text-white" : "hover:bg-secondary",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Gantt View</span>
            </div>
          </Link>

          <div className="pt-4">
            <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">Folders</h3>
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id} className="space-y-1">
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                      isFolderActive(folder.id) ? "bg-apple-blue text-white" : "hover:bg-secondary",
                    )}
                    onClick={() => toggleFolder(folder.id)}
                  >
                    <div className="flex items-center gap-2">
                      {openFolders[folder.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <Link href={`/dashboard/${folder.id}`} className="flex-1">
                        <span>{folder.name}</span>
                      </Link>
                    </div>
                    <CreateProjectDialog folderId={folder.id}>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </CreateProjectDialog>
                  </div>
                  {openFolders[folder.id] && folder.projects.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {folder.projects.map((project) => (
                        <Link key={project.id} href={`/dashboard/${folder.id}/${project.id}`}>
                          <div
                            className={cn(
                              "rounded-lg px-3 py-2 text-sm transition-colors",
                              isProjectActive(folder.id, project.id)
                                ? "bg-apple-blue text-white"
                                : "hover:bg-secondary",
                            )}
                          >
                            {project.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Link href="/settings">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

function CreateProjectDialog({
  children,
  folderId,
}: {
  children: React.ReactNode
  folderId: string
}) {
  const { addProject } = useFolders()
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      addProject(folderId, {
        id: Date.now().toString(),
        name,
        description: "",
        startDate: null,
        endDate: null,
        status: "BACKLOG",
        customAttributes: {},
        subprojects: [],
      })
      setName("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="apple-input"
            />
          </div>
          <Button type="submit" className="w-full apple-button">
            Create Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

