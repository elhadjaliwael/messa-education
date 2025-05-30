import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, BarChart } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

function ActivitiesTab({ activities }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Recent Activities
        </CardTitle>
        <CardDescription>
          Track your child's latest learning activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities && activities.length > 0 ? activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className="flex border-l-4 border-primary">
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={activity.score >= 60 ? "success" : "outline"}>
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-medium">{activity.subject}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      {activity.score !== undefined && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BarChart size={14} />
                          <span>Score: {activity.score}%</span>
                        </div>
                      )}
                      {activity.timeSpent && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen size={14} />
                          <span>Time: {activity.timeSpent}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )) : <div className="text-center text-muted-foreground">No activities found.</div>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default ActivitiesTab