import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function MessagesContactSideBar({
  filteredTeachers,
  teachers, 
  selectedContact, 
  setSelectedContact, 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm,
  isMobile = false,
  toggleSidebar = () => {},
  isLoading = false
}) {
  const [selectedTeacher, setSelectedTeacher] = useState("all")

  const handleTeacherFilter = (value) => {
    setSelectedTeacher(value)
    
    // If a specific teacher is selected (not "all"), find and set that teacher as selected contact
    if (value !== "all") {
      const selectedTeacherObj = teachers.find(teacher => teacher.id.toString() === value)
      if (selectedTeacherObj) {
        setSelectedContact(selectedTeacherObj)
      }
    }
  }
    // Additional filtering logic could be added here

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="h-full flex rounded-2xl flex-col w-full max-w-full md:max-w-[320px] lg:max-w-[384px]">
      {/* Mobile header with close button */}
      {isMobile && (
        <div className="flex items-center justify-between p-3 sm:p-4 border-b dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-50">Messages</h2>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="p-3 rounded-2xl sm:p-4 border-b dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 pr-9 bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-2 border-b dark:border-slate-800">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
        }}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 text-xs sm:text-sm">
              Tous
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 text-xs sm:text-sm">
              Non lus
              {teachers.filter(t => t.unread).length > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-1.5 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                  {teachers.filter(t => t.unread).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="online" className="flex-1 text-xs sm:text-sm">
              En ligne
              {teachers.filter(t => t.online).length > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-1.5 text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
                  {teachers.filter(t => t.online).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="p-4 border-b dark:border-slate-800">
        <Select value={selectedTeacher} onValueChange={handleTeacherFilter}>
          <SelectTrigger className="bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Sélectionner un professeur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les professeurs</SelectItem>
            {teachers.map((teacher) => (
              <SelectItem 
                key={teacher.id} 
                value={teacher.id.toString()}
              >
                {teacher.name} - {teacher.subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>      
      <ScrollArea className="flex-1 h-[calc(100vh-20rem)] sm:h-[calc(100vh-22rem)] rounded-b-2xl overflow-hidden">
        <div className="p-2">
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 mt-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <button
                key={teacher.id}
                className={cn(
                  "flex w-full items-center gap-3 mt-3 rounded-lg p-3 text-left transition-colors",
                  selectedContact.id === teacher.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent",
                  teacher.unread && "bg-blue-50/50 dark:bg-blue-900/10",
                )}
                onClick={() => {
                  setSelectedContact(teacher)
                  if (isMobile) toggleSidebar()
                }}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-xs sm:text-sm">
                      {teacher.initials}
                    </AvatarFallback>
                  </Avatar>
                  {teacher.online && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-950"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-50">{teacher.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{teacher.time}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 ">{teacher.subject}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 ">{teacher.lastMessage}</p>
                </div>
                {teacher.unread && (
                  <Badge variant="default" className="h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    1
                  </Badge>
                )}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 sm:p-3 mb-2 sm:mb-3">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">Aucun message trouvé</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {searchTerm ? 
                  `Aucun résultat pour "${searchTerm}"` : 
                  "Aucune conversation disponible"
                }
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default MessagesContactSideBar