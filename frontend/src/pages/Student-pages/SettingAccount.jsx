import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Check, IdCardIcon, Loader2, User, Upload, ShieldCheck, BarChart2, Edit2, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
function SettingAccount() {
    const {auth,setAuth} = useAuth()
    const [accountForm, setAccountForm] = useState({
        username: auth?.user?.username || "alex_lee",
        email: auth?.user?.email || "alex@example.com",
        avatar: auth?.user?.avatar || "/placeholder-user.jpg"
    })
    const [isAccountSaving, setIsAccountSaving] = useState(false)
    const [accountError, setAccountError] = useState(null)

    const handleAccountChange = (e) => {
        setAccountForm({
          ...accountForm,
          [e.target.id]: e.target.value
        })
      }
      const saveAccountChanges = async (e) => {
        e.preventDefault();
        setIsAccountSaving(true);
        setAccountError(null);
        
        try {
          // Create FormData to handle file uploads
          const formData = new FormData();
          // Add text fields
          formData.append('username', accountForm.username);
          formData.append('email', accountForm.email);
          
          // If avatar is a File object, add it to FormData
          if (accountForm.avatar instanceof File) {
            formData.append('avatar', accountForm.avatar);
          } else if (typeof accountForm.avatar === 'string') {
            // If it's a string URL, pass it as avatarUrl
            formData.append('avatarUrl', accountForm.avatar);
          }
          
          // Use native fetch API instead of axios
          const response = await fetch('http://localhost:8000/api/auth/users/update-profile', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${auth.accessToken}`
            }
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}`);
          }
          const data = await response.json();
          if (data.user) {
            // If you have a function to update the user in auth context, call it here
            setAuth({
              ...auth,
              user: data.user
            });
          }
          
          toast.success("Compte mis à jour", {
            description: "Vos informations ont été enregistrées avec succès."
          });
        } catch (error) {
          console.error('Update error:', error);
          setAccountError(error.message || "Une erreur s'est produite lors de la mise à jour de votre compte.");
        } finally {
          setIsAccountSaving(false);
        }
      };
      const handleAvatarChange = () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/*'
        fileInput.onchange = (e) => {
          const file = e.target.files[0]
          if (file) {
            try {
              // Show preview of selected image
              const reader = new FileReader();
              reader.onload = (event) => {
                // Update form with file for upload and preview URL for display
                setAccountForm({
                  ...accountForm,
                  avatar: file,
                  // Store preview URL in a separate property if needed
                  previewUrl: event.target.result
                });
                
                toast.success("Image selected", {
                  description: "Click Save to update your profile picture."
                });
              };
              
              reader.readAsDataURL(file);
            } catch (error) {
              console.error('Error processing avatar:', error)
              setAccountError("Failed to process the selected image. Please try again.")
              toast.error("Processing failed", {
                description: "There was a problem with the selected image."
              });
            }
          }
        }
        fileInput.click()
      }
  return (
    <TabsContent value="account">
          <form onSubmit={saveAccountChanges}>
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="rounded-t-lg pb-6">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 " />
                  Account Information
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Mettez à jour les détails de votre compte.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Profile banner */}
                <div className="h-10 relative">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-6 left-12 w-20 h-20 rounded-full bg-white/20"></div>
                    <div className="absolute top-2 right-12 w-10 h-10 rounded-full bg-white/10"></div>
                    <div className="absolute bottom-4 left-1/3 w-16 h-16 rounded-full bg-white/10"></div>
                  </div>
                </div>
                
                {/* Main content with avatar overlapping banner */}
                <div className="px-6 pb-6 relative">
                  {/* Avatar positioned to overlap the banner */}
                  <div className="flex justify-between items-end -mt-12 mb-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-md transition-all duration-300 group-hover:shadow-lg" onClick={handleAvatarChange}>
                        <AvatarImage 
                          src={accountForm.previewUrl || accountForm.avatar} 
                          alt="User" 
                          className="object-cover" 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-2xl font-medium">
                          {accountForm.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarChange}>
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Save button moved to top right for better visibility */}
                    <Button 
                      type="submit" 
                      disabled={isAccountSaving}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                    >
                      {isAccountSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Error alert */}
                  {accountError && (
                    <Alert variant="destructive" className="animate-fadeIn mb-6">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <AlertDescription>{accountError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* User information cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Edit2 className="h-4 w-4 text-slate-400" />
                          Edit Profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        {/* Username */}
                        <div className="space-y-1.5">
                          <Label htmlFor="username" className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            Username
                          </Label>
                          <Input 
                            id="username" 
                            value={accountForm.username} 
                            onChange={handleAccountChange} 
                            required
                            className="transition-all focus-visible:ring-blue-500 border-slate-200 dark:border-slate-700"
                            placeholder="Enter your username"
                          />
                        </div>
                        
                        {/* Email */}
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            Email Address
                          </Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={accountForm.email} 
                            onChange={handleAccountChange} 
                            required
                            className="transition-all focus-visible:ring-blue-500 border-slate-200 dark:border-slate-700"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    {/* Read-only information card */}
                    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-slate-400" />
                          Account Details
                        </CardTitle>
                      </CardHeader>
                      {
                        auth?.user?.role === 'student' &&
                        <CardContent className="space-y-4 pt-0">
                          {/* User ID */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                              <IdCardIcon className="h-3.5 w-3.5 text-slate-400" />
                              ID
                            </Label>
                            <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all bg-slate-100 dark:bg-slate-800/60 rounded p-2.5 border border-slate-200 dark:border-slate-800">
                              {auth?.user?.id || 'Not available'}
                            </div>
                          </div>
                          
                          {/* User Level */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                              <BarChart2 className="h-3.5 w-3.5 text-slate-400" />
                              Level
                            </Label>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 rounded p-2.5 border border-slate-200 dark:border-slate-800">
                              <span className="font-medium text-xs text-slate-700 dark:text-slate-300">
                                {auth?.user?.level || 'Beginner'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      }
                    </Card>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

  )
}

export default SettingAccount