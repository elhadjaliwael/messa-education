import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { Dialog,DialogTrigger,DialogContent,DialogHeader,DialogClose,DialogTitle,DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

function ChildrenSidebar({ children, selectedChild, handleChildSelect,handleChildAdd }) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users size={18} />
          My Children
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children.map(child => (
            <div
              key={child.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChild === child.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted"
              }`}
              onClick={() => handleChildSelect(child.id)}
            >
              <Avatar>
                <AvatarImage src={child.avatar} alt={child.username} />
                <AvatarFallback>{child.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{child.username}</p>
                <p className="text-sm text-muted-foreground">{child.level}</p>
              </div>
              
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus size={16} className="mr-2" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Child by ID</DialogTitle>
              <DialogDescription>
                Enter the unique ID of your child to add them.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4 mt-2"
              onSubmit={e => {
                e.preventDefault();
                handleChildAdd(e.target.childId.value);
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="child-id">
                  Child ID
                </label>
                <Input
                  id="child-id"
                  name="childId"
                  type="text"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" variant="primary">
                  Add
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default ChildrenSidebar