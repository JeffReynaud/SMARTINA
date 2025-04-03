"use client"

import { useState } from "react"
import { Edit, Save, Trash, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFolders } from "@/hooks/use-folders"
import { AddCustomAttributeDialog } from "./add-custom-attribute-dialog"

export function SubprojectView({
  folderId,
  projectId,
  subprojectId,
  onBack,
}: {
  folderId: string
  projectId: string
  subprojectId: string
  onBack: () => void
}) {
  const { folders, updateSubproject, deleteSubproject, getAllStatuses } = useFolders()
  const folder = folders.find((f) => f.id === folderId)
  const project = folder?.projects.find((p) => p.id === projectId)
  const subproject = project?.subprojects?.find((s) => s.id === subprojectId)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(subproject?.name || "")
  const [description, setDescription] = useState(subproject?.description || "")
  const [startDate, setStartDate] = useState(
    subproject?.startDate ? new Date(subproject.startDate).toISOString().split("T")[0] : "",
  )
  const [endDate, setEndDate] = useState(
    subproject?.endDate ? new Date(subproject.endDate).toISOString().split("T")[0] : "",
  )
  const [status, setStatus] = useState(subproject?.status || "BACKLOG")
  const [customAttributes, setCustomAttributes] = useState(subproject?.customAttributes || {})

  const allStatuses = getAllStatuses()

  // Format project dates for validation
  const formattedProjectStartDate = project?.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""
  const formattedProjectEndDate = project?.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""

  if (!folder || !project || !subproject) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
        <h3 className="mt-2 text-xl font-semibold">Subproject not found</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          The subproject you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={onBack} className="apple-button">
          Back to Project
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    if (name.trim()) {
      updateSubproject(folderId, projectId, subprojectId, {
        ...subproject,
        name,
        description,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        status,
        customAttributes,
      })
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this subproject?")) {
      deleteSubproject(folderId, projectId, subprojectId)
      onBack()
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
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            ← Back to {project.name}
          </Button>
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-semibold h-auto text-xl apple-input"
            />
          ) : (
            <h2 className="text-2xl font-semibold tracking-tight">{subproject.name}</h2>
          )}
          <div className="flex items-center gap-2">
            {isEditing ? (
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
            ) : (
              <Badge className={`rounded-full px-3 py-1 ${getStatusColor(subproject.status)}`}>
                {subproject.status}
              </Badge>
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

      <Card className="apple-card">
        <CardHeader>
          <CardTitle>Subproject Information</CardTitle>
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
              <p className="text-sm text-muted-foreground">{subproject.description || "No description provided."}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={formattedProjectStartDate}
                    max={formattedProjectEndDate}
                    className="apple-input"
                  />
                  {formattedProjectStartDate && (
                    <p className="text-xs text-muted-foreground">
                      Must be after project start ({formattedProjectStartDate})
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {subproject.startDate ? new Date(subproject.startDate).toLocaleDateString() : "Not set"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || formattedProjectStartDate}
                    max={formattedProjectEndDate}
                    className="apple-input"
                  />
                  {formattedProjectEndDate && (
                    <p className="text-xs text-muted-foreground">
                      Must be before project end ({formattedProjectEndDate})
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {subproject.endDate ? new Date(subproject.endDate).toLocaleDateString() : "Not set"}
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
          {Object.keys(subproject.customAttributes).length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom attributes added yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(subproject.customAttributes).map(([key, value]) => (
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
    </div>
  )
}

