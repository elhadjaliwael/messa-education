import React from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { TabsContent} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import {toast} from 'sonner'
function SettingNotification() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        deadlines: true,
        messages: true,
        updates: false
      })

  return (
    <TabsContent value="notifications">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-6" >
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Configurez comment et quand vous souhaitez être notifié.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Canaux de notification
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications" className="text-sm font-medium">Notifications par email</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Recevez des notifications par email
                        </p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications" className="text-sm font-medium">Notifications push</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Recevez des notifications sur votre appareil
                        </p>
                      </div>
                      <Switch 
                        id="push-notifications" 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    Types de notifications
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="deadline-notifications" className="text-sm font-medium">Échéances</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Notifications pour les devoirs
                        </p>
                      </div>
                      <Switch 
                        id="deadline-notifications" 
                        checked={notifications.deadlines}
                        onCheckedChange={(checked) => setNotifications({...notifications, deadlines: checked})}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="message-notifications" className="text-sm font-medium">Messages</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Notifications pour les messages
                        </p>
                      </div>
                      <Switch 
                        id="message-notifications" 
                        checked={notifications.messages}
                        onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="update-notifications" className="text-sm font-medium">Mises à jour</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Notifications pour les mises à jour
                        </p>
                      </div>
                      <Switch 
                        id="update-notifications" 
                        checked={notifications.updates}
                        onCheckedChange={(checked) => setNotifications({...notifications, updates: checked})}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end py-4 px-6">
              <Button 
                onClick={() => {
                  toast.success("Préférences enregistrées", {
                    description: "Vos préférences de notifications ont été mises à jour."
                  })
                }}
                className="bg-green-600 hover:bg-green-700 transition-all duration-300"
              >
                <Check className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
  )
}

export default SettingNotification