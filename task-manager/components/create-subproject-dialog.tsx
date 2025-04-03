"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFolders, DEFAULT_STATUSES } from "@/hooks/use-folders"

export function CreateSubprojectDialog({
  children,
  folderId,
  projectId,
  projectStartDate,
  projectEndDate,
}: {
  children: React.ReactNode
  folderId: string
  projectId: string
  projectStartDate: string | null
  projectEndDate: string | null
}) {
  const { addSubproject, getAllStatuses } = useFolders()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState(DEFAULT_STATUSES[0])
  const [open, setOpen] = useState(false)

  const allStatuses = getAllStatuses()

  // Format dates for the input min/max attributes
  const formattedProjectStartDate = projectStartDate ? new Date(projectStartDate).toISOString().split("T")[0] : ""
  const formattedProjectEndDate = projectEndDate ? new Date(projectEndDate).toISOString().split("T")[0] : ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      addSubproject(folderId, projectId, {
        id: Date.now().toString(),
        name,
        description,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        status,
        customAttributes: {},
      })
      setName("")
      setDescription("")
      setStartDate("")
      setEndDate("")
      setStatus(DEFAULT_STATUSES[0])
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Subproject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subproject-name">Subproject Name</Label>
            <Input
              id="subproject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subproject name"
              className="apple-input"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subproject-description">Description</Label>
            <Textarea
              id="subproject-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter subproject description"
              className="apple-input min-h-[80px]"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subproject-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="subproject-status" className="apple-input">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
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
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || formattedProjectStartDate}
                max={formattedProjectEndDate}
                className="apple-input"
              />
              {formattedProjectEndDate && (
                <p className="text-xs text-muted-foreground">Must be before project end ({formattedProjectEndDate})</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full apple-button">
            Create Subproject
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

