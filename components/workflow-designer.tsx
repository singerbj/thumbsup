"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
  Clock,
  Users,
  CheckCircle,
  Eye,
  FileEdit,
  Send,
} from "lucide-react";
import { WorkflowTemplate, WorkflowStep, ContentType } from "@/types/workflow";
import {
  defaultWorkflowTemplates,
  getWorkflowTemplatesByContentType,
} from "@/lib/workflow-templates";

interface WorkflowDesignerProps {
  contentType: ContentType;
  onSave: (template: WorkflowTemplate) => void;
  existingTemplate?: WorkflowTemplate;
}

const stepTypeIcons = {
  approval: CheckCircle,
  review: Eye,
  edit: FileEdit,
  publish: Send,
};

const stepTypeColors = {
  approval: "bg-green-100 text-green-800",
  review: "bg-blue-100 text-blue-800",
  edit: "bg-yellow-100 text-yellow-800",
  publish: "bg-purple-100 text-purple-800",
};

const roleOptions = [
  "content_creator",
  "content_manager",
  "brand_manager",
  "legal_counsel",
  "executive",
  "social_media_manager",
  "editor",
  "copywriter",
  "designer",
  "marketing_manager",
  "marketing_director",
];

export function WorkflowDesigner({
  contentType,
  onSave,
  existingTemplate,
}: WorkflowDesignerProps) {
  const [template, setTemplate] = useState<WorkflowTemplate>(
    existingTemplate || {
      id: `custom_${Date.now()}`,
      name: "",
      description: "",
      contentType,
      organizationId: "org-1",
      steps: [],
      active: true,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user-1",
    }
  );

  const [editingStep, setEditingStep] = useState<string | null>(null);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: "New Step",
      description: "",
      order: template.steps.length + 1,
      type: "review",
      required: true,
      assigneeRoles: [],
      timeLimit: 24,
    };

    setTemplate({
      ...template,
      steps: [...template.steps, newStep],
    });
    setEditingStep(newStep.id);
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setTemplate({
      ...template,
      steps: template.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    });
  };

  const deleteStep = (stepId: string) => {
    setTemplate({
      ...template,
      steps: template.steps
        .filter((step) => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index + 1 })),
    });
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    const currentIndex = template.steps.findIndex((step) => step.id === stepId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === template.steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...template.steps];
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Ensure targetIndex is within bounds
    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      // Swap steps
      [newSteps[currentIndex], newSteps[targetIndex]] = [
        newSteps[targetIndex],
        newSteps[currentIndex],
      ];
    }

    // Update order
    newSteps.forEach((step, index) => {
      step.order = index + 1;
    });

    setTemplate({
      ...template,
      steps: newSteps,
    });
  };

  const handleSave = () => {
    if (!template.name.trim()) {
      alert("Please enter a workflow name");
      return;
    }

    if (template.steps.length === 0) {
      alert("Please add at least one step");
      return;
    }

    onSave({
      ...template,
      updatedAt: new Date().toISOString(),
    });
  };

  const loadTemplate = (templateId: string) => {
    const existingTemplate = defaultWorkflowTemplates[templateId];
    if (existingTemplate) {
      setTemplate({
        ...existingTemplate,
        id: `custom_${Date.now()}`,
        name: `${existingTemplate.name} (Copy)`,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const availableTemplates = getWorkflowTemplatesByContentType(contentType);

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Configuration</CardTitle>
          <CardDescription>
            Design a custom workflow for {contentType.replace("_", " ")} content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template-name">Workflow Name</Label>
              <Input
                id="template-name"
                value={template.name}
                onChange={(e) =>
                  setTemplate({ ...template, name: e.target.value })
                }
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <Label htmlFor="load-template">Load Existing Template</Label>
              <Select onValueChange={loadTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template to start with" />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((tmpl) => (
                    <SelectItem key={tmpl.id} value={tmpl.id}>
                      {tmpl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={template.description}
              onChange={(e) =>
                setTemplate({ ...template, description: e.target.value })
              }
              placeholder="Describe this workflow"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="template-active"
              checked={template.active}
              onCheckedChange={(checked) =>
                setTemplate({ ...template, active: checked })
              }
            />
            <Label htmlFor="template-active">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workflow Steps</CardTitle>
              <CardDescription>
                Define the steps in your approval workflow
              </CardDescription>
            </div>
            <Button onClick={addStep}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {template.steps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileEdit className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No steps defined yet. Add your first step to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {template.steps.map((step, index) => (
                <WorkflowStepCard
                  key={step.id}
                  step={step}
                  isFirst={index === 0}
                  isLast={index === template.steps.length - 1}
                  isEditing={editingStep === step.id}
                  onEdit={() => setEditingStep(step.id)}
                  onSave={() => setEditingStep(null)}
                  onCancel={() => setEditingStep(null)}
                  onUpdate={(updates) => updateStep(step.id, updates)}
                  onDelete={() => deleteStep(step.id)}
                  onMove={(direction) => moveStep(step.id, direction)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Workflow
        </Button>
      </div>
    </div>
  );
}

interface WorkflowStepCardProps {
  step: WorkflowStep;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (updates: Partial<WorkflowStep>) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}

function WorkflowStepCard({
  step,
  isFirst,
  isLast,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onDelete,
  onMove,
}: WorkflowStepCardProps) {
  const StepIcon = stepTypeIcons[step.type];

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {step.order}
                </span>
              </div>
              <Input
                value={step.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="font-medium"
                placeholder="Step name"
              />
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={onSave}>
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Description</Label>
            <Textarea
              value={step.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe what happens in this step"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Step Type</Label>
              <Select
                value={step.type}
                onValueChange={(value: any) => onUpdate({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="publish">Publish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Time Limit (hours)</Label>
              <Input
                type="number"
                value={step.timeLimit || ""}
                onChange={(e) =>
                  onUpdate({ timeLimit: Number(e.target.value) })
                }
                placeholder="24"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                checked={step.required}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label>Required</Label>
            </div>
          </div>

          <div>
            <Label>Assignee Roles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {roleOptions.map((role) => (
                <Badge
                  key={role}
                  variant={
                    step.assigneeRoles.includes(role) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    const roles = step.assigneeRoles.includes(role)
                      ? step.assigneeRoles.filter((r) => r !== role)
                      : [...step.assigneeRoles, role];
                    onUpdate({ assigneeRoles: roles });
                  }}
                >
                  {role.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {step.order}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium">{step.name}</h4>
                <Badge className={stepTypeColors[step.type]}>
                  <StepIcon className="w-3 h-3 mr-1" />
                  {step.type}
                </Badge>
                {step.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>

              {step.description && (
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
              )}

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {step.timeLimit && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{step.timeLimit}h limit</span>
                  </div>
                )}

                {step.assigneeRoles.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{step.assigneeRoles.length} roles</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMove("up")}
              disabled={isFirst}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onMove("down")}
              disabled={isLast}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
