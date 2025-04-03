"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, ChevronRight, Edit, Plus, Save, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFolders } from "@/hooks/use-folders"
import { AddCustomAttributeDialog } from "./add-custom-attribute-dialog"
import { ManageStatusesDialog } from "./manage-statuses-dialog"
import { CreateSubprojectDialog } from "./create-subproject-dialog"
import { SubprojectView } from "./subproject-view"

export function ProjectView({
  folderId,
  projectId,
}: {
  folderId: string
  projectId: string
}) {
  const { folders, updateProject, deleteProject, getAllStatuses } = useFolders()
  const folder = folders.find((f) => f.id === folderId)
  const project = folder?.projects.find((p) => p.id === projectId)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(project?.name || "")
  const [description, setDescription] = useState(project?.description || "")
  const [startDate, setStartDate] = useState(
    project?.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "",
  )
  const [endDate, setEndDate] = useState(project?.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "")
  const [status, setStatus] = useState(project?.status || "BACKLOG")
  const [customAttributes, setCustomAttributes] = useState(project?.customAttributes || {})
  const [activeTab, setActiveTab] = useState("details")
  const [selectedSubproject, setSelectedSubproject] = useState<string | null>(null)

  const allStatuses = getAllStatuses()

  // Check for stored subproject ID on component mount
  useEffect(() => {
    const storedSubprojectId = sessionStorage.getItem("selectedSubproject")
    if (storedSubprojectId) {
      setSelectedSubproject(storedSubprojectId)
      // Clear the stored value
      sessionStorage.removeItem("selectedSubproject")
    }
  }, [])

  if (!folder || !project) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
        <h3 className="mt-2 text-xl font-semibold">Project not found</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/dashboard">
          <Button className="apple-button">Return to Dashboard</Button>
        </Link>
      </div>
    )
  }

  // If a subproject is selected, show the subproject view
  if (selectedSubproject) {
    return (
      <SubprojectView
        folderId={folderId}
        projectId={projectId}
        subprojectId={selectedSubproject}
        onBack={() => {
          setSelectedSubproject(null)
        }}
      />
    )
  }

  const handleSave = () => {
    if (name.trim()) {
      updateProject(folderId, projectId, {
        ...project,
        name,
        description,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        status,
        customAttributes,
        subprojects: project.subprojects || [],
      })
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(folderId, projectId)
      window.location.href = `/dashboard/${folderId}`
    }
  }

  const handleCustomAttributeChange = (key: string, value: string) => {
    setCustomAttributes((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const addCustomAttribute = (key: string) => {
    setCustomAttributes((prev) => ({
      ...prev,
      [key]: "",
    }))
  }

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
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-semibold h-auto text-xl apple-input"
            />
          ) : (
            <h2 className="text-2xl font-semibold tracking-tight">{project.name}</h2>
          )}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px] h-7 text-xs apple-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {allStatuses.map((statusOption) => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ManageStatusesDialog>
                  <Button variant="outline" size="sm" className="h-7 rounded-full">
                    <Plus className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </ManageStatusesDialog>
              </div>
            ) : (
              <Badge className={`rounded-full px-3 py-1 ${getStatusColor(project.status)}`}>{project.status}</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Button onClick={handleSave} className="apple-button">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="apple-button bg-apple-gray-1 hover:bg-apple-gray-1/90"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="rounded-full bg-apple-red hover:bg-apple-red/90"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rounded-full bg-apple-gray-6 p-1">
          <TabsTrigger
            value="details"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="subprojects"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Subprojects
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 pt-4">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Description</Label>
                {isEditing ? (
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="apple-input min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{project.description || "No description provided."}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="apple-input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="apple-input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="apple-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Custom Attributes</CardTitle>
              {isEditing && (
                <AddCustomAttributeDialog onAdd={addCustomAttribute}>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attribute
                  </Button>
                </AddCustomAttributeDialog>
              )}
            </CardHeader>
            <CardContent>
              {Object.keys(project.customAttributes).length === 0 ? (
                <p className="text-sm text-muted-foreground">No custom attributes added yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(project.customAttributes).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label>{key}</Label>
                      {isEditing ? (
                        <Input
                          value={customAttributes[key] || ""}
                          onChange={(e) => handleCustomAttributeChange(key, e.target.value)}
                          className="apple-input"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{value || "Not set"}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subprojects" className="space-y-6 pt-4">
          <Card className="apple-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Subprojects</CardTitle>
              <CreateSubprojectDialog
                folderId={folderId}
                projectId={projectId}
                projectStartDate={project.startDate}
                projectEndDate={project.endDate}
              >
                <Button className="apple-button">
                  <Plus className="mr-2 h-4 w-4" />
                  New Subproject
                </Button>
              </CreateSubprojectDialog>
            </CardHeader>
            <CardContent>
              {!project.subprojects || project.subprojects.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
                  <h3 className="mt-2 text-xl font-semibold">No subprojects yet</h3>
                  <p className="mb-4 mt-1 text-sm text-muted-foreground">
                    Create your first subproject to break down this project into smaller pieces.
                  </p>
                  <CreateSubprojectDialog
                    folderId={folderId}
                    projectId={projectId}
                    projectStartDate={project.startDate}
                    projectEndDate={project.endDate}
                  >
                    <Button className="apple-button">
                      <Plus className="mr-2 h-4 w-4" />
                      New Subproject
                    </Button>
                  </CreateSubprojectDialog>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.subprojects.map((subproject) => (
                    <div
                      key={subproject.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedSubproject(subproject.id)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{subproject.name}</h3>
                          <Badge className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(subproject.status)}`}>
                            {subproject.status}
                          </Badge>
                        </div>
                        {subproject.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{subproject.description}</p>
                        )}
                        {subproject.startDate && subproject.endDate && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>
                              {new Date(subproject.startDate).toLocaleDateString()} -{" "}
                              {new Date(subproject.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Task management will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

