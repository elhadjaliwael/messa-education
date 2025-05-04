import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Check, Loader2 } from "lucide-react"
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
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to rounded-t-lg pb-6">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Account Information
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Mettez à jour les détails de votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {accountError && (
                  <Alert variant="destructive" className="animate-fadeIn">
                    <AlertCircle className="h-6 w-6 mr-2" />
                    <AlertDescription>{accountError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col sm:flex-row gap-8 items-center">
                  <div className="relative group">
                    <Avatar className="h-28 w-28 ring-4 ring-blue-100 dark:ring-blue-900 transition-all duration-300 group-hover:ring-blue-200 dark:group-hover:ring-blue-800" onClick={handleAvatarChange}>
                      <AvatarImage 
                        src={accountForm.previewUrl || accountForm.avatar} 
                        alt="User" 
                        className="object-cover" 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-2xl font-medium">
                        {accountForm.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarChange}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Username
                      </Label>
                      <Input 
                        id="username" 
                        value={accountForm.username} 
                        onChange={handleAccountChange} 
                        required
                        className="transition-all focus-visible:ring-blue-500"
                        placeholder="Entrez votre nom d'utilisateur"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                        Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={accountForm.email} 
                        onChange={handleAccountChange} 
                        required
                        className="transition-all focus-visible:ring-blue-500"
                        placeholder="Entrez votre adresse email"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end py-4 px-6 ">
                <Button 
                  type="submit" 
                  disabled={isAccountSaving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  {isAccountSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save 
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

  )
}

export default SettingAccount