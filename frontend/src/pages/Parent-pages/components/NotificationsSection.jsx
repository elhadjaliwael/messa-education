import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function NotificationsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Notifications & Reminders
        </CardTitle>
        <CardDescription>
          Stay updated with your children's learning activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Example notification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full" />
                <div>
                  <h4 className="font-medium text-blue-800">New Course Available</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    "Advanced Mathematics" is now available for Emma.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-white border-blue-200 text-blue-700 hover:bg-blue-100">
                      View Course
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-blue-700 hover:bg-blue-100">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* ...more notifications */}
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationsSection