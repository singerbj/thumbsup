"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  MoreHorizontal,
  X,
  CheckCircle,
  Clock,
  Users
} from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { ContentTypeSelector } from "@/components/content-type-selector"
import { WorkflowDesigner } from "@/components/workflow-designer"
import { WorkflowViewer } from "@/components/workflow-viewer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { defaultWorkflowTemplates } from "@/lib/workflow-templates"
import { contentCategories } from "@/lib/content-types"
import { WorkflowTemplate, ContentType } from "@/types/workflow"

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDesigner, setShowDesigner] = useState(false)
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null)
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>(Object.values(defaultWorkflowTemplates))

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.contentType.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedCategory === "all") return matchesSearch
    
    // Filter by content category
    const contentTypeConfig = require('@/lib/content-types').getContentTypeConfig(workflow.contentType)
    return matchesSearch && contentTypeConfig?.category === selectedCategory
  })

  const handleCreateWorkflow = (contentType: ContentType) => {
    setSelectedContentType(contentType)
    setEditingTemplate(null)
    setShowCreateDialog(false)
    setShowDesigner(true)
  }

  const handleEditWorkflow = (template: WorkflowTemplate) => {
    setSelectedContentType(template.contentType)
    setEditingTemplate(template)
    setShowDesigner(true)
  }

  const handleSaveWorkflow = (template: WorkflowTemplate) => {
    if (editingTemplate) {
      setWorkflows(workflows.map(w => w.id === template.id ? template : w))
    } else {
      setWorkflows([...workflows, template])
    }
    setShowDesigner(false)
    setEditingTemplate(null)
    setSelectedContentType(null)
  }

  const handleDuplicateWorkflow = (template: WorkflowTemplate) => {
    const duplicated = {
      ...template,
      id: `custom_${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setWorkflows([...workflows, duplicated])
  }

  const handleDeleteWorkflow = (templateId: string) => {
    setWorkflows(workflows.filter(w => w.id !== templateId))
  }

  if (showDesigner && selectedContentType) {
    return (
      <div className="min-h-screen">
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDesigner(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Back to Workflows
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {editingTemplate ? 'Edit Workflow' : 'Create Workflow'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {selectedContentType.replace('_', ' ')} workflow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <WorkflowDesigner
            contentType={selectedContentType}
            existingTemplate={editingTemplate || undefined}
            onSave={handleSaveWorkflow}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb badge={{ label: "workflows", count: filteredWorkflows.length }} />
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {contentCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Workflow</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Workflows Grid */}
        {filteredWorkflows.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first workflow"}
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WorkflowCard
                  workflow={workflow}
                  onEdit={() => handleEditWorkflow(workflow)}
                  onDuplicate={() => handleDuplicateWorkflow(workflow)}
                  onDelete={() => handleDeleteWorkflow(workflow.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
          </DialogHeader>
          <ContentTypeSelector onSelect={handleCreateWorkflow} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface WorkflowCardProps {
  workflow: WorkflowTemplate
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function WorkflowCard({ workflow, onEdit, onDuplicate, onDelete }: WorkflowCardProps) {
  const contentTypeConfig = require('@/lib/content-types').getContentTypeConfig(workflow.contentType)
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={workflow.active ? "default" : "secondary"}>
            {workflow.active ? "Active" : "Inactive"}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {!workflow.isDefault && (
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardTitle className="text-lg">{workflow.name}</CardTitle>
        <CardDescription className="text-sm">
          <span className="text-blue-600 font-medium">{contentTypeConfig?.name}</span>
          <br />
          {workflow.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Steps Preview */}
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Workflow Steps</span>
              <span>{workflow.steps.length} steps</span>
            </div>
            <div className="flex space-x-1">
              {workflow.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                  title={step.name}
                >
                  <div 
                    className={`h-full ${
                      step.type === 'approval' ? 'bg-green-400' :
                      step.type === 'review' ? 'bg-blue-400' :
                      step.type === 'edit' ? 'bg-yellow-400' :
                      'bg-purple-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{workflow.steps.reduce((acc, step) => acc + step.assigneeRoles.length, 0)} roles</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{workflow.steps.reduce((acc, step) => acc + (step.timeLimit || 0), 0)}h total</span>
              </div>
            </div>
            
            {workflow.isDefault && (
              <Badge variant="outline" className="text-xs">Default</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}