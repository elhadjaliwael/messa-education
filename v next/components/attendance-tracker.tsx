"use client"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Simuler des données de présence
const generateAttendanceData = () => {
  const today = new Date()
  const data = []

  // Générer des données pour les 3 derniers mois
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const currentMonth = subMonths(today, monthOffset)
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)

    const daysInMonth = eachDayOfInterval({ start, end })

    daysInMonth.forEach((date) => {
      // Simuler une présence aléatoire (70% de chance d'être présent)
      // Mais seulement pour les jours passés
      const isPastDay = date <= today
      const isPresent = isPastDay && Math.random() > 0.3

      if (isPresent) {
        // Générer une heure aléatoire entre 8h et 18h
        const hour = Math.floor(Math.random() * 10) + 8
        const minute = Math.floor(Math.random() * 60)
        const loginTime = new Date(date)
        loginTime.setHours(hour, minute)

        data.push({
          date,
          isPresent,
          loginTime,
        })
      } else {
        data.push({
          date,
          isPresent: false,
          loginTime: null,
        })
      }
    })
  }

  return data
}

const attendanceData = generateAttendanceData()

export function AttendanceTracker() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const start = startOfMonth(currentMonth)
  const end = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start, end })

  const previousMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1))
  }

  const nextMonth = () => {
    const nextMonthDate = new Date(currentMonth)
    nextMonthDate.setMonth(currentMonth.getMonth() + 1)

    // Ne pas permettre de naviguer au-delà du mois actuel
    if (nextMonthDate <= new Date()) {
      setCurrentMonth(nextMonthDate)
    }
  }

  // Obtenir les données pour le mois affiché
  const monthData = attendanceData.filter((item) => isSameMonth(item.date, currentMonth))

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">Suivi de présence</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy", { locale: fr })}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        <div>Lun</div>
        <div>Mar</div>
        <div>Mer</div>
        <div>Jeu</div>
        <div>Ven</div>
        <div>Sam</div>
        <div>Dim</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          // Trouver les données pour ce jour
          const dayData = monthData.find(
            (d) => d.date.getDate() === day.getDate() && d.date.getMonth() === day.getMonth(),
          )

          const isPresent = dayData?.isPresent || false
          const loginTime = dayData?.loginTime

          // Calculer le décalage pour le premier jour du mois
          const startOffset = start.getDay() === 0 ? 6 : start.getDay() - 1

          // Appliquer le style de décalage uniquement pour le premier jour
          const offsetStyle = index === 0 ? { gridColumnStart: startOffset + 1 } : {}

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    style={offsetStyle}
                    className={`h-10 w-full rounded-md flex items-center justify-center ${
                      isPresent
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isPresent
                    ? `Connecté le ${format(day, "d MMMM", { locale: fr })} à ${format(loginTime, "HH:mm")}`
                    : `Aucune connexion le ${format(day, "d MMMM", { locale: fr })}`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}
