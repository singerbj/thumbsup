"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, X } from "lucide-react"
import { contentCategories, getContentTypesByCategory, ContentTypeConfig } from "@/lib/content-types"
import { ContentType } from "@/types/workflow"

interface ContentTypeSelectorProps {
  onSelect: (contentType: ContentType) => void
  selectedType?: ContentType
}

export function ContentTypeSelector({ onSelect, selectedType }: ContentTypeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("social")

  const filteredTypes = getContentTypesByCategory(selectedCategory).filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search content types..."
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

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {contentCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTypes.map((contentType) => (
                <ContentTypeCard
                  key={contentType.id}
                  contentType={contentType}
                  isSelected={selectedType === contentType.id}
                  onSelect={() => onSelect(contentType.id)}
                />
              ))}
            </div>
            
            {filteredTypes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No content types found matching your search.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface ContentTypeCardProps {
  contentType: ContentTypeConfig
  isSelected: boolean
  onSelect: () => void
}

function ContentTypeCard({ contentType, isSelected, onSelect }: ContentTypeCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{contentType.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {contentType.category}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {contentType.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Platforms */}
          {contentType.platforms && contentType.platforms.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Platforms:</p>
              <div className="flex flex-wrap gap-1">
                {contentType.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Media Types */}
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Media Types:</p>
            <div className="flex flex-wrap gap-1">
              {contentType.mediaTypes.map((mediaType) => (
                <Badge key={mediaType} variant="outline" className="text-xs">
                  {mediaType}
                </Badge>
              ))}
            </div>
          </div>

          {/* Field Count */}
          <div className="text-xs text-gray-500">
            {contentType.fields.length} fields
          </div>
        </div>
      </CardContent>
    </Card>
  )
}