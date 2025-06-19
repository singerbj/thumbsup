"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  FileEdit, 
  Send, 
  Users,
  Calendar,
  ArrowRight
} from "lucide-react"
import { WorkflowInstance, WorkflowTemplate } from "@/types/workflow"

interface WorkflowViewerProps {
  workflowInstance: WorkflowInstance
  workflowTemplate: WorkflowTemplate
  showProgress?: boolean
  compact?: boolean
}

const stepTypeIcons = {
  approval: CheckCircle,
  review: Eye,
  edit: FileEdit,
  publish: Send
}

const stepStatusColors = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  skipped: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800"
}

const stepStatusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  skipped: AlertCircle,
  rejected: AlertCircle
}

export function WorkflowViewer({ 
  workflowInstance, 
  workflowTemplate, 
  showProgress = true,
  compact = false 
}: WorkflowViewerProps) {
  const completedSteps = workflowInstance.stepInstances.filter(
    step => step.status === 'completed'
  ).length
  
  const totalSteps = workflowTemplate.steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileEdit className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{workflowTemplate.name}</h4>
                <p className="text-sm text-gray-600">
                  {completedSteps} of {totalSteps} steps completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={stepStatusColors[workflowInstance.status === 'active' ? 'in_progress' : 'completed']}>
                {workflowInstance.status}
              </Badge>
              <div className="w-16">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileEdit className="w-5 h-5" />
              <span>{workflowTemplate.name}</span>
            </CardTitle>
            <CardDescription>{workflowTemplate.description}</CardDescription>
          </div>
          
          <Badge className={stepStatusColors[workflowInstance.status === 'active' ? 'in_progress' : 'completed']}>
            {workflowInstance.status}
          </Badge>
        </div>
        
        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{completedSteps} of {totalSteps} steps</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {workflowTemplate.steps.map((templateStep, index) => {
            const stepInstance = workflowInstance.stepInstances.find(
              instance => instance.stepId === templateStep.id
            )
            
            const StepIcon = stepTypeIcons[templateStep.type]
            const StatusIcon = stepInstance ? stepStatusIcons[stepInstance.status] : Clock
            const isActive = workflowInstance.currentStepId === templateStep.id
            
            return (
              <div key={templateStep.id} className="flex items-start space-x-4">
                {/* Step Number & Status */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepInstance?.status === 'completed' 
                      ? 'bg-green-100 text-green-600'
                      : isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {stepInstance?.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{templateStep.order}</span>
                    )}
                  </div>
                  
                  {index < workflowTemplate.steps.length - 1 && (
                    <div className={`w-px h-8 mt-2 ${
                      stepInstance?.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${isActive ? 'text-blue-600' : ''}`}>
                      {templateStep.name}
                    </h4>
                    
                    <Badge variant="outline" className="text-xs">
                      <StepIcon className="w-3 h-3 mr-1" />
                      {templateStep.type}
                    </Badge>
                    
                    {stepInstance && (
                      <Badge className={stepStatusColors[stepInstance.status]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {stepInstance.status.replace('_', ' ')}
                      </Badge>
                    )}
                    
                    {templateStep.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  
                  {templateStep.description && (
                    <p className="text-sm text-gray-600 mb-2">{templateStep.description}</p>
                  )}
                  
                  {/* Step Details */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {templateStep.assigneeRoles.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{templateStep.assigneeRoles.join(', ')}</span>
                      </div>
                    )}
                    
                    {templateStep.timeLimit && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{templateStep.timeLimit}h limit</span>
                      </div>
                    )}
                    
                    {stepInstance?.assigneeId && (
                      <div className="flex items-center space-x-1">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs">U</AvatarFallback>
                        </Avatar>
                        <span>Assigned</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamps */}
                  {stepInstance && (
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      {stepInstance.startedAt && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Started {new Date(stepInstance.startedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {stepInstance.completedAt && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed {new Date(stepInstance.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Comments */}
                  {stepInstance?.comment && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p className="text-gray-700">"{stepInstance.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}