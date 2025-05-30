import React, { useState, useEffect, useMemo } from 'react'
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
  Book, 
  Languages, 
  Calculator, 
  TestTubeDiagonalIcon as Flask,
  Moon, 
  Landmark, 
  Leaf, 
  Globe, 
  Computer, 
  Settings, 
  Atom, 
  Brain, 
  Activity, 
  TrendingUp, 
  Briefcase, 
  BookOpen, 
  Code, 
  Database, 
  Server, 
  Share2, 
  Wrench as Tool,
} from 'lucide-react';

function MessagesContactSideBar({
  isMobile = false,
  toggleSidebar = () => {},
}) {
  // Get state and actions from message store
  const { 
    contacts, 
    selectedContact, 
    setSelectedContact, 
    isConnected,
    socket
  } = useMessageStore();
  
  const iconMap = {
    Book: Book,
    Languages: Languages,
    Calculator: Calculator,
    Flask: Flask,
    Moon: Moon,
    Landmark: Landmark,
    Leaf: Leaf,
    Globe: Globe,
    Computer: Computer,
    Settings: Settings,
    Atom: Atom,
    Brain: Brain,
    Activity: Activity,
    TrendingUp: TrendingUp,
    Briefcase: Briefcase,
    BookOpen: BookOpen,
    Code: Code,
    Database: Database,
    Server: Server,
    Share2: Share2,
    Tool: Tool
  };
  
  // Local state for UI controls
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  const { auth } = useAuth();
  const user = auth?.user;

  // Filter contacts based on search term and active tab
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => {
        // Search in group name/subject
        if (contact.isGroup) {
          return contact.username?.toLowerCase().includes(searchLower) || 
                 contact.subject?.toLowerCase().includes(searchLower);
        }
        // Search in individual contact
        return contact.username?.toLowerCase().includes(searchLower) || 
               contact.subject?.toLowerCase().includes(searchLower);
      });
    }
    
    // Apply tab filter
    if (activeTab === "unread") {
      filtered = filtered.filter(contact => contact.unread);
    } else if (activeTab === "online") {
      filtered = filtered.filter(contact => contact.online);
    }
    
    return filtered;
  }, [contacts, searchTerm, activeTab]);

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    
    // If a specific contact is selected (not "all"), find and set that contact
    if (value !== "all") {
      const selectedContactObj = contacts.find(contact => contact.id.toString() === value);
      if (selectedContactObj) {
        setSelectedContact(selectedContactObj);
      }
    }
  }

  const clearSearch = () => {
    setSearchTerm("");
  }

  // Determine label based on user role
  const contactsLabel = user?.role === 'teacher' ? 'Étudiants' : 'Professeurs';

  // Generate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="h-full flex flex-col w-full">
      {/* Connection status indicator */}
      {!isConnected && socket && (
        <div className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs p-2 text-center">
          Reconnexion en cours...
        </div>
      )}
      
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

      {/* Fixed header section */}
      <div className="flex-none">
        <div className="p-3 sm:p-4 border-b dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 pr-9 bg-slate-100 dark:bg-slate-800 border-0 mt-4 focus-visible:ring-2 focus-visible:ring-blue-500"
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
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1 text-xs sm:text-sm">
                Tous
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 text-xs sm:text-sm">
                Non lus
                {contacts.filter(c => c.unread).length > 0 && (
                  <Badge variant="secondary" className="ml-1 sm:ml-1.5 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    {contacts.filter(c => c.unread).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="online" className="flex-1 text-xs sm:text-sm">
                En ligne
                {contacts.filter(c => c.online).length > 0 && (
                  <Badge variant="secondary" className="ml-1 sm:ml-1.5 text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
                    {contacts.filter(c => c.online).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-4 border-b dark:border-slate-800">
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder={`Sélectionner un ${contactsLabel.slice(0, -1)}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les {contactsLabel}</SelectItem>
              {contacts.map((contact) => (
                <SelectItem 
                  key={contact.id} 
                  value={contact.id.toString()}
                >
                  {contact.username} - {contact.subject || contact.class}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Scrollable contacts list - takes remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
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
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  className={cn(
                    "flex w-full items-center gap-3 mt-3 rounded-lg p-3 text-left transition-colors",
                    selectedContact?.id === contact.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent",
                    contact.unread && "bg-blue-50/50 dark:bg-blue-900/10",
                  )}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (isMobile) toggleSidebar();
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      {contact.isGroup ? (
                        // Group avatar with subject icon
                        <>
                          {contact.icon && iconMap[contact.icon] ? (
                            <div className="flex items-center justify-center w-full h-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                              {React.createElement(iconMap[contact.icon], { className: "h-5 w-5 sm:h-6 sm:w-6" })}
                            </div>
                          ) : (
                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                              {getInitials(contact.subject)}
                            </AvatarFallback>
                          )}
                        </>
                      ) : (
                        // Individual contact avatar
                        <>
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.username} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-xs sm:text-sm">
                            {getInitials(contact.username)}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-950"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm sm:text-base text-slate-900 dark:text-slate-50 truncate">
                        {contact.username}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{contact.time}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ">
                      {contact.isGroup ? (
                        // For groups, show the class level
                        `${contact.level?.replace(/_/g, ' ')}`
                      ) : (
                        // For individual contacts, show class or subject
                        user?.role === 'teacher' ? contact.class : contact.subject
                      )}
                    </p>
                    {contact.isGroup && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.role === 'teacher' ? 
                          `${contact.students?.length || 0} étudiants` : 
                          `${contact.teachers?.length || 0} professeurs`}
                      </p>
                    )}
                    {!contact.isGroup && contact.lastMessage && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{contact.lastMessage}</p>
                    )}
                  </div>
                  {contact.unread && (
                    <Badge variant="default" className="h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      1
                    </Badge>
                  )}
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-3">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-1">Aucun résultat</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Aucun {contactsLabel.toLowerCase()} ne correspond à votre recherche.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default MessagesContactSideBar