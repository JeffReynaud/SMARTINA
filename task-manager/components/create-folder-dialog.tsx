"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFolders } from "@/hooks/use-folders"

export function CreateFolderDialog({ children }: { children: React.ReactNode }) {
  const { addFolder } = useFolders()
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      addFolder({
        id: Date.now().toString(),
        name,
        projects: [],
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
          <DialogTitle className="text-xl">Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              className="apple-input"
            />
          </div>
          <Button type="submit" className="w-full apple-button">
            Create Folder
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

