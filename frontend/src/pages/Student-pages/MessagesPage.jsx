import { useState, useEffect } from "react"
import MessagesContactSideBar from "./MessagesContactSideBar"
import MessagesChatArea from "./MessagesChatArea"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState(teachers[0])
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Check if we're on mobile based on window width
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let filtered = [...teachers];
    
    if (activeTab === "unread") {
      filtered = filtered.filter(teacher => teacher.unread);
    } else if (activeTab === "online") {
      filtered = filtered.filter(teacher => teacher.online);
    }
    
    // Apply search filter if there's a search term
    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTeachers(filtered);
  }, [teachers, activeTab, searchTerm]);

  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="h-[50%] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Messages</h1>
      </div>

      <div className="flex flex-1 rounded-lg border bg-white dark:border-slate-800 dark:bg-slate-950 relative">
        {/* Mobile sidebar overlay */}
        {isMobile && showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Contact sidebar - hidden on mobile unless toggled */}
        <div className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm' : 'w-80 md:w-96'} 
          ${isMobile && !showMobileSidebar ? 'translate-x-[-100%]' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
          bg-white dark:bg-slate-950 border-r dark:border-slate-800
        `}>
          <MessagesContactSideBar
            teachers={filteredTeachers}
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            filteredTeachers={filteredTeachers}
            setActiveTab={setActiveTab}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Chat area - full width on mobile */}
        <div className="flex-1">
          <MessagesChatArea
            selectedContact={selectedContact}
            message={message}
            setMessage={setMessage}
            onOpenSidebar={isMobile ? toggleSidebar : undefined}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  )
}