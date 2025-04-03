"use client"

import type React from "react"

import { useRef, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useFolders } from "@/hooks/use-folders"

type GanttItem = {
  id: string
  name: string
  startDate: string | null
  endDate: string | null
  status: string
  folderId: string
  projectId: string
  subprojectId?: string
  isSubproject: boolean
  level: number
  parentId?: string
  isExpanded?: boolean
}

type GanttViewProps = {
  folderId?: string
  onViewChange?: (view: string) => void
}

export function GanttView({ folderId, onViewChange }: GanttViewProps) {
  const { folders } = useFolders()
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})

  // Get projects and organize them hierarchically when in folder view
  const getGanttItems = (): GanttItem[] => {
    if (folderId) {
      // In folder view - organize hierarchically
      const folder = folders.find((f) => f.id === folderId)
      if (!folder) return []

      const items: GanttItem[] = []

      // Add projects first
      folder.projects.forEach((project) => {
        // Add the project
        items.push({
          id: project.id,
          name: project.name,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          folderId: folder.id,
          projectId: project.id,
          isSubproject: false,
          level: 0,
          isExpanded: expandedProjects[project.id] !== false, // Default to expanded
        })

        // Add subprojects if the project is expanded
        if (expandedProjects[project.id] !== false && project.subprojects?.length > 0) {
          project.subprojects.forEach((subproject) => {
            items.push({
              id: subproject.id,
              name: subproject.name,
              startDate: subproject.startDate,
              endDate: subproject.endDate,
              status: subproject.status,
              folderId: folder.id,
              projectId: project.id,
              subprojectId: subproject.id,
              isSubproject: true,
              level: 1,
              parentId: project.id,
            })
          })
        }
      })

      return items
    } else {
      // In dashboard view - flat list with folder info
      return folders.flatMap((folder) => {
        // Get all projects
        const projects = folder.projects.map((project) => ({
          id: project.id,
          name: project.name,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          folderId: folder.id,
          projectId: project.id,
          isSubproject: false,
          level: 0,
        }))

        // Get all subprojects
        const subprojects = folder.projects.flatMap((project) =>
          (project.subprojects || []).map((subproject) => ({
            id: subproject.id,
            name: `${folder.name} > ${project.name} > ${subproject.name}`,
            startDate: subproject.startDate,
            endDate: subproject.endDate,
            status: subproject.status,
            folderId: folder.id,
            projectId: project.id,
            subprojectId: subproject.id,
            isSubproject: true,
            level: 1,
          })),
        )

        return [...projects, ...subprojects]
      })
    }
  }

  const allItems = getGanttItems()
  const filteredItems = allItems.filter((item) => item.startDate && item.endDate)

  const [viewMode, setViewMode] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const { getAllStatuses } = useFolders()
  const allStatuses = getAllStatuses()

  // Apply status filter
  const filteredByStatus =
    statusFilter.length > 0 ? filteredItems.filter((item) => statusFilter.includes(item.status)) : filteredItems

  // Calculate date range based on view mode
  const getDateRange = () => {
    const dates = []
    const startDate = new Date(currentDate)

    if (viewMode === "month") {
      startDate.setDate(1)
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)
      endDate.setDate(0)

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d))
      }
    } else if (viewMode === "week") {
      // Set to beginning of week (Sunday)
      const day = startDate.getDay()
      startDate.setDate(startDate.getDate() - day)

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        dates.push(date)
      }
    }

    return dates
  }

  const dateRange = getDateRange()

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const formatDateHeader = (date: Date) => {
    if (viewMode === "month") {
      return date.getDate().toString()
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
    }
  }

  const getItemPosition = (item: any) => {
    if (!item.startDate || !item.endDate) return null

    const startDate = new Date(item.startDate)
    const endDate = new Date(item.endDate)

    // Check if item is in current view
    const viewStartDate = dateRange[0]
    const viewEndDate = dateRange[dateRange.length - 1]

    if (endDate < viewStartDate || startDate > viewEndDate) {
      return null
    }

    // Calculate position
    const start = Math.max(0, Math.floor((startDate.getTime() - viewStartDate.getTime()) / (1000 * 60 * 60 * 24)))

    const end = Math.min(
      dateRange.length - 1,
      Math.ceil((endDate.getTime() - viewStartDate.getTime()) / (1000 * 60 * 60 * 24)),
    )

    const width = end - start + 1

    return { start, width, status: item.status }
  }

  // Function to get the appropriate color for the status
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

  // Toggle project expansion
  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !(prev[projectId] !== false), // Toggle from the current state
    }))
  }

  // Safe navigation function
  const handleItemClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault()

    if (!item.isSubproject && folderId) {
      // If it's a project in folder view, toggle expansion
      toggleProjectExpansion(item.id)
      return
    }

    // Navigate to the project page
    const projectUrl = `/dashboard/${item.folderId}/${item.projectId}`

    // For subprojects, we'll use a state variable instead of URL parameters
    if (item.isSubproject) {
      // Store the subproject ID in sessionStorage
      sessionStorage.setItem("selectedSubproject", item.subprojectId)
    } else {
      // Clear any stored subproject ID
      sessionStorage.removeItem("selectedSubproject")
    }

    // Navigate to the URL
    window.location.href = projectUrl
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onViewChange && (
            <div className="flex items-center bg-apple-gray-6 p-1 rounded-full">
              <Button variant="ghost" size="sm" className="rounded-full px-3" onClick={() => onViewChange("board")}>
                Board
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3 bg-white shadow-sm"
                onClick={() => onViewChange("gantt")}
              >
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
                          id={`status-gantt-${status}`}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setStatusFilter((prev) => [...prev, status])
                            } else {
                              setStatusFilter((prev) => prev.filter((s) => s !== status))
                            }
                          }}
                        />
                        <Label htmlFor={`status-gantt-${status}`}>{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-4">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px] rounded-lg">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-28 text-center font-medium">
              {viewMode === "month"
                ? currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : `Week of ${dateRange[0].toLocaleDateString()}`}
            </div>
            <Button variant="outline" size="icon" onClick={navigateNext} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredByStatus.length === 0 ? (
        <Card className="apple-card">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <h3 className="mt-2 text-xl font-semibold">No projects with dates</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Add start and end dates to your projects to see them in the Gantt view.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="apple-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-auto" ref={containerRef}>
              <div className="min-w-max">
                <div className="grid grid-cols-[200px_1fr] border-b">
                  <div className="p-4 font-medium">Project</div>
                  <div className="flex border-l">
                    {dateRange.map((date, index) => (
                      <div
                        key={index}
                        className="flex-1 min-w-[40px] p-4 text-center font-medium border-r last:border-r-0"
                      >
                        {formatDateHeader(date)}
                      </div>
                    ))}
                  </div>
                </div>

                {filteredByStatus.map((item) => {
                  const position = getItemPosition(item)

                  return (
                    <div
                      key={`${item.isSubproject ? "sub-" : ""}${item.id}`}
                      className="grid grid-cols-[200px_1fr] border-b last:border-b-0"
                    >
                      <a
                        href={`/dashboard/${item.folderId}/${item.projectId}`}
                        className={`p-4 truncate hover:underline flex items-center ${item.isSubproject ? "pl-8 text-sm" : ""}`}
                        onClick={(e) => handleItemClick(item, e)}
                      >
                        {!item.isSubproject && folderId && item.subprojectId === undefined && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 mr-1 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleProjectExpansion(item.id)
                            }}
                          >
                            {expandedProjects[item.id] !== false ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {item.isSubproject && <div className="w-5 mr-1"></div>}
                        <span className={item.isSubproject ? "ml-4" : ""}>{item.name}</span>
                      </a>
                      <div className="flex relative border-l h-14">
                        {dateRange.map((_, index) => (
                          <div key={index} className="flex-1 min-w-[40px] border-r last:border-r-0" />
                        ))}

                        {position && (
                          <div
                            className={`absolute top-2 h-10 ${getStatusColor(position.status)} rounded-lg text-white text-xs flex items-center justify-center px-2 overflow-hidden ${item.isSubproject ? "ml-4" : ""}`}
                            style={{
                              left: `calc(${position.start} * 100% / ${dateRange.length} ${item.isSubproject ? "+ 16px" : ""})`,
                              width: `calc(${position.width} * 100% / ${dateRange.length} ${item.isSubproject ? "- 16px" : ""})`,
                            }}
                          >
                            {item.name}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

