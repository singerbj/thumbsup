"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface CreateWorkstreamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateWorkstreamDialog({ open, onOpenChange }: CreateWorkstreamDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const queryClient = useQueryClient()

  const createWorkstreamMutation = useMutation({
    mutationFn: api.createWorkstream,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workstreams"] })
      toast({
        title: "Success",
        description: "Workstream created successfully",
      })
      setName("")
      setDescription("")
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workstream. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to create workstream:", error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    createWorkstreamMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      status: "active",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workstream</DialogTitle>
          <DialogDescription>Create a new workstream to organize your projects and content.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workstream name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this workstream"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || createWorkstreamMutation.isPending}>
              {createWorkstreamMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workstream"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
