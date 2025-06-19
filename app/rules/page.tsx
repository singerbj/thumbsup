"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Settings, Users, Filter, Trash2, Edit, Save, X, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock rules data
const mockRules = [
  {
    id: "rule-1",
    name: "Standard Content Approval",
    description: "Default approval flow for all content types",
    active: true,
    conditions: [
      { field: "content_type", operator: "equals", value: "any" },
      { field: "priority", operator: "equals", value: "normal" },
    ],
    approvers: [
      { role: "content_manager", required: true, order: 1 },
      { role: "brand_manager", required: true, order: 2 },
    ],
    settings: {
      parallel_approval: false,
      auto_approve_threshold: null,
      escalation_days: 3,
    },
  },
  {
    id: "rule-2",
    name: "High Priority Content",
    description: "Fast-track approval for urgent content",
    active: true,
    conditions: [{ field: "priority", operator: "equals", value: "high" }],
    approvers: [{ role: "content_manager", required: true, order: 1 }],
    settings: {
      parallel_approval: false,
      auto_approve_threshold: null,
      escalation_days: 1,
    },
  },
  {
    id: "rule-3",
    name: "Executive Content Review",
    description: "Additional review required for executive communications",
    active: true,
    conditions: [{ field: "content_type", operator: "equals", value: "executive_post" }],
    approvers: [
      { role: "content_manager", required: true, order: 1 },
      { role: "brand_manager", required: true, order: 2 },
      { role: "executive_assistant", required: true, order: 3 },
    ],
    settings: {
      parallel_approval: false,
      auto_approve_threshold: null,
      escalation_days: 2,
    },
  },
]

const roles = [
  { value: "content_manager", label: "Content Manager" },
  { value: "brand_manager", label: "Brand Manager" },
  { value: "executive_assistant", label: "Executive Assistant" },
  { value: "marketing_director", label: "Marketing Director" },
  { value: "social_media_manager", label: "Social Media Manager" },
]

const contentTypes = [
  { value: "any", label: "Any Content Type" },
  { value: "instagram_post", label: "Instagram Post" },
  { value: "instagram_story", label: "Instagram Story" },
  { value: "linkedin_post", label: "LinkedIn Post" },
  { value: "twitter_post", label: "Twitter Post" },
  { value: "executive_post", label: "Executive Communication" },
]

const priorities = [
  { value: "low", label: "Low Priority" },
  { value: "normal", label: "Normal Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
]

export default function RulesEngine() {
  const [rules, setRules] = useState(mockRules)
  const [editingRule, setEditingRule] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    active: true,
    conditions: [{ field: "content_type", operator: "equals", value: "any" }],
    approvers: [{ role: "", required: true, order: 1 }],
    settings: {
      parallel_approval: false,
      auto_approve_threshold: null,
      escalation_days: 3,
    },
  })

  const handleCreateRule = () => {
    const rule = {
      id: `rule-${Date.now()}`,
      ...newRule,
    }
    setRules([...rules, rule])
    setNewRule({
      name: "",
      description: "",
      active: true,
      conditions: [{ field: "content_type", operator: "equals", value: "any" }],
      approvers: [{ role: "", required: true, order: 1 }],
      settings: {
        parallel_approval: false,
        auto_approve_threshold: null,
        escalation_days: 3,
      },
    })
    setIsCreating(false)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, active: !rule.active } : rule)))
  }

  const addCondition = () => {
    setNewRule({
      ...newRule,
      conditions: [...newRule.conditions, { field: "content_type", operator: "equals", value: "any" }],
    })
  }

  const addApprover = () => {
    setNewRule({
      ...newRule,
      approvers: [...newRule.approvers, { role: "", required: true, order: newRule.approvers.length + 1 }],
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-gray-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rules Engine</h1>
                <p className="text-sm text-gray-600">Configure approval workflows and automation rules</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search rules..."
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
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Approval Rule</DialogTitle>
                  <DialogDescription>Define conditions and approval flow for content</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rule-name">Rule Name</Label>
                      <Input
                        id="rule-name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="Enter rule name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rule-description">Description</Label>
                      <Textarea
                        id="rule-description"
                        value={newRule.description}
                        onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                        placeholder="Describe when this rule should apply"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rule-active"
                        checked={newRule.active}
                        onCheckedChange={(checked) => setNewRule({ ...newRule, active: checked })}
                      />
                      <Label htmlFor="rule-active">Active</Label>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-medium">Conditions</Label>
                      <Button variant="outline" size="sm" onClick={addCondition}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {newRule.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Select
                            value={condition.field}
                            onValueChange={(value) => {
                              const updatedConditions = [...newRule.conditions]
                              updatedConditions[index].field = value
                              setNewRule({ ...newRule, conditions: updatedConditions })
                            }}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="content_type">Content Type</SelectItem>
                              <SelectItem value="priority">Priority</SelectItem>
                              <SelectItem value="assignee">Assignee</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.operator}
                            onValueChange={(value) => {
                              const updatedConditions = [...newRule.conditions]
                              updatedConditions[index].operator = value
                              setNewRule({ ...newRule, conditions: updatedConditions })
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="not_equals">Not Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.value}
                            onValueChange={(value) => {
                              const updatedConditions = [...newRule.conditions]
                              updatedConditions[index].value = value
                              setNewRule({ ...newRule, conditions: updatedConditions })
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {condition.field === "content_type" &&
                                contentTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              {condition.field === "priority" &&
                                priorities.map((priority) => (
                                  <SelectItem key={priority.value} value={priority.value}>
                                    {priority.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          {newRule.conditions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedConditions = newRule.conditions.filter((_, i) => i !== index)
                                setNewRule({ ...newRule, conditions: updatedConditions })
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approvers */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-medium">Approval Flow</Label>
                      <Button variant="outline" size="sm" onClick={addApprover}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Approver
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {newRule.approvers.map((approver, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            {approver.order}
                          </div>

                          <Select
                            value={approver.role}
                            onValueChange={(value) => {
                              const updatedApprovers = [...newRule.approvers]
                              updatedApprovers[index].role = value
                              setNewRule({ ...newRule, approvers: updatedApprovers })
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={approver.required}
                              onCheckedChange={(checked) => {
                                const updatedApprovers = [...newRule.approvers]
                                updatedApprovers[index].required = checked
                                setNewRule({ ...newRule, approvers: updatedApprovers })
                              }}
                            />
                            <Label className="text-sm">Required</Label>
                          </div>

                          {newRule.approvers.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedApprovers = newRule.approvers.filter((_, i) => i !== index)
                                setNewRule({ ...newRule, approvers: updatedApprovers })
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">Settings</Label>
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Parallel Approval</Label>
                          <p className="text-sm text-gray-500">Allow multiple approvers to review simultaneously</p>
                        </div>
                        <Switch
                          checked={newRule.settings.parallel_approval}
                          onCheckedChange={(checked) =>
                            setNewRule({
                              ...newRule,
                              settings: { ...newRule.settings, parallel_approval: checked },
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="escalation-days">Escalation Days</Label>
                        <Input
                          id="escalation-days"
                          type="number"
                          value={newRule.settings.escalation_days}
                          onChange={(e) =>
                            setNewRule({
                              ...newRule,
                              settings: { ...newRule.settings, escalation_days: Number.parseInt(e.target.value) },
                            })
                          }
                          className="w-24 mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">Days before escalating to next approver</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRule} disabled={!newRule.name.trim()}>
                    <Save className="w-4 h-4 mr-2" />
                    Create Rule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {rules
            .filter((rule) => rule.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${!rule.active ? "opacity-60" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <CardTitle className="flex items-center">
                            {rule.name}
                            {!rule.active && (
                              <Badge variant="secondary" className="ml-2">
                                Inactive
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{rule.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={rule.active} onCheckedChange={() => handleToggleRule(rule.id)} />
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Conditions */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Filter className="w-4 h-4 mr-2" />
                          Conditions
                        </h4>
                        <div className="space-y-2">
                          {rule.conditions.map((condition, condIndex) => (
                            <div key={condIndex} className="text-sm bg-gray-50 p-2 rounded">
                              <span className="font-medium">{condition.field.replace("_", " ")}</span>
                              <span className="mx-2 text-gray-500">{condition.operator}</span>
                              <span className="font-medium">{condition.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Approvers */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Approval Flow
                        </h4>
                        <div className="space-y-2">
                          {rule.approvers.map((approver, appIndex) => (
                            <div key={appIndex} className="flex items-center space-x-2 text-sm">
                              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                                {approver.order}
                              </div>
                              <span>{roles.find((r) => r.value === approver.role)?.label}</span>
                              {approver.required && (
                                <Badge variant="outline" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Settings */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Parallel Approval:</span>
                            <span className={rule.settings.parallel_approval ? "text-green-600" : "text-gray-500"}>
                              {rule.settings.parallel_approval ? "Yes" : "No"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Escalation:</span>
                            <span>{rule.settings.escalation_days} days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  )
}
