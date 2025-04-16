"use client"

import { CalendarIcon, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SubscriptionInfoProps {
  type: "monthly" | "annual"
  startDate: Date
  endDate: Date
  price: number
  status: "active" | "expired" | "pending"
}

export function SubscriptionInfo({ type, startDate, endDate, price, status }: SubscriptionInfoProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Actif"
      case "expired":
        return "Expiré"
      case "pending":
        return "En attente"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Abonnement</CardTitle>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
        <CardDescription>{type === "monthly" ? "Abonnement mensuel" : "Abonnement annuel"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Période</span>
          </div>
          <span className="text-sm font-medium">
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Tarif</span>
          </div>
          <span className="text-sm font-medium">
            {price.toFixed(2)} € / {type === "monthly" ? "mois" : "an"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
