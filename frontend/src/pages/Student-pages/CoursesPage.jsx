import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Pi, Filter, Lock, CheckCircle, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import useAuth  from "@/hooks/useAuth"
import { classes } from "@/data/tunisian-education"
import SubjectsList from "./SubjectList"


export default function CoursesPage() {
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(true) // Show subscription modal by default
  const {auth} = useAuth()
  const subjectList = classes[auth.user.level]
  const handleSubscription = () => {
    // Handle subscription payment
    // For demo purposes, we'll just close the modal and set a flag
    localStorage.setItem('hasSeenSubscriptionModal', 'true')
    setShowSubscriptionModal(false)
  }

  const dismissSubscriptionModal = () => {
    localStorage.setItem('hasSeenSubscriptionModal', 'true')
    setShowSubscriptionModal(false)
  }



  // Check if user has seen the subscription modal before
  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenSubscriptionModal')
    if (hasSeenModal) {
      setShowSubscriptionModal(false)
    }
  }, [])


  
  return (
    <>
      <motion.div 
        className="mb-12 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-8">Nos matières</h2>
        <SubjectsList classLevel={auth.user.level} setSelectedSubject={setSelectedSubject}></SubjectsList>
      </motion.div>
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            className="bg-card text-card-foreground p-6 rounded-xl max-w-lg w-full shadow-xl border"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="absolute top-4 right-4">
              <button 
                onClick={dismissSubscriptionModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Accès illimité à tous les cours</h3>
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">Offre spéciale</div>
              <p className="text-muted-foreground">Débloquez tous les cours et ressources pédagogiques avec notre abonnement premium</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Abonnement Premium</span>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">49,99 €</span>
                  <span className="text-muted-foreground ml-1">/mois</span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Accès à tous les cours</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Ressources téléchargeables</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Exercices corrigés</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  <span>Support pédagogique</span>
                </li>
              </ul>
              
              <div className="text-sm text-muted-foreground">
                Annulez à tout moment. Pas d'engagement.
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={dismissSubscriptionModal}
              >
                Plus tard
              </Button>
              <Button 
                onClick={handleSubscription}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                S'abonner maintenant
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}