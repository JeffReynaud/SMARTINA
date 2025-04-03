"use client"

import { useState } from "react"
import { Filter, MoreHorizontal, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useFolders } from "@/hooks/use-folders"
import { CreateProjectDialog } from "./create-project-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Project = {
  id: string
  name: string
  description: string
  startDate: string | null
  endDate: string | null
  status: string
  customAttributes: Record<string, string>
  subprojects: any[]
  folderId?: string
  folderName?: string
}

type BoardViewProps = {
  folderId?: string
  onViewChange?: (view: string) => void
}

export function BoardView({ folderId, onViewChange }: BoardViewProps) {
  const { folders, getAllStatuses } = useFolders()
  const allStatuses = getAllStatuses()

  // Get projects based on whether we're in a folder or dashboard
  const projects: Project[] = folderId
    ? folders.find((f) => f.id === folderId)?.projects || []
    : folders.flatMap((folder) =>
        folder.projects.map((project) => ({
          ...project,
          folderId: folder.id,
          folderName: folder.name,
        })),
      )

  // Group projects by status
  const projectsByStatus = allStatuses.reduce(
    (acc, status) => {
      acc[status] = projects.filter((project) => project.status === status)
      return acc
    },
    {} as Record<string, Project[]>,
  )

  // State for visible columns (attributes)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["startDate", "endDate", "comments"])

  // Get all possible attribute columns (built-in + custom from all projects)
  const allAttributes = ["startDate", "endDate", "comments"]
  projects.forEach((project) => {
    Object.keys(project.customAttributes).forEach((attr) => {
      if (!allAttributes.includes(attr)) {
        allAttributes.push(attr)
      }
    })
  })

  // State for filters
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  // Apply filters
  const filteredStatuses =
    statusFilter.length > 0 ? allStatuses.filter((status) => statusFilter.includes(status)) : allStatuses

  // Function to format date display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"

    const date = new Date(dateString)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // If date is today
    if (date.toDateString() === now.toDateString()) {
      return "Hoy"
    }

    // If date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana"
    }

    // If date is within the last week
    const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (daysAgo > 0 && daysAgo < 7) {
      return `Hace ${daysAgo} día${daysAgo > 1 ? "s" : ""}`
    }

    // Otherwise return formatted date
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    })
  }

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "BACKLOG":
        return "bg-apple-gray-1"
      case "IN PROGRESS":
        return "bg-apple-blue"
      case "READY FOR REVIEW":
        return "bg-apple-orange"
      case "DONE":
        return "bg-apple-green"
      default:
        return "bg-apple-purple"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onViewChange && (
            <div className="flex items-center bg-apple-gray-6 p-1 rounded-full">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3 bg-white shadow-sm"
                onClick={() => onViewChange("board")}
              >
                Board
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-3" onClick={() => onViewChange("gantt")}>
                Gantt
              </Button>
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2 rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {allStatuses.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setStatusFilter((prev) => [...prev, status])
                            } else {
                              setStatusFilter((prev) => prev.filter((s) => s !== status))
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status}`}>{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Columns</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {allAttributes.map((attr) => (
                      <div key={attr} className="flex items-center space-x-2">
                        <Checkbox
                          id={`attr-${attr}`}
                          checked={visibleColumns.includes(attr)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setVisibleColumns((prev) => [...prev, attr])
                            } else {
                              setVisibleColumns((prev) => prev.filter((a) => a !== attr))
                            }
                          }}
                        />
                        <Label htmlFor={`attr-${attr}`}>
                          {attr === "startDate"
                            ? "Start Date"
                            : attr === "endDate"
                              ? "End Date"
                              : attr === "comments"
                                ? "Comments"
                                : attr}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-8">
        {filteredStatuses.map((status) => (
          <div key={status} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getStatusColor(status)} rounded-full w-6 h-6 flex items-center justify-center p-0`}
                >
                  <span className="sr-only">{status}</span>
                </Badge>
                <h3 className="font-medium text-lg">{status}</h3>
                <Badge variant="outline" className="rounded-full">
                  {projectsByStatus[status]?.length || 0}
                </Badge>
              </div>
              {folderId && (
                <CreateProjectDialog folderId={folderId} initialStatus={status}>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </CreateProjectDialog>
              )}
            </div>

            <Card className="apple-card">
              {projectsByStatus[status]?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Project Name</TableHead>
                      {visibleColumns.includes("startDate") && <TableHead>Start Date</TableHead>}
                      {visibleColumns.includes("endDate") && <TableHead>End Date</TableHead>}
                      {visibleColumns.includes("comments") && <TableHead>Comments</TableHead>}
                      {/* Custom attribute columns */}
                      {allAttributes
                        .filter(
                          (attr) =>
                            visibleColumns.includes(attr) && !["startDate", "endDate", "comments"].includes(attr),
                        )
                        .map((attr) => (
                          <TableHead key={attr}>{attr}</TableHead>
                        ))}
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsByStatus[status].map((project) => (
                      <TableRow key={project.id} className="hover:bg-secondary/30">
                        <TableCell>
                          <Link
                            href={`/dashboard/${project.folderId || folderId}/${project.id}`}
                            className="flex items-center gap-2 hover:underline"
                          >
                            <Badge
                              className={`${getStatusColor(status)} rounded-full w-5 h-5 flex items-center justify-center p-0`}
                            >
                              <span className="sr-only">{status}</span>
                            </Badge>
                            <span>{project.name}</span>
                          </Link>
                          {!folderId && project.folderName && (
                            <div className="text-xs text-muted-foreground ml-7 mt-1">Folder: {project.folderName}</div>
                          )}
                        </TableCell>

                        {visibleColumns.includes("startDate") && <TableCell>{formatDate(project.startDate)}</TableCell>}

                        {visibleColumns.includes("endDate") && <TableCell>{formatDate(project.endDate)}</TableCell>}

                        {visibleColumns.includes("comments") && (
                          <TableCell>
                            <Badge variant="outline" className="rounded-full h-5 px-2">
                              3
                            </Badge>
                          </TableCell>
                        )}

                        {/* Custom attribute values */}
                        {allAttributes
                          .filter(
                            (attr) =>
                              visibleColumns.includes(attr) && !["startDate", "endDate", "comments"].includes(attr),
                          )
                          .map((attr) => (
                            <TableCell key={attr}>{project.customAttributes[attr] || "—"}</TableCell>
                          ))}

                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Add task row */}
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length + 2}>
                        {folderId ? (
                          <CreateProjectDialog folderId={folderId} initialStatus={status}>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-8">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Task
                            </Button>
                          </CreateProjectDialog>
                        ) : (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            Select a folder to add tasks
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <CardContent className="text-center py-6">
                  <p className="text-muted-foreground">No projects with this status</p>
                  {folderId && (
                    <CreateProjectDialog folderId={folderId} initialStatus={status}>
                      <Button variant="outline" className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </CreateProjectDialog>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

