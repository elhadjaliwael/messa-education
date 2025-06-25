import React, { useState, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import useMessageStore from "@/store/messageStore"
import useAuth from '@/hooks/useAuth'
import { 
  Book, Languages, Calculator, TestTubeDiagonalIcon as Flask,
  Moon, Landmark, Leaf, Globe, Computer, Settings, Atom, Brain, 
  Activity, TrendingUp, Briefcase, BookOpen, Code, Database, 
  Server, Share2, Wrench as Tool
} from 'lucide-react'

function MessagesContactSideBar({ isMobile = false, toggleSidebar = () => {} }) {
  const { 
    contacts, 
    selectedContact, 
    setSelectedContact, 
    isConnected
  } = useMessageStore()
  
  const iconMap = {
    Book, Languages, Calculator, Flask, Moon, Landmark, Leaf, Globe,
    Computer, Settings, Atom, Brain, Activity, TrendingUp, Briefcase,
    BookOpen, Code, Database, Server, Share2, Tool
  }
  
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  
  const { auth } = useAuth()
  const user = auth?.user

  const filteredContacts = useMemo(() => {
    let filtered = [...contacts]
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(contact => {
        if (contact.isGroup) {
          return contact.username?.toLowerCase().includes(searchLower) || 
                 contact.subject?.toLowerCase().includes(searchLower)
        }
        return contact.username?.toLowerCase().includes(searchLower) || 
               contact.subject?.toLowerCase().includes(searchLower)
      })
    }
    
    if (activeTab === "unread") {
      filtered = filtered.filter(contact => contact.unread)
    } else if (activeTab === "online") {
      filtered = filtered.filter(contact => contact.online)
    }
    
    if (selectedFilter !== "all") {
      filtered = filtered.filter(contact => contact.subject === selectedFilter)
    }
    
    return filtered
  }, [contacts, searchTerm, activeTab, selectedFilter])

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)
    if (isMobile) {
      toggleSidebar()
    }
  }

  const getContactIcon = (contact) => {
    if (contact.isGroup && contact.icon) {
      const IconComponent = iconMap[contact.icon]
      return IconComponent ? <IconComponent className="h-4 w-4" /> : <Book className="h-4 w-4" />
    }
    return null
  }

  const getContactInitials = (contact) => {
    if (contact.isGroup) {
      return contact.subject?.substring(0, 2).toUpperCase() || 'GR'
    }
    return contact.username?.substring(0, 2).toUpperCase() || 'U'
  }

  const uniqueSubjects = useMemo(() => {
    const subjects = contacts
      .filter(contact => contact.isGroup && contact.subject)
      .map(contact => contact.subject)
    return [...new Set(subjects)]
  }, [contacts])

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Conversations
          </h2>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">En ligne</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Hors ligne</span>
            </div>
          )}
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>
        
        {/* Filter */}
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par matière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les matières</SelectItem>
            {uniqueSubjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="unread">Non lus</TabsTrigger>
            <TabsTrigger value="online">En ligne</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  {searchTerm ? 'Aucun résultat trouvé' : 'Aucune conversation'}
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                    selectedContact?.id === contact.id && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
                        {getContactIcon(contact) || getContactInitials(contact)}
                      </AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                        {contact.username}
                      </p>
                      {contact.unread && (
                        <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {contact.unreadCount || '!'}
                        </Badge>
                      )}
                    </div>
                    
                    {contact.lastMessage && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {contact.lastMessage}
                      </p>
                    )}
                    
                    {contact.isGroup && (
                      <div className="flex items-center gap-1 mt-1">
                        {getContactIcon(contact)}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {contact.subject}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default MessagesContactSideBar