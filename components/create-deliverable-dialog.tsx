"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface CreateDeliverableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

const contentTypes = [
  { value: "instagram_post", label: "Instagram Post" },
  { value: "instagram_story", label: "Instagram Story" },
  { value: "linkedin_post", label: "LinkedIn Post" },
  { value: "twitter_post", label: "Twitter Post" },
  { value: "facebook_post", label: "Facebook Post" },
  { value: "executive_post", label: "Executive Communication" },
]

export function CreateDeliverableDialog({ open, onOpenChange, projectId }: CreateDeliverableDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [text, setText] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [mentions, setMentions] = useState("")
  const [dueDate, setDueDate] = useState("")

  const queryClient = useQueryClient()

  const createDeliverableMutation = useMutation({
    mutationFn: api.createDeliverable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverables", projectId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast({
        title: "Success",
        description: "Deliverable created successfully",
      })
      setName("")
      setType("")
      setText("")
      setHashtags("")
      setMentions("")
      setDueDate("")
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create deliverable. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to create deliverable:", error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !type) return

    createDeliverableMutation.mutate({
      projectId,
      name: name.trim(),
      type: type as any,
      content: {
        text: text.trim(),
        hashtags: hashtags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        mentions: mentions
          .split(",")
          .map((mention) => mention.trim())
          .filter(Boolean),
      },
      assignee: { name: "Current User", avatar: "CU" },
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Deliverable</DialogTitle>
          <DialogDescription>Create a new content deliverable for this project.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter deliverable name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((contentType) => (
                  <SelectItem key={contentType.value} value={contentType.value}>
                    {contentType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">Content Text</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the content text"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="Enter hashtags separated by commas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mentions">Mentions</Label>
            <Input
              id="mentions"
              value={mentions}
              onChange={(e) => setMentions(e.target.value)}
              placeholder="Enter mentions separated by commas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !type || createDeliverableMutation.isPending}>
              {createDeliverableMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Deliverable"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
