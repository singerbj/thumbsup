"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [workstreamId, setWorkstreamId] = useState("")

  const queryClient = useQueryClient()

  const { data: workstreams = [], isLoading: workstreamsLoading } = useQuery({
    queryKey: ["workstreams"],
    queryFn: api.getWorkstreams,
    enabled: open, // Only fetch when dialog is open
  })

  const createProjectMutation = useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast({
        title: "Success",
        description: "Project created successfully",
      })
      setName("")
      setDescription("")
      setWorkstreamId("")
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to create project:", error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !workstreamId) return

    const selectedWorkstream = workstreams.find((w) => w._id === workstreamId)
    if (!selectedWorkstream) return

    createProjectMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      status: "active",
      workstream: {
        id: selectedWorkstream._id,
        name: selectedWorkstream.name,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Create a new project within a workstream to organize your content.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workstream">Workstream</Label>
            <Select value={workstreamId} onValueChange={setWorkstreamId} required disabled={workstreamsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={workstreamsLoading ? "Loading workstreams..." : "Select a workstream"} />
              </SelectTrigger>
              <SelectContent>
                {workstreams.map((workstream) => (
                  <SelectItem key={workstream._id} value={workstream._id}>
                    {workstream.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this project"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !workstreamId || createProjectMutation.isPending}>
              {createProjectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
