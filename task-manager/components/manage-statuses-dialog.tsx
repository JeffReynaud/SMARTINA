"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFolders, DEFAULT_STATUSES } from "@/hooks/use-folders"

export function ManageStatusesDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const { customStatuses, addCustomStatus, deleteCustomStatus } = useFolders()
  const [newStatus, setNewStatus] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newStatus.trim()) {
      addCustomStatus(newStatus.trim().toUpperCase())
      setNewStatus("")
    }
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Statuses</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Default Statuses (Cannot be removed)</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_STATUSES.map((status) => (
                <Badge key={status} className={`rounded-full px-3 py-1 ${getStatusColor(status)}`}>
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Custom Statuses</Label>
            {customStatuses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No custom statuses added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {customStatuses.map((status) => (
                  <div key={status} className="flex items-center gap-1">
                    <Badge className={`rounded-full px-3 py-1 ${getStatusColor(status)}`}>{status}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => deleteCustomStatus(status)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-status">Add New Status</Label>
              <div className="flex gap-2">
                <Input
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="Enter status name"
                  className="apple-input"
                />
                <Button type="submit" className="apple-button">
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Status names will be converted to uppercase.</p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

