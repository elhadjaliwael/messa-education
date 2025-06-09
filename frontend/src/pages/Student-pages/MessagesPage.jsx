import { useState, useEffect } from "react"
import MessagesContactSideBar from "./MessagesContactSideBar"
import MessagesChatArea from "./MessagesChatArea"
import useMessageStore from "@/store/messageStore"
import useAuth from "@/hooks/useAuth"
import { axiosPrivate } from "@/api/axios"
import { classes } from "@/data/tunisian-education"

export default function MessagesPage() {
  const { auth } = useAuth() // Get current user from auth context
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
 // Get state and actions from Zustand store
  const { 
    contacts, 
    setContacts,
    selectedContact, 
    sendMessage,
    getMessagesForSelectedContact
  } = useMessageStore()
  // Initialize socket connection
  useEffect(() => {
    if (auth) {
      
      const fetchContacts = async () => {
        try {
          if (auth) {
            // Different approach based on user role
            if (auth.user.role === 'teacher') {
              // For teachers: Get subjects and classes they teach
              const teacherProfile = await axiosPrivate.get(`/auth/teachers/${auth.user.id}`);
              const teacherSubject = teacherProfile.data.subject;
              const teacherClasses = teacherProfile.data.classes || [];
              // Create contact groups based on subjects and classes
              const contactGroups = [];
              for (const classLevel of teacherClasses) {
                // Get subjects for this class level
                const classSubjects = classes[classLevel] || [];
                
                // Find the subject object that matches the teacher's subject
                const subjectObj = classSubjects.find(subject => 
                  subject.name === teacherSubject
                );
                if (subjectObj) {
                  // Get students for this class
                  const studentsResponse = await axiosPrivate.get(`/auth/students/by-class/${classLevel}`);
                  const students = studentsResponse.data;
                  
                  // Get other teachers who teach the same subject for this class
                  const teachersResponse = await axiosPrivate.get(`/auth/teachers/by-subject/${subjectObj.name}/level/${classLevel}`);
                  const otherTeachers = teachersResponse.data.filter(teacher => teacher.id !== auth.user.id);
                  
                  // Combine current teacher with other teachers
                  const allTeachers = [
                    {
                      id: auth.user.id,
                      username: auth.user.username,
                      avatar: teacherProfile.data.avatar,
                      subject: teacherSubject,
                      isCurrentUser: true
                    },
                    ...otherTeachers
                  ];
                  
                  contactGroups.push({
                    id: `group-${subjectObj.name}-${classLevel}`,
                    username: `${subjectObj.name} - ${classLevel}`,
                    isGroup: true,
                    subject: subjectObj.name,
                    level: classLevel,
                    icon: subjectObj.icon,
                    students: students,
  
                  teachers: allTeachers,
                    avatar: null,
                    online: true,
                    unread: false,
                    lastMessage: null
                  });
                }
              }
              setContacts(contactGroups);
            } else {
              // For students: Get their class level and create groups for each subject
              const studentLevel = auth.user.level;
              const studentSubjects = classes[studentLevel] || [];
              const contactGroups = [];
              
              // Get all students in the same class
              const studentsResponse = await axiosPrivate.get(`/auth/students/by-class/${studentLevel}`);
              const classmates = studentsResponse.data.filter(student => student.id !== auth.user.id);
              
              // Add current student to the list
              const currentStudent = {
                id: auth.user.id,
                username: auth.user.username,
                avatar: auth.user.avatar,
                isCurrentUser: true
              };
              
              // For each subject, create a group
              for (const subject of studentSubjects) {
                // Fetch teachers who teach this subject for this class level
                const teachersResponse = await axiosPrivate.get(`/auth/teachers/by-subject/${subject.name}/level/${studentLevel}`);
                const teachers = teachersResponse.data;
                
                contactGroups.push({
                  id: `group-${subject.name}-${studentLevel}`,
                  username: `${subject.name}`,
                  isGroup: true,
                  subject: subject.name,
                  level: studentLevel,
                  icon: subject.icon,
                  teachers: teachers,
                  students: [currentStudent, ...classmates],
                  avatar: null,
                  online: false,
                  unread: false,
                  lastMessage: null
                });
              }
              
              setContacts(contactGroups);
            }
          }
        } catch(err) {
          console.error("Error fetching contacts:", err);
        }
      }
      fetchContacts();
    }
    
  }, [auth, setContacts]);
  
  // Check if we're on mobile based on window width
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

  // Filter contacts based on search and active tab
  const [filteredContacts, setFilteredContacts] = useState([]);
  
  useEffect(() => {
    let filtered = [...contacts];
    
    if (activeTab === "unread") {
      filtered = filtered.filter(contact => contact.unread);
    } else if (activeTab === "online") {
      filtered = filtered.filter(contact => contact.online);
    }
    
    // Apply search filter if there's a search term
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredContacts(filtered);
  }, [contacts, activeTab, searchTerm]);

  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };
  
  // Get messages for the selected contact
  const messages = getMessagesForSelectedContact();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Messages</h1>
      </div>

      <div className="flex flex-1 rounded-lg border bg-white dark:border-slate-800 dark:bg-slate-950 relative overflow-hidden">
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
          bg-white dark:bg-slate-950 border-r dark:border-slate-800 h-full
        `}>
          <MessagesContactSideBar
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Chat area - full width on mobile */}
        <div className="flex-1 h-full">
          <MessagesChatArea
            selectedContact={selectedContact}
            messages={messages}
            sendMessage={sendMessage}
            onOpenSidebar={isMobile ? toggleSidebar : undefined}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  )
}