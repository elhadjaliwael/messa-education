"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Send, Paperclip, Smile, ImageIcon, Phone, Video, MoreVertical } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const teachers = [
  {
    id: 1,
    name: "Mme Dubois",
    subject: "Mathématiques",
    avatar: "/placeholder-user.jpg",
    initials: "MD",
    lastMessage: "Bonjour Alex, comment avance ton devoir sur les équations?",
    time: "10:30",
    unread: true,
    online: true,
  },
  {
    id: 2,
    name: "M. Martin",
    subject: "Français",
    avatar: "/placeholder-user.jpg",
    initials: "MM",
    lastMessage: "J'ai partagé des ressources pour la dissertation",
    time: "Hier",
    unread: false,
    online: false,
  },
  {
    id: 3,
    name: "Mme Leroy",
    subject: "Histoire-Géographie",
    avatar: "/placeholder-user.jpg",
    initials: "ML",
    lastMessage: "Merci pour ton exposé, c'était très bien!",
    time: "Hier",
    unread: false,
    online: true,
  },
  {
    id: 4,
    name: "M. Bernard",
    subject: "Sciences",
    avatar: "/placeholder-user.jpg",
    initials: "MB",
    lastMessage: "N'oublie pas le TP de demain",
    time: "Lundi",
    unread: false,
    online: false,
  },
]

export function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState(teachers[0])
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTeachers = teachers.filter(
    (teacher) =>
      (activeTab === "all" ||
        (activeTab === "unread" && teacher.unread) ||
        (activeTab === "online" && teacher.online)) &&
      (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Messages</h1>

      <div className="flex flex-1 overflow-hidden rounded-lg border bg-white dark:border-slate-800 dark:bg-slate-950">
        {/* Contacts sidebar */}
        <div className="w-80 border-r dark:border-slate-800">
          <div className="p-4 border-b dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-9 bg-slate-100 dark:bg-slate-800 border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="p-2 border-b dark:border-slate-800">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  Tous
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Non lus
                </TabsTrigger>
                <TabsTrigger value="online" className="flex-1">
                  En ligne
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="p-4 border-b dark:border-slate-800">
            <Select defaultValue="all">
              <SelectTrigger className="bg-slate-100 dark:bg-slate-800 border-0">
                <SelectValue placeholder="Sélectionner un professeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les professeurs</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.name} - {teacher.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="p-2">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                      selectedContact.id === teacher.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800",
                      teacher.unread && "bg-blue-50/50 dark:bg-blue-900/10",
                    )}
                    onClick={() => setSelectedContact(teacher)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                          {teacher.initials}
                        </AvatarFallback>
                      </Avatar>
                      {teacher.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-950"></span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900 dark:text-slate-50">{teacher.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{teacher.time}</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{teacher.subject}</p>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">{teacher.lastMessage}</p>
                    </div>
                    {teacher.unread && (
                      <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        1
                      </Badge>
                    )}
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aucun message trouvé</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 border-b p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                  {selectedContact.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">{selectedContact.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedContact.subject}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedContact.online ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Phone className="h-5 w-5 text-slate-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Appel audio</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Video className="h-5 w-5 text-slate-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Appel vidéo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="h-5 w-5 text-slate-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Plus d'options</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4 bg-slate-100 dark:bg-slate-800/50">
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    {selectedContact.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg rounded-bl-none bg-white p-3 shadow-sm dark:bg-slate-700">
                  <p className="text-slate-900 dark:text-slate-50">{selectedContact.lastMessage}</p>
                  <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">10:30</p>
                </div>
              </div>

              <div className="flex items-end justify-end gap-2">
                <div className="rounded-lg rounded-br-none bg-blue-600 p-3 text-white shadow-sm">
                  <p>Merci pour votre message. J'avance bien sur les exercices d'équations.</p>
                  <p className="mt-1 text-right text-xs text-blue-100">10:32</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="You" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    AL
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    {selectedContact.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg rounded-bl-none bg-white p-3 shadow-sm dark:bg-slate-700">
                  <p className="text-slate-900 dark:text-slate-50">
                    Excellent ! N'hésitez pas à me contacter si vous avez des questions.
                  </p>
                  <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">10:34</p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="rounded-full bg-slate-200 dark:bg-slate-700 px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
                  Aujourd'hui
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex gap-2">
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Paperclip className="h-5 w-5 text-slate-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Joindre un fichier</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <ImageIcon className="h-5 w-5 text-slate-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Envoyer une image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Smile className="h-5 w-5 text-slate-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insérer un emoji</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                placeholder="Écrivez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-800"
              />
              <Button className="rounded-full" size="icon" disabled={!message.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
