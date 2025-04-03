"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useFolders } from "@/hooks/use-folders"

export function ProjectsOverview() {
  const { folders } = useFolders()
  const allProjects = folders.flatMap((folder) =>
    folder.projects.map((project) => ({
      ...project,
      folderId: folder.id,
      folderName: folder.name,
    })),
  )

  // Function to get the appropriate color for the status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "BACKLOG":
        return "bg-apple-gray-1 hover:bg-apple-gray-1/90"
      case "IN PROGRESS":
        return "bg-apple-blue hover:bg-apple-blue/90"
      case "READY FOR REVIEW":
        return "bg-apple-orange hover:bg-apple-orange/90"
      case "DONE":
        return "bg-apple-green hover:bg-apple-green/90"
      default:
        return "bg-apple-purple hover:bg-apple-purple/90"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Projects Overview</h2>
        <p className="text-muted-foreground">Here's a summary of all your projects across folders.</p>
      </div>

      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
          <h3 className="mt-2 text-xl font-semibold">No folders yet</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Create your first folder to get started with organizing your projects.
          </p>
        </div>
      ) : allProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
          <h3 className="mt-2 text-xl font-semibold">No projects yet</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Create your first project in one of your folders to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => (
            <Link key={project.id} href={`/dashboard/${project.folderId}/${project.id}`}>
              <Card className="apple-card hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription>Folder: {project.folderName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.startDate && project.endDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2 rounded-full bg-apple-gray-5">
                        <div className="h-full bg-apple-blue rounded-full" style={{ width: "25%" }} />
                      </Progress>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

