import React, { use, useEffect } from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TabsContent } from "@/components/ui/tabs"
import {toast} from'sonner'
import { Loader2 } from 'lucide-react'
import  useTheme  from '@/hooks/useTheme'
function SettingApperance() {
    const {setTheme,theme} = useTheme();
    const [appearance, setAppearance] = useState({
        theme,
        language: "fr",
        fontSize: "medium"
      })
    useEffect(() => {
      if(theme){
        setAppearance({...appearance, theme})
      }
    },[theme])
      const [isAppearanceSaving, setIsAppearanceSaving] = useState(false)
      const saveAppearanceChanges = async () => {
        setIsAppearanceSaving(true)
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          setTheme(appearance.theme)
          // Updated toast call
          toast.success("Préférences enregistrées", {
            description: "Vos préférences d'apparence ont été mises à jour."
          })
        } catch (error) {
          // Updated error toast
          toast.error("Erreur", {
            description: "Une erreur s'est produite lors de l'enregistrement de vos préférences."
          })
        } finally {
          setIsAppearanceSaving(false)
        }
      }
  return (
    <TabsContent value="appearance">
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Appearance
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Customize the appearance of the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              Thème
            </h3>
            <RadioGroup 
              value={appearance.theme} 
              onValueChange={(value) => setAppearance({...appearance, theme: value})}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <Label
                  htmlFor="light"
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${
                    appearance.theme === "light" 
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                      : "border-slate-200 dark:border-slate-700"
                  } p-3 cursor-pointer transition-all relative`}
                >
                  <div className={`mb-2 h-10 w-10 rounded-full flex items-center justify-center ${
                    appearance.theme === "light" ? "bg-indigo-100 dark:bg-indigo-800/30" : ""
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  </div>
                  <span className={`text-sm font-medium ${appearance.theme === "light" ? "text-indigo-600 dark:text-indigo-400" : ""}`}>Light</span>
                  {appearance.theme === "light" && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <Label
                  htmlFor="dark"
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${
                    appearance.theme === "dark" 
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                      : "border-slate-200 dark:border-slate-700"
                  } p-3  transition-all cursor-pointer relative`}
                >
                  <div className={`mb-2 h-10 w-10 rounded-full flex items-center justify-center ${
                    appearance.theme === "dark" ? "bg-indigo-100 dark:bg-indigo-800/30" : ""
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  </div>
                  <span className={`text-sm font-medium ${appearance.theme === "dark" ? "text-indigo-600 dark:text-indigo-400" : ""}`}>Dark</span>
                  {appearance.theme === "dark" && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <Label
                  htmlFor="system"
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${
                    appearance.theme === "system" 
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                      : "border-slate-200 dark:border-slate-700"
                  } p-3 cursor-pointer transition-all relative`}
                >
                  <div className={`mb-2 h-10 w-10 rounded-full flex items-center justify-center ${
                    appearance.theme === "system" ? "bg-indigo-100 dark:bg-indigo-800/30" : ""
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <span className={`text-sm font-medium ${appearance.theme === "system" ? "text-indigo-600 dark:text-indigo-400" : ""}`}>System</span>
                  {appearance.theme === "system" && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2 p-4 bg-white dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-700">
            <Label htmlFor="language" className="text-sm font-medium flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <path d="M5 8l6 6"></path>
                <path d="M4 14l6-6 2-3"></path>
                <path d="M2 5h12"></path>
                <path d="M7 2h1"></path>
                <path d="M22 22l-5-10-5 10"></path>
                <path d="M14 18h6"></path>
              </svg>
              Langue
            </Label>
            <Select 
              value={appearance.language}
              onValueChange={(value) => setAppearance({...appearance, language: value})}
            >
              <SelectTrigger id="language" className="transition-all focus-visible:ring-indigo-500">
                <SelectValue placeholder="Sélectionner une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
                <SelectItem value="ar">Arabe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 p-4 bg-white dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-700">
            <Label htmlFor="font-size" className="text-sm font-medium flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
              Taille d'affichage
            </Label>
            <Select 
              value={appearance.fontSize}
              onValueChange={(value) => setAppearance({...appearance, fontSize: value})}
            >
              <SelectTrigger id="font-size" className="transition-all focus-visible:ring-indigo-500">
                <SelectValue placeholder="Sélectionner une taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="medium">Normale</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={saveAppearanceChanges}
          disabled={isAppearanceSaving}
        >
          {isAppearanceSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  </TabsContent>
  )
}

export default SettingApperance