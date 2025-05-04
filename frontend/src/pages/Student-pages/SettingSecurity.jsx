import React from 'react'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { AlertCircle, Check, CircleGauge, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {toast} from'sonner'
import { Eye,EyeOff } from 'lucide-react'
import axios from 'axios'
import { axiosPrivate } from '@/api/axios'
function SettingSecurity() {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    })
    const [passwordChecks, setPasswordChecks] = useState({
        hasMinLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        passwordsMatch: false
    })
    const [isPasswordSaving, setIsPasswordSaving] = useState(false)
    const [passwordError, setPasswordError] = useState(null)
    
    // Check password requirements in real-time
    useEffect(() => {
        const { newPassword, confirmPassword } = passwordForm
        
        setPasswordChecks({
            hasMinLength: newPassword.length >= 8,
            hasUppercase: /[A-Z]/.test(newPassword),
            hasNumber: /[0-9]/.test(newPassword),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
            passwordsMatch: newPassword === confirmPassword && newPassword !== ""
        })
    }, [passwordForm.newPassword, passwordForm.confirmPassword])
    
    const handlePasswordChange = (e) => {
        setPasswordForm({
          ...passwordForm,
          [e.target.id]: e.target.value
        })
    }
    
    // Calculate password strength
    const getPasswordStrength = () => {
        const { hasMinLength, hasUppercase, hasNumber, hasSpecialChar } = passwordChecks
        const checks = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar]
        const passedChecks = checks.filter(check => check).length
        
        if (passedChecks === 0) return { strength: 0, label: "", color: "" }
        if (passedChecks === 1) return { strength: 25, label: "Weak", color: "bg-red-500" }
        if (passedChecks === 2) return { strength: 50, label: "Fair", color: "bg-orange-500" }
        if (passedChecks === 3) return { strength: 75, label: "Good", color: "bg-yellow-500" }
        return { strength: 100, label: "Strong", color: "bg-green-500" }
    }
    
    const passwordStrength = getPasswordStrength()
    
    const savePasswordChanges = async (e) => {
        e.preventDefault()
        setIsPasswordSaving(true)
        setPasswordError(null)
        
        // Comprehensive validation
        if (!passwordChecks.hasMinLength || !passwordChecks.hasUppercase || 
            !passwordChecks.hasNumber || !passwordChecks.hasSpecialChar) {
          setPasswordError("Votre mot de passe ne répond pas aux exigences de sécurité.")
          setIsPasswordSaving(false)
          return
        }
        
        if (!passwordChecks.passwordsMatch) {
          setPasswordError("Les mots de passe ne correspondent pas.")
          setIsPasswordSaving(false)
          return
        }
        
        try {
          // Simulate API call
          const response = await axiosPrivate.post("/auth/users/change-password", passwordForm)
          if(response.status === 200){
            setPasswordForm({
              currentPassword: "",
              newPassword: "",
              confirmPassword: ""
            })
            toast.success("Mot de passe mis à jour", {
              description: "Votre mot de passe a été modifié avec succès."
            })
          }
        } catch (error) {
          setPasswordError(error.response?.data?.message || "Une erreur s'est produite lors de la mise à jour du mot de passe.")
        } finally {
          setIsPasswordSaving(false)
        }
    }
    
    return (
        <TabsContent value="security">
          <form onSubmit={savePasswordChanges}>
            <Card className="border-0 shadow-md">
              <CardHeader className=" rounded-t-lg pb-6">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Security
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Update your account password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {passwordError && (
                  <Alert variant="destructive" className="animate-fadeIn">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                      </svg>
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={passwordVisibility.currentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword} 
                        onChange={handlePasswordChange} 
                        required
                        className="transition-all focus-visible:ring-purple-500 pr-10"
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        onClick={() => setPasswordVisibility({...passwordVisibility, currentPassword: !passwordVisibility.currentPassword})}
                      >
                        {passwordVisibility.currentPassword ? 
                          <EyeOff size={16} /> : 
                          <Eye size={16} />
                        }
                      </button>
                    </div>
                  </div>
                  
                  
                  <div className="md:col-span-2 p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Exigences de sécurité</h3>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={passwordChecks.hasMinLength ? "text-green-500" : "text-slate-400"}>
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        At least 8 caractères
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={passwordChecks.hasUppercase ? "text-green-500" : "text-slate-400"}>
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        At least 1 uppercase letter
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={passwordChecks.hasNumber ? "text-green-500" : "text-slate-400"}>
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        At least 1 number
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={passwordChecks.hasSpecialChar ? "text-green-500" : "text-slate-400"}>
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        At least 1 special character
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={passwordChecks.passwordsMatch ? "text-green-500" : "text-slate-400"}>
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        Passwords match
                      </li>
                    </ul>
                    
                    {passwordForm.newPassword && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">Password strength: </span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.label === "Strong" ? "text-green-500" : 
                            passwordStrength.label === "Good" ? "text-yellow-500" : 
                            passwordStrength.label === "Fair" ? "text-orange-500" : 
                            passwordStrength.label === "Weak" ? "text-red-500" : ""
                          }`}>{passwordStrength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      New password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        type={passwordVisibility.newPassword ? "text" : "password"}
                        value={passwordForm.newPassword} 
                        onChange={handlePasswordChange} 
                        required
                        className="transition-all focus-visible:ring-purple-500 pr-10"
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        onClick={() => setPasswordVisibility({...passwordVisibility, newPassword:!passwordVisibility.newPassword})}
                      >
                        {passwordVisibility.newPassword ? 
                          <EyeOff size={16} /> : 
                          <Eye size={16} />
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={passwordVisibility.confirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword} 
                        onChange={handlePasswordChange} 
                        required
                        className="transition-all focus-visible:ring-purple-500 pr-10"
                        placeholder="Entrez votre mot de passe actuel"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        onClick={() => setPasswordVisibility({...passwordVisibility, confirmPassword:!passwordVisibility.confirmPassword})}
                      >
                        {passwordVisibility.confirmPassword ? 
                          <EyeOff size={16} /> : 
                          <Eye size={16} />
                        }
                      </button>
                    </div>
                    {passwordForm.confirmPassword && !passwordChecks.passwordsMatch && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end py-4 px-6 rounded-b-lg">
                <Button 
                  type="submit" 
                  disabled={isPasswordSaving || !passwordChecks.hasMinLength || !passwordChecks.hasUppercase || 
                    !passwordChecks.hasNumber || !passwordChecks.hasSpecialChar || !passwordChecks.passwordsMatch}
                  className="bg-purple-600 hover:bg-purple-700 transition-all duration-300"
                >
                  {isPasswordSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
    )
}

export default SettingSecurity