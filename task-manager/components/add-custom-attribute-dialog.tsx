"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddCustomAttributeDialog({
  children,
  onAdd,
}: {
  children: React.ReactNode
  onAdd: (key: string) => void
}) {
  const [attributeName, setAttributeName] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (attributeName.trim()) {
      onAdd(attributeName.trim())
      setAttributeName("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Custom Attribute</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attribute-name">Attribute Name</Label>
            <Input
              id="attribute-name"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              placeholder="Enter attribute name"
              className="apple-input"
              required
            />
          </div>
          <Button type="submit" className="w-full apple-button">
            Add Attribute
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

